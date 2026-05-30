"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CreateExamModal, {
  type CreateExamPayload,
} from "@/components/modals/CreateExamModal";
import {
  difficultyLabels,
  difficultyStyles,
  type QuestionBankItem,
} from "@/components/modals/AssignQuestionModal";
import {
  getAssessmentById,
  getAssessmentQuestionIds,
  mapAssessmentToExamCard,
  mapQuestionToBankItem,
  updateAssessment,
  type AssessmentDto,
} from "@/services/assessments";
import { getQuestions } from "@/services/questions";

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

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function MarksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="m3 6 1 1 2-2" />
      <path d="m3 12 1 1 2-2" />
      <path d="m3 18 1 1 2-2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
      {icon}
      {label}
    </span>
  );
}

function QuestionCard({
  question,
  index,
}: {
  question: QuestionBankItem;
  index: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
            {index + 1}
          </span>
          <h3 className="truncate text-[15px] font-semibold text-zinc-900">
            {question.title}
          </h3>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyStyles[question.difficulty]}`}
          >
            {difficultyLabels[question.difficulty]}
          </span>
          <span className="text-sm font-medium tabular-nums text-zinc-500">
            {question.marks} marks
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        {question.description}
      </p>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function ExamDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const paramId = params?.id;
  const assessmentId = Array.isArray(paramId) ? paramId[0] : paramId;
  const [assessment, setAssessment] = useState<AssessmentDto | null>(null);
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exam = useMemo(
    () => (assessment ? mapAssessmentToExamCard(assessment) : null),
    [assessment],
  );
  const questions = useMemo(
    () => (assessment?.questions ?? []).map(mapQuestionToBankItem),
    [assessment],
  );
  const selectedQuestionIds = useMemo(
    () => (assessment ? getAssessmentQuestionIds(assessment) : []),
    [assessment],
  );

  const loadAssessment = async () => {
    if (!assessmentId) return;

    setLoading(true);
    setError(null);
    try {
      const [assessmentData, questionsData] = await Promise.all([
        getAssessmentById(assessmentId),
        getQuestions(),
      ]);
      setAssessment(assessmentData);
      setQuestionBank(questionsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssessment();
  }, [assessmentId]);

  const handleUpdateExam = (payload: CreateExamPayload) => {
    if (!assessmentId) return;

    setSaving(true);
    setError(null);
    updateAssessment(assessmentId, payload)
      .then(() => getAssessmentById(assessmentId))
      .then(setAssessment)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setSaving(false));
  };

  const timeUnitLabel =
    exam?.timeUnit === "SECONDS" ? "sec" : exam?.timeUnit === "HOURS" ? "hr" : "min";
  const totalMarks = questions.reduce((total, question) => total + question.marks, 0);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <div className="w-full border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Back"
              onClick={() => router.push("/admin/exams")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              <ArrowLeftIcon />
            </button>
            <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-orange-500 text-white">
              <ClipboardIcon />
            </div>
            <div className="min-w-0">
              <div className="max-w-50 truncate text-sm font-semibold text-zinc-900 sm:max-w-none">
                {exam?.title ?? "Exam Details"}
              </div>
              <div className="text-xs text-zinc-500">Exam Details</div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/admin/exams"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
        >
          <ArrowLeftIcon />
          Back to Exam Management
        </Link>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="h-72 animate-pulse rounded-lg border border-zinc-200 bg-white shadow-sm" />
        )}

        {!loading && exam && (
          <>
            <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-zinc-900">
                    {exam.title}
                  </h1>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    {exam.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  disabled={saving}
                  className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
                >
                  {saving ? "Saving..." : "Edit Exam"}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <StatPill icon={<ClockIcon />} label={`${exam.duration} ${timeUnitLabel}`} />
                <StatPill icon={<TargetIcon />} label={`${exam.passMark}% pass mark`} />
                <StatPill
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  }
                  label={`${questions.length} Questions`}
                />
                <StatPill icon={<MarksIcon />} label={`${totalMarks} Total Marks`} />
              </div>

              <div className="mt-5 rounded-md border border-zinc-100 bg-zinc-50 px-4 py-3">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                  Assessment Link
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={exam.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    {exam.link}
                  </a>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(exam.link)}
                    aria-label="Copy link"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Questions
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                    {questions.length}
                  </span>
                </h2>
                <span className="text-sm text-zinc-500">{totalMarks} total marks</span>
              </div>

              <div className="flex flex-col gap-4">
                {questions.map((question, index) => (
                  <QuestionCard key={question.id} question={question} index={index} />
                ))}

                {questions.length === 0 && (
                  <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500">
                    No questions are assigned to this exam.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {exam && (
        <CreateExamModal
          open={editOpen}
          questions={questionBank}
          onClose={() => setEditOpen(false)}
          onCreate={handleUpdateExam}
          mode="edit"
          initialExam={{
            examTitle: exam.title,
            description: exam.description,
            timeValue: exam.duration,
            timeUnit: exam.timeUnit ?? "MINUTES",
            passMark: exam.passMark,
            status: exam.status,
          }}
          initialSelectedQuestionIds={selectedQuestionIds}
        />
      )}
    </div>
  );
}
