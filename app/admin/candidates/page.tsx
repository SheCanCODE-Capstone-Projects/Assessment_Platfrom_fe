"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/src/components/layout/Footer";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Alert from "@/src/components/feedback/Alert";
import Notification from "@/src/components/feedback/Notification";
import ConfirmDialog from "@/src/components/feedback/ConfirmDialog";
import CandidateTable from "./_components/CandidateTable";
import CandidateDetailsModal from "./_components/CandidateDetailsModal";
import AssignCandidateModal from "./_components/AssignCandidateModal";
import AddCandidateModal from "./_components/AddCandidateModal";
import ExcelUploadModal from "./_components/ExcelUploadModal";
import SearchBar from "./_components/SearchBar";
import DropdownButton from "./_components/DropdownButton";
import type { Candidate } from "./_data/types";
import type { ParsedRow } from "./_components/ExcelUploadModal";

let nextId = 1;

function getStoredCandidates(): Candidate[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("candidates");
    if (!stored) return [];
    const parsed: Candidate[] = JSON.parse(stored);
    // If stored data has old mock IDs (1-5 with old emails), clear it
    const hasOldMockData = parsed.some((c) =>
      ["ahmed@example.com", "sara@example.com", "omar@example.com", "lina@example.com", "khalid@example.com"].includes(c.email)
    );
    if (hasOldMockData) {
      localStorage.removeItem("candidates");
      return [];
    }
    const normalized = parsed.map((c) => ({
      ...c,
      nationality: c.nationality ?? "Other",
      disability: c.disability ?? "None",
    }));
    const maxId = normalized.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
    if (maxId >= nextId) nextId = maxId + 1;
    return normalized;
  } catch {
    return [];
  }
}

function makeLink() {
  return `https://platform.example.com/candidate/exam?token=${Math.random().toString(36).slice(2, 10)}`;
}

