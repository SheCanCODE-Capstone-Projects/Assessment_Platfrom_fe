"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/feedback/Alert";
import Notification from "@/components/feedback/Notification";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import CandidateTable from "./_components/CandidateTable";
import CandidateDetailsModal from "./_components/CandidateDetailsModal";
import AssignCandidateModal from "./_components/AssignCandidateModal";
import AddCandidateModal from "./_components/AddCandidateModal";
import ExcelUploadModal from "./_components/ExcelUploadModal";
import ScheduleEmailModal from "./_components/ScheduleEmailModal";
import SearchBar from "./_components/SearchBar";
import DropdownButton from "./_components/DropdownButton";
import type { Candidate } from "./_data/types";
import * as api from "./_api";
import type { ApiAssessment, BulkUploadResult } from "./_api";
import { getAuthToken } from "@/lib/auth";

// ── BackButton ────────────────────────────────────────────────────────────────

function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => {
        router.back();
        setTimeout(() => { if (window.history.length <= 1) router.push("/admin"); }, 0);
      }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CandidatesPage() {
  const router = useRouter();

  const [candidates,   setCandidates]   = useState<Candidate[]>([]);
  const [assessments,  setAssessments]  = useState<ApiAssessment[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [loadError,    setLoadError]    = useState("");
  const [search,       setSearch]       = useState("");
  const [selectedIds,  setSelectedIds]  = useState<Set<string>>(new Set());
  const [currentPage,  setCurrentPage]  = useState(1);
  const [detailsCandidate, setDetailsCandidate] = useState<Candidate | null>(null);

  const [assignOpen,   setAssignOpen]   = useState(false);
  const [editing,      setEditing]      = useState<Candidate | null>(null);
  const [addOpen,      setAddOpen]      = useState(false);
  const [excelOpen,    setExcelOpen]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null);

  const [scheduleOpen,    setScheduleOpen]    = useState(false);
  const [scheduleMode,    setScheduleMode]    = useState<"invite" | "reminder">("invite");
  const [scheduleTargets, setScheduleTargets] = useState<Candidate[]>([]);

  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "info" | "warning" } | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    variant: "success" | "error" | "info" | "warning";
    confirmTone: "green" | "red";
    onConfirm: () => void;
  } | null>(null);

  const reloadCandidates = useCallback(async () => {
    if (!getAuthToken()) {
      setLoadError("Please log in to view and manage candidates.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");
    try {
      const list = await api.loadCandidatesWithAssignments();
      setCandidates(list);
    } catch (err) {
      const message = (err as Error).message || "Failed to load candidates";
      if (
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("access denied") ||
        message.toLowerCase().includes("invalid or missing token")
      ) {
        setLoadError("Session expired or invalid. Please log in again.");
      } else {
        setLoadError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadCandidates();
    if (getAuthToken()) {
      api.fetchAssessments().then(setAssessments).catch(() => setAssessments([]));
    }
  }, [reloadCandidates]);

  // ── Filtering & pagination ───────────────────────────────────────────────────

  const filtered = useMemo(
    () => candidates.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [candidates, search],
  );

  const pageSize  = 5;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleCandidates = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { if (currentPage > pageCount) setCurrentPage(pageCount); }, [currentPage, pageCount]);
  useEffect(() => { setCurrentPage(1); }, [search]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function showToast(message: string, variant: "success" | "error" | "info" | "warning" = "success") {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  }

  function openConfirm(options: {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "success" | "error" | "info" | "warning";
    confirmTone?: "green" | "red";
    onConfirm: () => void;
  }) {
    setConfirmState({
      open: true,
      title:        options.title,
      description:  options.description,
      confirmLabel: options.confirmLabel ?? "Confirm",
      cancelLabel:  options.cancelLabel  ?? "Cancel",
      variant:      options.variant      ?? "info",
      confirmTone:  options.confirmTone  ?? "green",
      onConfirm:    options.onConfirm,
    });
  }

  function closeConfirm() { setConfirmState(null); }

  // ── CRUD (API) ───────────────────────────────────────────────────────────────

  type CandidateInput = Pick<Candidate, "name" | "email" | "phone" | "nationality" | "disability" | "exam">;

  async function handleAddSave(data: CandidateInput) {
    try {
      await api.createCandidate({
        name: data.name,
        email: data.email,
        phoneNumber: data.phone,
        language: api.examToLanguage(data.exam),
      });
      await reloadCandidates();
      showToast("Candidate added successfully");
    } catch (err) {
      showToast((err as Error).message || "Failed to add candidate", "error");
      throw err;
    }
  }

  async function handleEditSave(data: CandidateInput) {
    if (!editing) return;
    try {
      await api.updateCandidate(editing.id, {
        name: data.name,
        email: data.email,
        phoneNumber: data.phone,
        language: api.examToLanguage(data.exam),
      });
      await reloadCandidates();
      setEditing(null);
      setAddOpen(false);
      showToast("Candidate updated successfully");
    } catch (err) {
      showToast((err as Error).message || "Failed to update candidate", "error");
      throw err;
    }
  }

  function handleAddClose() {
    setAddOpen(false);
    setEditing(null);
  }

  function handleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(filtered.map((c) => c.id)) : new Set());
  }

  function handleSelectOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  async function handleAssign(candidateIds: string[], exam: string) {
    const assessment = assessments.find((a) => a.examTitle === exam);
    if (!assessment) {
      showToast("Assessment not found on server. Create an assessment first.", "error");
      return;
    }
    try {
      await api.assignExamBulk(assessment.assessmentId, candidateIds);
      await reloadCandidates();
      showToast(`Exam "${exam}" assigned to ${candidateIds.length} candidate${candidateIds.length !== 1 ? "s" : ""}`);
    } catch (err) {
      showToast((err as Error).message || "Failed to assign exam", "error");
    }
  }

  function requestAssign(candidateIds: string[], exam: string) {
    if (candidateIds.length === 0) return;
    openConfirm({
      title:        "Confirm assignment",
      description:  `Are you sure you want to assign ${exam} to ${candidateIds.length} candidate${candidateIds.length !== 1 ? "s" : ""}?`,
      confirmLabel: "Assign exam",
      variant:      "info",
      confirmTone:  "green",
      onConfirm: () => { handleAssign(candidateIds, exam); closeConfirm(); },
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await api.deleteCandidate(deleteTarget.id);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
      await reloadCandidates();
      showToast(`${deleteTarget.name} has been deleted`);
    } catch (err) {
      showToast((err as Error).message || "Failed to delete candidate", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  // ── Excel upload (API) ────────────────────────────────────────────────────────

  async function handleExcelSuccess(result: BulkUploadResult) {
    await reloadCandidates();
    showToast(
      `${result.created} candidate${result.created !== 1 ? "s" : ""} imported` +
      (result.skipped ? `, ${result.skipped} skipped` : ""),
    );
  }

  // ── Email schedule (API) ──────────────────────────────────────────────────────

  function openSchedule(mode: "invite" | "reminder", pool: Candidate[]) {
    if (pool.length === 0) {
      showToast(
        mode === "invite" ? "No candidates to invite." : "No candidates to remind.",
        "warning",
      );
      return;
    }
    setScheduleTargets(pool);
    setScheduleMode(mode);
    setScheduleOpen(true);
  }

  async function handleScheduleConfirm(startTime: string, endTime: string) {
    let sent = 0;
    let failed = 0;

    for (const candidate of scheduleTargets) {
      try {
        const link = await api.resolveCandidateExamLink(candidate);
        if (!link) {
          failed++;
          continue;
        }
        if (scheduleMode === "invite") {
          await api.sendInviteEmail({
            email: candidate.email,
            name: candidate.name,
            link,
            startTime,
            endTime,
          });
        } else {
          await api.sendReminderEmail({
            email: candidate.email,
            name: candidate.name,
            link,
            endTime,
          });
        }
        sent++;
      } catch {
        failed++;
      }
    }

    const label = scheduleMode === "invite" ? "Invite" : "Reminder";
    if (sent === 0) {
      showToast(
        `${label} could not be sent. Assign an exam first or verify the email API.`,
        "error",
      );
    } else if (failed > 0) {
      showToast(`${label} sent to ${sent}, failed for ${failed}`, "warning");
    } else {
      showToast(`${label} sent to ${sent} candidate${sent !== 1 ? "s" : ""}`, "success");
    }
    setSelectedIds(new Set());
  }

  // ── Invite / Reminder wrappers ────────────────────────────────────────────────

  function handleInviteSelected() {
    openSchedule("invite", candidates.filter((c) => selectedIds.has(c.id)));
  }

  function handleInviteAll() {
    if (filtered.length === 0) {
      showToast("No candidates to invite.", "warning");
      return;
    }
    openConfirm({
      title:        "Invite all candidates",
      description:  `Send invites to all ${filtered.length} candidate${filtered.length !== 1 ? "s" : ""}?`,
      confirmLabel: "Continue",
      variant:      "info",
      confirmTone:  "green",
      onConfirm: () => { closeConfirm(); openSchedule("invite", filtered); },
    });
  }

  function handleReminderSelected() {
    openSchedule("reminder", candidates.filter((c) => selectedIds.has(c.id)));
  }

  function handleReminderAll() {
    if (filtered.length === 0) {
      showToast("No candidates to remind.", "warning");
      return;
    }
    openConfirm({
      title:        "Send reminder to all",
      description:  `Send reminders to all ${filtered.length} candidate${filtered.length !== 1 ? "s" : ""}?`,
      confirmLabel: "Continue",
      variant:      "warning",
      confirmTone:  "green",
      onConfirm: () => { closeConfirm(); openSchedule("reminder", filtered); },
    });
  }

  // ── Icons ─────────────────────────────────────────────────────────────────────

  const EditIcon     = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
  const FileIcon     = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>;
  const ExamIcon     = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2h8a2 2 0 0 1 2 2v16l-6-3-6 3V4a2 2 0 0 1 2-2z" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>;
  const InviteIcon   = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5" /><path d="M3 8.5L12 13l9-4.5" /><path d="M12 13V4" /></svg>;
  const ReminderIcon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* Header */}
      <div className="w-full bg-white sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-emerald-600 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">Candidate Management</div>
              <div className="text-xs text-zinc-500">
                {loading ? "Loading…" : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""}`}
              </div>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-zinc-200/70" />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 flex flex-col gap-4">

        {loadError && (
          <Alert variant="error">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{loadError}</span>
              <div className="flex gap-2 shrink-0">
                {!getAuthToken() && (
                  <Button size="sm" tone="green" onClick={() => router.push("/admin/login")}>
                    Log in
                  </Button>
                )}
                <Button size="sm" variant="outline" tone="zinc" onClick={() => reloadCandidates()}>
                  Retry
                </Button>
              </div>
            </div>
          </Alert>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <DropdownButton
              label="Add Candidate"
              actions={[
                { label: "Manual Entry", icon: EditIcon, onClick: () => { setEditing(null); setAddOpen(true); } },
                { label: "Upload Excel", icon: FileIcon, onClick: () => setExcelOpen(true) },
              ]}
            />
            <DropdownButton
              label="Actions"
              actions={[
                { label: "Assign Exam", icon: ExamIcon, onClick: () => { setEditing(null); setAssignOpen(true); } },
                { label: "divider", icon: null, onClick: () => {}, disabled: true },
                {
                  label: selectedIds.size > 0 ? `Invite Selected (${selectedIds.size})` : "Invite Selected",
                  icon: InviteIcon, onClick: handleInviteSelected, disabled: selectedIds.size === 0,
                },
                { label: "Invite All", icon: InviteIcon, onClick: handleInviteAll, disabled: loading || candidates.length === 0 },
                { label: "divider", icon: null, onClick: () => {}, disabled: true },
                {
                  label: selectedIds.size > 0 ? `Send Reminder (${selectedIds.size})` : "Send Reminder",
                  icon: ReminderIcon, onClick: handleReminderSelected, disabled: selectedIds.size === 0,
                },
                { label: "Remind All", icon: ReminderIcon, onClick: handleReminderAll, disabled: loading || candidates.length === 0 },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white py-16 shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-emerald-600" />
            <p className="text-sm text-zinc-500">Loading candidates from server…</p>
          </div>
        ) : (
          <CandidateTable
            candidates={visibleCandidates}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onEdit={(c) => { setEditing(c); setAddOpen(true); }}
            onDelete={(id) => { const c = candidates.find((x) => x.id === id); if (c) setDeleteTarget(c); }}
            onViewDetails={(c) => setDetailsCandidate(c)}
          />
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-500">
            Showing {visibleCandidates.length} of {filtered.length} candidates
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm" variant="outline" tone="zinc"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index + 1)}
                  className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                    currentPage === index + 1
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <Button
              size="sm" variant="outline" tone="zinc"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddCandidateModal
        key={addOpen ? editing?.id ?? "add" : "add-closed"}
        open={addOpen}
        onClose={handleAddClose}
        onSave={editing ? handleEditSave : handleAddSave}
        editing={editing}
      />

      <ExcelUploadModal
        key={excelOpen ? "excel" : "excel-closed"}
        open={excelOpen}
        onClose={() => setExcelOpen(false)}
        onSuccess={handleExcelSuccess}
      />

      <AssignCandidateModal
        key={assignOpen ? editing?.id ?? "assign" : "assign-closed"}
        open={assignOpen}
        onClose={() => { setAssignOpen(false); setEditing(null); }}
        candidates={candidates}
        assessments={assessments}
        onRequestAssign={requestAssign}
        editing={editing}
      />

      <ScheduleEmailModal
        key={scheduleOpen ? scheduleMode : "schedule-closed"}
        open={scheduleOpen}
        mode={scheduleMode}
        targets={scheduleTargets}
        onClose={() => setScheduleOpen(false)}
        onConfirm={handleScheduleConfirm}
      />

      <CandidateDetailsModal
        key={detailsCandidate ? detailsCandidate.id : "details-closed"}
        open={!!detailsCandidate}
        onClose={() => setDetailsCandidate(null)}
        candidate={detailsCandidate}
      />

      <Modal
        key="delete"
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Candidate"
        size="sm"
        footer={
          <>
            <Button variant="outline" tone="zinc" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button tone="red" size="sm" onClick={confirmDelete}>Yes, Delete</Button>
          </>
        }
      >
        <Alert variant="error">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleteTarget?.name}</span>?
        </Alert>
      </Modal>

      {toast && (
        <Notification message={toast.message} variant={toast.variant} position="bottom" />
      )}

      {confirmState && (
        <ConfirmDialog
          key="confirm"
          open={confirmState.open}
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel}
          cancelLabel={confirmState.cancelLabel}
          variant={confirmState.variant}
          confirmTone={confirmState.confirmTone}
          onConfirm={confirmState.onConfirm}
          onClose={closeConfirm}
        />
      )}
    </div>
  );
}
