import Link from "next/link";

export type ExamStatus = "ACTIVE" | "INACTIVE";

export type ExamCardData = {
  id?: string;
  title: string;
  description: string;
  duration: number;
  timeUnit?: "SECONDS" | "MINUTES" | "HOURS";
  passMark: number;
  questions: number;
  totalMarks: number;
  link: string;
  status: ExamStatus;
};

type ExamCardProps = {
  exam: ExamCardData;
  onEdit?: () => void;
  onDelete?: () => void;
  onAssignQuestions?: () => void;
  onToggleStatus?: () => void;
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3 6 6 .9-4.5 4.4 1.1 6.2L12 16.5l-5.6 3 1.1-6.2L3 8.9 9 8l3-6Z" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function MarksIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function StatusBadge({ status }: { status: ExamStatus }) {
  const styles =
    status === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-zinc-200 bg-zinc-100 text-zinc-600";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>
      {status === "ACTIVE" ? "Active" : "Inactive"}
    </span>
  );
}

export default function ExamCard({
  exam,
  onEdit,
  onDelete,
  onAssignQuestions,
  onToggleStatus,
}: ExamCardProps) {
  const detailHref = exam.id ? `/admin/exams/${exam.id}` : "#";
  const nextStatusLabel = exam.status === "ACTIVE" ? "Set inactive" : "Set active";
  const timeUnitLabel = exam.timeUnit === "SECONDS" ? "sec" : exam.timeUnit === "HOURS" ? "hr" : "min";

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold text-zinc-900">{exam.title}</h3>
            <StatusBadge status={exam.status} />
          </div>
          <p className="mt-1 text-sm leading-5 text-zinc-500">{exam.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit exam"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete exam"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600">
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon />
          <span>{exam.duration} {timeUnitLabel}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BadgeIcon />
          <span>{exam.passMark}% pass mark</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <QuestionIcon />
          <span>{exam.questions} Questions</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MarksIcon />
          <span>{exam.totalMarks} Total Marks</span>
        </span>
      </div>

      <div className="mt-4 rounded-md border border-zinc-100 bg-zinc-50 px-4 py-3">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Assessment Link
        </div>
        <a
          href={exam.link}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-sm text-teal-600 hover:text-teal-700 hover:underline"
        >
          {exam.link}
        </a>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onToggleStatus}
          className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50"
        >
          {nextStatusLabel}
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onAssignQuestions}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-orange-200 bg-white px-4 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50"
          >
            <PlusCircleIcon />
            Assign Questions
          </button>
          <Link
            href={detailHref}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50"
          >
            View Details
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