function BackButton() {
  const router = useRouter();
  return (
    <button type="button" aria-label="Back"
      onClick={() => { router.back(); setTimeout(() => { if (window.history.length <= 1) router.push("/admin"); }, 0); }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(() => getStoredCandidates());
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsCandidate, setDetailsCandidate] = useState<Candidate | null>(null);

  // Modals
  const [assignOpen, setAssignOpen] = useState(false);
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null);

  // Excel review queue — list of parsed rows waiting to be reviewed one by one
  const [reviewQueue, setReviewQueue] = useState<ParsedRow[]>([]);
  const [currentPrefill, setCurrentPrefill] = useState<ParsedRow | null>(null);

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

  // Persist candidates to localStorage on every change
  useEffect(() => {
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }, [candidates]);

  const filtered = useMemo(
    () => candidates.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [candidates, search]
  );

  const pageSize = 5; // Fixed page size
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleCandidates = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
      title: options.title,
      description: options.description,
      confirmLabel: options.confirmLabel ?? "Confirm",
      cancelLabel: options.cancelLabel ?? "Cancel",
      variant: options.variant ?? "info",
      confirmTone: options.confirmTone ?? "green",
      onConfirm: options.onConfirm,
    });
  }

  function closeConfirm() {
    setConfirmState(null);
  }

  type CandidateInput = Pick<Candidate, "name" | "email" | "phone" | "nationality" | "disability" | "exam">;

  function addCandidate(data: CandidateInput) {
    setCandidates((prev) => [{
      id: String(nextId++), ...data,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
      assessmentLink: makeLink(),
    }, ...prev]);
  }

  // Called when Excel upload is done — start review queue
  function handleExcelPreview(rows: ParsedRow[]) {
    if (rows.length === 0) return;
    const [first, ...rest] = rows;
    setReviewQueue(rest);
    setCurrentPrefill(first);
    setAddOpen(true);
  }

  // Called when user confirms a row in AddCandidateModal
  function handleAddSave(data: CandidateInput) {
    addCandidate(data);
    // If more rows in queue, open next one
    if (reviewQueue.length > 0) {
      const [next, ...rest] = reviewQueue;
      setReviewQueue(rest);
      setCurrentPrefill(next);
      // modal stays open via useEffect in AddCandidateModal
    } else {
      setCurrentPrefill(null);
      showToast("All candidates added successfully");
    }
  }

  // Called when editing a candidate
  function handleEditSave(data: CandidateInput) {
    if (!editing) return;
    setCandidates((prev) => prev.map((c) =>
      c.id === editing.id ? { ...c, ...data } : c
    ));
    setEditing(null);
    setAddOpen(false);
    showToast("Candidate updated successfully");
  }

  function handleAddClose() {
    setAddOpen(false);
    setCurrentPrefill(null);
    setReviewQueue([]);
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

  function handleAssign(candidateIds: string[], exam: string) {
    setCandidates((prev) => prev.map((c) =>
      candidateIds.includes(c.id) ? { ...c, exam } : c
    ));
    showToast(`Exam "${exam}" assigned to ${candidateIds.length} candidate${candidateIds.length !== 1 ? "s" : ""}`);
  }

  function requestAssign(candidateIds: string[], exam: string) {
    if (candidateIds.length === 0) return;
    openConfirm({
      title: "Confirm assignment",
      description: `Are you sure you want to assign ${exam} to ${candidateIds.length} candidate${candidateIds.length !== 1 ? "s" : ""}?`,
      confirmLabel: "Assign exam",
      variant: "info",
      confirmTone: "green",
      onConfirm: () => {
        handleAssign(candidateIds, exam);
        closeConfirm();
      },
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setCandidates((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
    showToast(`${deleteTarget.name} has been deleted`);
    setDeleteTarget(null);
  }

  function inviteSelected() {
    const targets = candidates.filter((c) => selectedIds.has(c.id));
    if (targets.length === 0) return;
    targets.forEach((c) => navigator.clipboard.writeText(c.assessmentLink));
    showToast(`Invite links copied for ${targets.length} candidate${targets.length !== 1 ? "s" : ""}`);
    setSelectedIds(new Set());
  }

  function handleInviteSelected() {
    const targets = candidates.filter((c) => selectedIds.has(c.id));
    if (targets.length === 0) return;
    openConfirm({
      title: "Confirm invite",
      description: `Are you sure you want to copy invite links for ${targets.length} selected candidate${targets.length !== 1 ? "s" : ""}?`,
      confirmLabel: "Copy links",
      variant: "info",
      confirmTone: "green",
      onConfirm: () => {
        inviteSelected();
        closeConfirm();
      },
    });
  }

  function inviteAll() {
    filtered.forEach((c) => navigator.clipboard.writeText(c.assessmentLink));
    showToast(`Invite links copied for all ${filtered.length} candidate${filtered.length !== 1 ? "s" : ""}`);
  }

  function handleInviteAll() {
    openConfirm({
      title: "Confirm invite all",
      description: `Are you sure you want to copy invite links for all ${filtered.length} candidates?`,
      confirmLabel: "Copy all links",
      variant: "info",
      confirmTone: "green",
      onConfirm: () => {
        inviteAll();
        closeConfirm();
      },
    });
  }

  // Icons
  const EditIcon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
  const FileIcon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>;
  const ExamIcon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2h8a2 2 0 0 1 2 2v16l-6-3-6 3V4a2 2 0 0 1 2-2z" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>;
  const InviteIcon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5" /><path d="M3 8.5L12 13l9-4.5" /><path d="M12 13V4" /></svg>;
  const PhoneIcon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;

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
              <div className="text-xs text-zinc-500">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</div>
    <div className="flex flex-1 flex-col bg-zinc-50">
      <div className="w-full bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
          <BackButton />
          <div className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded bg-emerald-600 text-white">
            <PeopleIcon />
          </div>
          <div className="ml-3 min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900">
              Candidate Management
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-zinc-200/70" />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 flex flex-col gap-4">
        {/* Toolbar — search + two dropdowns */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

            {/* Dropdown 1: Add Candidate */}
            <DropdownButton
              label="Add Candidate"
              actions={[
                { label: "Manual Entry",  icon: EditIcon, onClick: () => { setCurrentPrefill(null); setAddOpen(true); } },
                { label: "Upload Excel",  icon: FileIcon, onClick: () => setExcelOpen(true) },
              ]}
            />

            {/* Dropdown 2: Actions */}
            <DropdownButton
              label="Actions"
              actions={[
                { label: "Assign Exam", icon: ExamIcon, onClick: () => { setEditing(null); setAssignOpen(true); } },
                { label: "divider", icon: null, onClick: () => {}, disabled: true },
                {
                  label: selectedIds.size > 0 ? `Invite Selected (${selectedIds.size})` : "Invite Selected",
                  icon: InviteIcon,
                  onClick: handleInviteSelected,
                  disabled: selectedIds.size === 0,
                },
                { label: "Invite All", icon: InviteIcon, onClick: handleInviteAll },
              ]}
            />

          </div>
        </div>

        <CandidateTable
          candidates={visibleCandidates}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onEdit={(c) => { setEditing(c); setAddOpen(true); }}
          onDelete={(id) => { const c = candidates.find((x) => x.id === id); if (c) setDeleteTarget(c); }}
          onViewDetails={(c) => setDetailsCandidate(c)}
        />
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-500">
            Showing {visibleCandidates.length} of {filtered.length} candidates
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              tone="zinc"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="text-sm font-semibold text-zinc-900">
            How to Assign Candidates
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-600">
            To assign a candidate to an exam, share the assessment link with
            them. The link can be found on the Exam Management page.
          </p>

          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-[11px] text-emerald-900">
            <div className="font-medium">Example:</div>
            <div className="mt-1 break-all">
              https://fg.story_16809212.figma.site/candidate/exam
            </div>
            <div className="mt-2 text-emerald-800/90">
              When candidates click this link, they&apos;ll fill out their
              information and start the assessment.
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-500">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
              size="sm"
              variant="outline"
              tone="zinc"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Candidate modal — used for both manual entry and Excel review */}
      <AddCandidateModal
        key={addOpen ? editing?.id ?? currentPrefill?.email ?? "add" : "add-closed"}
        open={addOpen}
        onClose={handleAddClose}
        prefill={currentPrefill ?? undefined}
        onSave={editing ? handleEditSave : handleAddSave}
        editing={editing}
      />

      {/* Excel upload modal */}
      <ExcelUploadModal
        key={excelOpen ? "excel" : "excel-closed"}
        open={excelOpen}
        onClose={() => setExcelOpen(false)}
        onPreview={handleExcelPreview}
      />

      {/* Assign / Edit modal */}
      <AssignCandidateModal
        key={assignOpen ? editing?.id ?? "assign" : "assign-closed"}
        open={assignOpen}
        onClose={() => { setAssignOpen(false); setEditing(null); }}
        candidates={candidates}
        onRequestAssign={requestAssign}
        editing={editing}
      />

      <CandidateDetailsModal
        key={detailsCandidate ? detailsCandidate.id : "details-closed"}
        open={!!detailsCandidate}
        onClose={() => setDetailsCandidate(null)}
        candidate={detailsCandidate}
      />

      {/* Delete confirmation */}
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

      {/* Review queue progress indicator */}
      {reviewQueue.length > 0 && addOpen && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800 shadow">
          {reviewQueue.length} more candidate{reviewQueue.length !== 1 ? "s" : ""} to review
        </div>
      )}

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
