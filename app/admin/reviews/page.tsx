"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "pending" | "passed" | "failed" | "interview";
type TabKey = "all" | "reviewed" | Status;

type Submission = {
  id: number;
  name: string;
  status: Status;
  title: string;
  date: string;
  questions: number;
  reviewNotes?: string;
};

const initialData: Submission[] = [
  {
    id: 1,
    name: "Yvette",
    status: "passed",
    title: "JavaScript Developer Assessment",
    date: "4/29/2026, 3:32:34 PM",
    questions: 3,
    reviewNotes: ",n",
  },
  {
    id: 2,
    name: "Yvette",
    status: "pending",
    title: "JavaScript Developer Assessment",
    date: "5/5/2026, 12:51:09 AM",
    questions: 3,
  },
];

const statusStyles: Record<Status, string> = {
  passed: "bg-emerald-100 text-emerald-700",
  pending: "bg-orange-100 text-orange-600",
  failed: "bg-red-100 text-red-700",
  interview: "bg-blue-100 text-blue-700",
};

const statusLabels: Record<Status, string> = {
  passed: "Passed",
  pending: "Pending",
  failed: "Failed",
  interview: "Interview",
};

const pageSize = 5;

export default function CodeReviewsPage() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const questions = [
    {
      title: "Question 1",
      heading: "Two Sum",
      marks: 20,
      code: `function twoSum(nums, target) {
  // Write your code here
  hghfgfghhk
}`,
    },
    {
      title: "Question 2",
      heading: "Reverse String",
      marks: 15,
      code: `function reverseString(str) {
  return str.split("").reverse().join("");
}`,
    },
    {
      title: "Question 3",
      heading: "Palindrome",
      marks: 25,
      code: `function isPalindrome(str) {
  return str === str.split("").reverse().join("");
}`,
    },
  ];

  const [answers, setAnswers] = useState(() =>
    questions.map((question) => question.code)
  );

  const activeAnswerLines = answers[activeQuestion].split("\n");

  const filtered = submissions.filter((submission) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      submission.name.toLowerCase().includes(normalizedSearch) ||
      submission.title.toLowerCase().includes(normalizedSearch) ||
      submission.status.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    if (activeTab === "reviewed") return false;
    return submission.status === activeTab;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageStart, pageStart + pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const count = (status: Status) =>
    submissions.filter((submission) => submission.status === status).length;

  const updateStatus = (id: number, newStatus: Status) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id ? { ...submission, status: newStatus } : submission
      )
    );
    setSelected(null);
  };

  const updateReviewNotes = (id: number, reviewNotes: string) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id ? { ...submission, reviewNotes } : submission
      )
    );
    setSelected((prev) => (prev ? { ...prev, reviewNotes } : prev));
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: `All (${submissions.length})` },
    { key: "pending", label: `Pending (${count("pending")})` },
    { key: "reviewed", label: "Reviewed (0)" },
    { key: "passed", label: `Passed (${count("passed")})` },
    { key: "failed", label: `Failed (${count("failed")})` },
    { key: "interview", label: `Interview (${count("interview")})` },
  ];

  return (
    <div className="h-screen overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50">
      {/* HEADER */}
      <div className="border-b border-zinc-200 bg-white px-8 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="text-2xl leading-none text-zinc-950 transition-colors hover:text-zinc-600"
            aria-label="Back to admin"
          >
            &larr;
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-lg font-bold text-white">
            {"</>"}
          </div>

          <div>
            <h1 className="text-xl font-semibold leading-tight text-zinc-950">
              Code Reviews
            </h1>
            <p className="text-sm text-zinc-500">
              {submissions.length} submissions
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="px-8 pt-11">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-3">
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-semibold text-zinc-950">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                className={`transition-colors ${
                  activeTab === tab.key ? "text-zinc-950" : "hover:text-zinc-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <label className="relative w-full max-w-xs">
            <span className="sr-only">Search submissions</span>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              />
            </svg>
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              type="search"
              placeholder="Search reviews..."
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm font-normal text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      {/* LIST */}
      <main className="space-y-4 px-8 py-6">
        {paginated.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-6 rounded-lg border border-zinc-200 bg-white px-6 py-6"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-zinc-950">
                  {item.name.toLowerCase()}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${statusStyles[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
              </div>

              <div className="mt-3 text-sm text-slate-700">{item.title}</div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
                <span>Questions: {item.questions}</span>
                <span>Submitted: {item.date}</span>
              </div>

              {item.reviewNotes && (
                <div className="mt-4 rounded-md bg-zinc-50 px-3 py-3 text-sm text-slate-900">
                  <span className="font-bold">Review Notes:</span>{" "}
                  {item.reviewNotes}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelected(item);
                setActiveQuestion(0);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12s3.75-6 9.75-6 9.75 6 9.75 6-3.75 6-9.75 6-9.75-6-9.75-6Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Review
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            No submissions match your current filters.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-zinc-200 pt-5">
          <nav
            className="flex items-center gap-2"
            aria-label="Reviews pagination"
          >
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white"
            >
              Previous
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                aria-current={currentPage === pageNumber ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                  currentPage === pageNumber
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white"
            >
              Next
            </button>
          </nav>
        </div>
      </main>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 px-6 py-8">
          <div className="mx-auto max-h-[calc(100vh-4rem)] w-full max-w-[1152px] overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="flex items-start justify-between px-6 py-7">
              <div>
                <h2 className="text-2xl font-bold leading-tight text-zinc-950">
                  {selected.name.toLowerCase()}
                </h2>
                <p className="mt-2 text-sm text-slate-700">{selected.title}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-3xl leading-none text-slate-400 hover:text-slate-600"
                aria-label="Close review modal"
              >
                &times;
              </button>
            </div>

            <div className="grid h-[248px] grid-cols-[256px_1fr] overflow-hidden border-y border-zinc-200">
              <aside className="h-full overflow-y-auto border-r border-zinc-200 bg-white p-4">
                <h3 className="mb-3 text-lg font-bold text-zinc-950">Answers</h3>
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <button
                      key={question.title}
                      onClick={() => setActiveQuestion(index)}
                      className={`w-full rounded-md border p-3 text-left transition-colors ${
                        activeQuestion === index
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-zinc-200 bg-white text-zinc-950 hover:border-emerald-300"
                      }`}
                    >
                      <span className="block font-bold">{question.title}</span>
                      <span className="mt-1 block text-sm font-semibold">
                        {question.marks} marks
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="h-full overflow-y-auto bg-white pt-7">
                <div className="px-6">
                  <h3 className="text-xl font-bold text-zinc-950">
                    {questions[activeQuestion].heading}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                    <span className="rounded bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                      {questions[activeQuestion].marks}
                    </span>
                    <span>{questions[activeQuestion].marks} marks</span>
                  </div>
                </div>

                <div className="mt-2 flex min-h-[174px] overflow-hidden bg-[#1e1e1e] text-sm leading-6 text-white">
                  <div className="select-none border-r border-white/10 px-4 py-1 text-right text-slate-400">
                    {activeAnswerLines.map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>
                  <textarea
                    value={answers[activeQuestion]}
                    onChange={(event) => {
                      const nextAnswers = [...answers];
                      nextAnswers[activeQuestion] = event.target.value;
                      setAnswers(nextAnswers);
                    }}
                    spellCheck={false}
                    className="min-h-[174px] flex-1 resize-none overflow-auto bg-[#1e1e1e] px-4 py-1 font-mono text-sm leading-6 text-white outline-none"
                    aria-label={`${questions[activeQuestion].title} answer`}
                  />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-2 gap-6 px-6 py-7">
              <label className="text-sm font-medium text-slate-900">
                Score (%) - Optional
                <input
                  type="text"
                  placeholder="Enter score"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </label>

              <label className="text-sm font-medium text-slate-900">
                Review Notes - Optional
                <textarea
                  value={selected.reviewNotes ?? ""}
                  onChange={(event) =>
                    updateReviewNotes(selected.id, event.target.value)
                  }
                  className="mt-2 h-11 w-full resize-none rounded-lg border border-emerald-500 px-4 py-3 text-sm outline-none ring-1 ring-emerald-500"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-50 px-6 pb-6">
              <p className="text-sm text-slate-700">
                Question {activeQuestion + 1} of {questions.length}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus(selected.id, "failed")}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white text-xs">
                    x
                  </span>
                  Mark as Failed
                </button>

                <button
                  onClick={() => updateStatus(selected.id, "passed")}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white hover:bg-emerald-600"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Mark as Passed
                </button>

                <button
                  onClick={() => updateStatus(selected.id, "interview")}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.13a6.75 6.75 0 0 0-6 0"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 10.5h3m-1.5-1.5v3"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21a9 9 0 1 0-18 0"
                    />
                  </svg>
                  Qualify for Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
