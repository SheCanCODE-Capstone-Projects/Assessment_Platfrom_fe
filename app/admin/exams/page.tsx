"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ExamCard, {
  type ExamCardData,
  type ExamStatus,
} from "@/components/cards/ExamCard";
import CreateExamModal, {
  type CreateExamPayload,
} from "@/components/modals/CreateExamModal";
import AssignQuestionModal, {
  type AssignQuestionPayload,
  type QuestionBankItem,
} from "@/components/modals/AssignQuestionModal";
import {
  assignAssessmentQuestions,
  createAssessment,
  deleteAssessment,
  getAssessmentRows,
  updateAssessment,
  updateAssessmentStatus,
} from "@/services/assessments";
import { getQuestions } from "@/services/questions";

type StatusFilter = "all" | ExamStatus;
type ConfirmAction =
  | { type: "delete"; examId: string; examTitle: string }
  | {
      type: "status";
      examId: string;
      examTitle: string;
      nextStatus: ExamStatus;
    };

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  );
}

function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.push("/admin")}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
          >
            <ArrowLeftIcon />
          </button>

          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-orange-500 text-white">
            <ClipboardIcon />
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900">
              {title}
            </div>
            <div className="text-xs text-zinc-500">{subtitle}</div>
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

function ConfirmDialog({
  action,
  busy,
  onCancel,
  onConfirm,
}: {
  action: ConfirmAction | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!action) return null;

  const isDelete = action.type === "delete";
  const title = isDelete ? "Delete Exam" : "Change Exam Status";
  const message = isDelete
    ? `Are you sure you want to delete "${action.examTitle}"?`
    : `Are you sure you want to change "${action.examTitle}" to ${
        action.nextStatus === "ACTIVE" ? "active" : "inactive"
      }?`;
  const confirmLabel = isDelete ? "Delete" : "Change";
  const confirmClass = isDelete
    ? "bg-red-500 hover:bg-red-600 focus-visible:ring-red-400/50"
    : "bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-400/50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-zinc-600">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60 ${confirmClass}`}
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 4;
const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All status",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function ExamManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [assignExamId, setAssignExamId] = useState<string | null>(null);
  const [exams, setExams] = useState<ExamCardData[]>([]);
  const [examQuestionIds, setExamQuestionIds] = useState<
    Record<string, string[]>
  >({});
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>([]);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mutationBusy, setMutationBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExamManagementData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assessmentRows, questions] = await Promise.all([
        getAssessmentRows(),
        getQuestions(),
      ]);
      setExams(assessmentRows.exams);
      setExamQuestionIds(assessmentRows.examQuestionIds);
      setQuestionBank(questions);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExamManagementData();
  }, []);

  const filteredExams = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesStatus =
        statusFilter === "all" || exam.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        exam.title.toLowerCase().includes(normalizedSearch) ||
        exam.description.toLowerCase().includes(normalizedSearch) ||
        exam.link.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [exams, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleExams = filteredExams.slice(pageStart, pageStart + PAGE_SIZE);
  const activeCount = exams.filter((exam) => exam.status === "ACTIVE").length;
  const inactiveCount = exams.length - activeCount;
  const assignExam = exams.find((exam) => exam.id === assignExamId);
  const editingExam = exams.find((exam) => exam.id === editingExamId);

  const runMutation = async (operation: () => Promise<void>) => {
    setMutationBusy(true);
    setError(null);
    try {
      await operation();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setMutationBusy(false);
    }
  };

  const changeStatusFilter = (nextFilter: StatusFilter) => {
    setStatusFilter(nextFilter);
    setStatusDropdownOpen(false);
    setPage(1);
  };

  const handleCreateExam = (payload: CreateExamPayload) => {
    void runMutation(async () => {
      const createdExam = await createAssessment(payload);
      setExams((prev) => [createdExam, ...prev]);
      setExamQuestionIds((prev) => ({
        ...prev,
        [createdExam.id ?? ""]: payload.selectedQuestionIds ?? [],
      }));
      setStatusFilter("all");
      setPage(1);
    });
  };

  const handleUpdateExam = (payload: CreateExamPayload) => {
    if (!editingExamId) return;

    void runMutation(async () => {
      const updatedExam = await updateAssessment(editingExamId, payload);
      setExams((prev) =>
        prev.map((exam) => (exam.id === editingExamId ? updatedExam : exam)),
      );
      setExamQuestionIds((prev) => ({
        ...prev,
        [editingExamId]: payload.selectedQuestionIds ?? [],
      }));
      setEditingExamId(null);
    });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    void runMutation(async () => {
      if (confirmAction.type === "delete") {
        await deleteAssessment(confirmAction.examId);
        setExams((prev) =>
          prev.filter((item) => item.id !== confirmAction.examId),
        );
        setExamQuestionIds((prev) => {
          const next = { ...prev };
          delete next[confirmAction.examId];
          return next;
        });
      } else {
        const updatedExam = await updateAssessmentStatus(
          confirmAction.examId,
          confirmAction.nextStatus,
        );
        setExams((prev) =>
          prev.map((exam) =>
            exam.id === confirmAction.examId ? updatedExam : exam,
          ),
        );
      }

      setConfirmAction(null);
    });
  };

  const handleAssignQuestion = (payload: AssignQuestionPayload) => {
    if (!assignExamId) return;

    void runMutation(async () => {
      const nextQuestionIds = Array.from(
        new Set([
          ...(examQuestionIds[assignExamId] ?? []),
          ...payload.questions.map((question) => question.id),
        ]),
      );
      const updatedExam = await assignAssessmentQuestions(
        assignExamId,
        nextQuestionIds,
      );

      setExams((prev) =>
        prev.map((exam) => (exam.id === assignExamId ? updatedExam : exam)),
      );
      setExamQuestionIds((prev) => ({
        ...prev,
        [assignExamId]: nextQuestionIds,
      }));
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <AdminHeader
        title="Exam Management"
        subtitle={
          loading
            ? "Loading exams"
            : `${exams.length} exam${exams.length !== 1 ? "s" : ""}`
        }
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        {error && (
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void loadExamManagementData()}
              className="inline-flex h-8 items-center justify-center rounded-md border border-red-200 bg-white px-3 font-medium text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        <section className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div>
                <div className="text-xs text-zinc-500">All Exams</div>
                <div className="mt-1 font-semibold text-blue-600">
                  {exams.length}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Active</div>
                <div className="mt-1 font-semibold text-emerald-600">
                  {activeCount}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Inactive</div>
                <div className="mt-1 font-semibold text-orange-600">
                  {inactiveCount}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex flex-col gap-1.5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:gap-2">
                Status
                <div
                  className="relative w-full sm:w-40"
                  onBlur={(event) => {
                    const nextFocus = event.relatedTarget as Node | null;

                    if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
                      setStatusDropdownOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={statusDropdownOpen}
                    onClick={() => setStatusDropdownOpen((isOpen) => !isOpen)}
                    className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-emerald-700 bg-white px-3 text-emerald-700"
                  >
                    {STATUS_FILTER_LABELS[statusFilter]}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-4 w-4 text-zinc-500"
                      fill="currentColor"
                    >
                      <path d="M5.5 7.5h9L10 13l-4.5-5.5Z" />
                    </svg>
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                      <div role="listbox" aria-label="Status filter">
                        {(Object.keys(STATUS_FILTER_LABELS) as StatusFilter[]).map(
                          (filter) => (
                            <button
                              key={filter}
                              type="button"
                              role="option"
                              aria-selected={filter === statusFilter}
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => changeStatusFilter(filter)}
                              className="block w-full cursor-pointer px-3 py-2 text-left text-zinc-700 hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white focus:outline-none"
                            >
                              {STATUS_FILTER_LABELS[filter]}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="w-full text-sm text-zinc-600 md:max-w-md">
              Search exams
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by title, description, or link"
                className="mt-1.5 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </label>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={mutationBusy}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 disabled:pointer-events-none disabled:opacity-60 md:mt-6 md:w-auto"
            >
              + Create Exam
            </button>
          </div>
        </section>

        <section className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-4">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-lg border border-zinc-200 bg-white shadow-sm"
                />
              ))}

            {!loading &&
              visibleExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onEdit={() => {
                    setEditingExamId(exam.id ?? null);
                    setModalOpen(true);
                  }}
                  onDelete={() => {
                    if (!exam.id) return;

                    setConfirmAction({
                      type: "delete",
                      examId: exam.id,
                      examTitle: exam.title,
                    });
                  }}
                  onAssignQuestions={() => setAssignExamId(exam.id ?? null)}
                  onToggleStatus={() => {
                    if (!exam.id) return;

                    setConfirmAction({
                      type: "status",
                      examId: exam.id,
                      examTitle: exam.title,
                      nextStatus:
                        exam.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                    });
                  }}
                />
              ))}

            {!loading && visibleExams.length === 0 && (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
                No exams match the current search or status.
              </div>
            )}
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-3 border-t border-zinc-200 pt-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing {filteredExams.length === 0 ? 0 : pageStart + 1}-
            {Math.min(pageStart + PAGE_SIZE, filteredExams.length)} of{" "}
            {filteredExams.length}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Previous
            </button>
            <span className="min-w-20 text-center text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </main>

      <CreateExamModal
        open={modalOpen}
        questions={questionBank}
        onClose={() => {
          setModalOpen(false);
          setEditingExamId(null);
        }}
        onCreate={editingExam ? handleUpdateExam : handleCreateExam}
        mode={editingExam ? "edit" : "create"}
        initialExam={
          editingExam
            ? {
                examTitle: editingExam.title,
                description: editingExam.description,
                timeValue: editingExam.duration,
                timeUnit: editingExam.timeUnit ?? "MINUTES",
                passMark: editingExam.passMark,
                status: editingExam.status,
              }
            : undefined
        }
        initialSelectedQuestionIds={
          editingExam?.id ? (examQuestionIds[editingExam.id] ?? []) : []
        }
      />

      <AssignQuestionModal
        open={assignExamId !== null}
        questions={questionBank}
        examTitle={assignExam?.title}
        assignedQuestionIds={
          assignExamId ? (examQuestionIds[assignExamId] ?? []) : []
        }
        onClose={() => setAssignExamId(null)}
        onAssign={handleAssignQuestion}
      />

      <ConfirmDialog
        action={confirmAction}
        busy={mutationBusy}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
