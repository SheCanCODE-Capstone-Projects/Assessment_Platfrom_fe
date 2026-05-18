"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ExamCard from "@/components/cards/ExamCard";
import CreateExamModal from "@/components/modals/CreateExamModal";

type Exam = {
  id: string;
  title: string;
  description: string;
  duration: number;
  passMark: number;
  questions: number;
  totalMarks: number;
  link: string;
  status: "ACTIVE" | "INACTIVE";
};

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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

function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="w-full bg-white border-b border-zinc-200">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
          >
            <ArrowLeftIcon />
          </button>
          <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-orange-500 text-white">
            <ClipboardIcon />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900">{title}</div>
            <div className="text-xs text-zinc-500">{subtitle}</div>
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

const INITIAL_EXAMS: Exam[] = [
  {
    id: "123",
    title: "JavaScript Developer Assessment",
    description: "Assess core JavaScript skills",
    duration: 60,
    passMark: 70,
    questions: 3,
    totalMarks: 60,
    link: "https://codeassess.com/exam/123",
    status: "ACTIVE",
  },
];

export default function ExamManagementPage() {
  const [open, setOpen] = useState(false);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <AdminHeader
        title="Exam Management"
        subtitle={`${exams.length} exam${exams.length !== 1 ? "s" : ""}`}
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            + Create Exam
          </button>
        }
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEdit={() => console.log("edit", exam.id)}
              onDelete={() => setExams((prev) => prev.filter((e) => e.id !== exam.id))}
            />
          ))}
        </div>
      </main>

      <CreateExamModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
