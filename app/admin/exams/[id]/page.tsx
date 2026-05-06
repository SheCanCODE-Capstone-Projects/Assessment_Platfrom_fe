"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateExamModal, { type CreateExamPayload } from "@/components/modals/CreateExamModal";
import { QUESTION_BANK, type QuestionBankItem } from "@/components/modals/AssignQuestionModal";

type Difficulty = "Easy" | "Medium" | "Hard";

type Question = {
  id: string;
  title: string;
  difficulty: Difficulty;
  marks: number;
  description: string;
  
};

const mapBankQuestionToExamQuestion = (question: QuestionBankItem): Question => ({
  id: question.id,
  title: question.title,
  difficulty:
    question.difficulty === "EASY"
      ? "Easy"
      : question.difficulty === "MEDIUM"
        ? "Medium"
        : "Hard",
  marks: question.marks,
  description: question.description,
});

type Exam = {
  id: string;
  title: string;
  description: string;
  duration: number;
  timeUnit: "SECONDS" | "MINUTES" | "HOURS";
  passMark: number;
  status: "ACTIVE" | "INACTIVE";
  questions: Question[];
  totalMarks: number;
  link: string;
};


const EXAM: Exam = {
  id: "123",
  title: "JavaScript Developer Assessment",
  description: "Assess core JavaScript skills including problem solving, data structures, and language fundamentals.",
  duration: 60,
  timeUnit: "MINUTES",
  passMark: 70,
  status: "ACTIVE",
  totalMarks: 60,
  link: "https://codeassess.com/exam/123",
  questions: [
    {
      id: "q1",
      title: "Two Sum",
      difficulty: "Easy",
      marks: 20,
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    },
    {
      id: "q2",
      title: "Reverse String",
      difficulty: "Easy",
      marks: 15,
      description:
        "Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.",
    },
    {
      id: "q3",
      title: "Valid Parentheses",
      difficulty: "Medium",
      marks: 25,
      description:
        "Given a string containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type and in the correct order.",
    },
  ],
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function MarksIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}



const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-orange-50 text-orange-700 border-orange-200",
  Hard: "bg-red-50 text-red-700 border-red-200",
};

function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyStyles[level]}`}>
      {level}
    </span>
  );
}



function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
      {icon}{label}
    </span>
  );
}



function QuestionCard({ question, index }: { question: Question; index: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
            {index + 1}
          </span>
          <h3 className="text-[15px] font-semibold text-zinc-900 truncate">{question.title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DifficultyBadge level={question.difficulty} />
          <span className="text-sm font-medium text-zinc-500 tabular-nums">{question.marks} marks</span>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{question.description}</p>
    </div>
  );
}



export default function ExamDetailPage() {
  const router = useRouter();
  const [exam, setExam] = useState(EXAM);
  const [editOpen, setEditOpen] = useState(false);

  const handleUpdateExam = (payload: CreateExamPayload) => {
    const selectedQuestions = payload.selectedQuestionIds
      ? QUESTION_BANK.filter((question) => payload.selectedQuestionIds?.includes(question.id))
      : null;

    setExam((prev) => ({
      ...prev,
      title: payload.examTitle,
      description: payload.description,
      duration: payload.timeValue,
      timeUnit: payload.timeUnit,
      passMark: payload.passMark,
      status: payload.status,
      questions: selectedQuestions
        ? selectedQuestions.map(mapBankQuestionToExamQuestion)
        : prev.questions,
      totalMarks: selectedQuestions
        ? selectedQuestions.reduce((total, question) => total + question.marks, 0)
        : prev.totalMarks,
    }));
  };

  const timeUnitLabel = exam.timeUnit === "SECONDS" ? "sec" : exam.timeUnit === "HOURS" ? "hr" : "min";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* Header */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Back"
              onClick={() => router.push("/admin/exams")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeftIcon />
            </button>
            <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-orange-500 text-white">
              <ClipboardIcon />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 truncate max-w-50 sm:max-w-none">
                {exam.title}
              </div>
              <div className="text-xs text-zinc-500">Exam Details</div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 space-y-6">

        {/* Overview */}
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-900">{exam.title}</h1>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{exam.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Edit Exam
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <StatPill icon={<ClockIcon />} label={`${exam.duration} ${timeUnitLabel}`} />
            <StatPill icon={<TargetIcon />} label={`${exam.passMark}% pass mark`} />
            <StatPill
              icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>}
              label={`${exam.questions.length} Questions`}
            />
            <StatPill
              icon={<MarksIcon />}
              label={`${exam.totalMarks} Total Marks`}
            />
          </div>

          {/* Assessment link */}
          <div className="mt-5 rounded-md border border-zinc-100 bg-zinc-50 px-4 py-3">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Assessment Link
            </div>
            <div className="flex items-center justify-between gap-3">
              <a href={exam.link} target="_blank" rel="noopener noreferrer"
                className="break-all text-sm text-teal-600 hover:text-teal-700 hover:underline">
                {exam.link}
              </a>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(exam.link)}
                aria-label="Copy link"
                className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 transition-colors"
              >
                <CopyIcon />
              </button>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Questions
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                {exam.questions.length}
              </span>
            </h2>
            <span className="text-sm text-zinc-500">{exam.totalMarks} total marks</span>
          </div>

          <div className="flex flex-col gap-4">
            {exam.questions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        </section>

        {/* Back link */}
        <div className="pb-4">
          <Link href="/admin/exams"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            <ArrowLeftIcon />
            Back to Exam Management
          </Link>
        </div>

      </main>

      <CreateExamModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onCreate={handleUpdateExam}
        mode="edit"
        initialExam={{
          examTitle: exam.title,
          description: exam.description,
          timeValue: exam.duration,
          timeUnit: exam.timeUnit,
          passMark: exam.passMark,
          status: exam.status,
        }}
        initialSelectedQuestionIds={exam.questions.map((question) => question.id)}
      />
    </div>
  );
}
