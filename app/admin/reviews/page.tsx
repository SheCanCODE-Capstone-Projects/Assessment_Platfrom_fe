"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "pending" | "passed" | "failed" | "interview";
type TabKey = "all" | "reviewed" | Status;

type QuestionReview = {
  questionId: string;
  score: number | "";
  note: string;
};

type Submission = {
  id: number;
  name: string;
  status: Status;
  title: string;
  date: string;
  questions: number;
  reviewNotes?: string;
  questionReviews?: QuestionReview[];
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

const createEmptyQuestionReview = (): QuestionReview => ({
  questionId: "",
  score: "",
  note: "",
});

export default function CodeReviewsPage() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [questionSearchText, setQuestionSearchText] = useState<
    Record<string, string>
  >({});
  const [page, setPage] = useState(1);

  const questions = [
    {
      id: "q1",
      title: "Question 1",
      heading: "Two Sum",
      marks: 20,
      code: `function twoSum(nums, target) {
  // Write your code here
  hghfgfghhk
}`,
    },
    {
      id: "q2",
      title: "Question 2",
      heading: "Reverse String",
      marks: 15,
      code: `function reverseString(str) {
  return str.split("").reverse().join("");
}`,
    },
    {
      id: "q3",
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
  const selectedQuestionReviews =
    selected?.questionReviews && selected.questionReviews.length > 0
      ? selected.questionReviews
      : [createEmptyQuestionReview()];

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
    setQuestionSearchText({});
  };

  const updateQuestionReviews = (
    id: number,
    updater: (reviews: QuestionReview[]) => QuestionReview[]
  ) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id
          ? {
              ...submission,
              questionReviews: updater(
                submission.questionReviews && submission.questionReviews.length > 0
                  ? submission.questionReviews
                  : [createEmptyQuestionReview()]
              ),
            }
          : submission
      )
    );

    setSelected((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            questionReviews: updater(
              prev.questionReviews && prev.questionReviews.length > 0
                ? prev.questionReviews
                : [createEmptyQuestionReview()]
            ),
          }
        : prev
    );
  };

  const updateQuestionReview = (
    submissionId: number,
    reviewIndex: number,
    patch: Partial<QuestionReview>
  ) => {
    updateQuestionReviews(submissionId, (reviews) =>
      reviews.map((review, index) =>
        index === reviewIndex ? { ...review, ...patch } : review
      )
    );
  };

  const addQuestionReview = (submissionId: number) => {
    updateQuestionReviews(submissionId, (reviews) =>
      reviews.length >= questions.length
        ? reviews
        : [...reviews, createEmptyQuestionReview()]
    );
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: `All (${submissions.length})` },
    { key: "pending", label: `Pending (${count("pending")})` },
    { key: "reviewed", label: "Reviewed (0)" },
    { key: "passed", label: `Passed (${count("passed")})` },
    { key: "failed", label: `Failed (${count("failed")})` },
    { key: "interview", label: `Interview (${count("interview")})` },
  ];

  const renderHighlightedName = (name: string) => {
    const displayName = name.toLowerCase();
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) return displayName;

    const matchIndex = displayName.indexOf(normalizedSearch);
    if (matchIndex === -1) return displayName;

    const beforeMatch = displayName.slice(0, matchIndex);
    const match = displayName.slice(matchIndex, matchIndex + normalizedSearch.length);
    const afterMatch = displayName.slice(matchIndex + normalizedSearch.length);

    return (
      <>
        {beforeMatch}
        <mark className="rounded bg-yellow-200 px-0.5 text-zinc-950">
          {match}
        </mark>
        {afterMatch}
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-zinc-50">
      {/* HEADER */}
      <div className="border-b border-zinc-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            aria-label="Back to admin"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-lg font-bold text-white">
            {"</>"}
          </div>

          <div className="min-w-0">
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
      <div className="px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0">
            <div className="flex min-w-max gap-x-6 gap-y-3 text-sm font-semibold text-zinc-950 lg:min-w-0 lg:flex-wrap lg:gap-x-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                className={`whitespace-nowrap transition-colors ${
                  activeTab === tab.key ? "text-zinc-950" : "hover:text-zinc-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
            </div>
          </div>

          <label className="relative w-full lg:max-w-xs">
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

      
      <main className="flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        {paginated.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-5 rounded-lg border border-zinc-200 bg-white px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-6 sm:py-6"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="break-words text-base font-bold text-zinc-950">
                  {renderHighlightedName(item.name)}
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
                <span className="break-words">Submitted: {item.date}</span>
              </div>

              {item.questionReviews && item.questionReviews.length > 0 && (
                <div className="mt-4 rounded-md bg-zinc-50 px-3 py-3 text-sm text-slate-900">
                  <span className="font-bold">Question Reviews:</span>{" "}
                  {
                    item.questionReviews.filter((review) => review.questionId)
                      .length
                  }{" "}
                  saved
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelected(item);
                setActiveQuestion(0);
                setQuestionSearchText({});
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600 sm:w-auto"
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

        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-zinc-200 pt-5 sm:justify-end">
          <nav
            className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 px-3 py-3 sm:px-6 sm:py-8">
          <div className="mx-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-[1152px] overflow-y-auto rounded-lg bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]">
            <div className="flex items-start justify-between gap-4 px-4 py-5 sm:px-6 sm:py-7">
              <div className="min-w-0">
                <h2 className="break-words text-xl font-bold leading-tight text-zinc-950 sm:text-2xl">
                  {selected.name.toLowerCase()}
                </h2>
                <p className="mt-2 break-words text-sm text-slate-700">
                  {selected.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setQuestionSearchText({});
                }}
                className="shrink-0 text-3xl leading-none text-slate-400 hover:text-slate-600"
                aria-label="Close review modal"
              >
                &times;
              </button>
            </div>

            <div className="grid border-y border-zinc-200 md:h-[248px] md:grid-cols-[220px_1fr] lg:grid-cols-[256px_1fr]">
              <aside className="max-h-56 overflow-y-auto border-b border-zinc-200 bg-white p-4 md:h-full md:max-h-none md:border-b-0 md:border-r">
                <h3 className="mb-3 text-lg font-bold text-zinc-950">Answers</h3>
                <div className="grid gap-2 sm:grid-cols-3 md:block md:space-y-2">
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

              <section className="min-w-0 overflow-y-auto bg-white pt-5 md:h-full md:pt-7">
                <div className="px-4 sm:px-6">
                  <h3 className="break-words text-lg font-bold text-zinc-950 sm:text-xl">
                    {questions[activeQuestion].heading}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                    <span className="rounded bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                      {questions[activeQuestion].marks}
                    </span>
                    <span>{questions[activeQuestion].marks} marks</span>
                  </div>
                </div>

                <div className="mt-2 flex min-h-[174px] overflow-x-auto bg-[#1e1e1e] text-sm leading-6 text-white">
                  <div className="shrink-0 select-none border-r border-white/10 px-3 py-1 text-right text-slate-400 sm:px-4">
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
                    className="min-h-[174px] min-w-[28rem] flex-1 resize-none overflow-auto bg-[#1e1e1e] px-4 py-1 font-mono text-sm leading-6 text-white outline-none"
                    aria-label={`${questions[activeQuestion].title} answer`}
                  />
                </div>
              </section>
            </div>

            <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">
                    Question Reviews
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Add a score and note for each reviewed question.
                  </p>
                </div>
              </div>

              {selectedQuestionReviews.map((review, reviewIndex) => {
                const canAddReview =
                  reviewIndex === selectedQuestionReviews.length - 1 &&
                  selectedQuestionReviews.length < questions.length;
                const searchKey = `${selected.id}-${reviewIndex}`;
                const selectedQuestionIds = selectedQuestionReviews
                  .map((item, index) =>
                    index === reviewIndex ? null : item.questionId
                  )
                  .filter((questionId): questionId is string =>
                    Boolean(questionId)
                  );
                const availableQuestions = questions.filter(
                  (question) =>
                    question.id === review.questionId ||
                    !selectedQuestionIds.includes(question.id)
                );
                const selectedQuestion = questions.find(
                  (question) => question.id === review.questionId
                );
                const questionInputValue =
                  questionSearchText[searchKey] ?? selectedQuestion?.title ?? "";

                return (
                  <div
                    key={searchKey}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,5fr)_2.5rem]">
                      <label className="text-sm font-medium text-slate-900">
                        Select Question
                        <input
                          list={`question-options-${selected.id}-${reviewIndex}`}
                          value={questionInputValue}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            const matchedQuestion = availableQuestions.find(
                              (question) => question.title === nextValue
                            );

                            setQuestionSearchText((prev) => ({
                              ...prev,
                              [searchKey]: nextValue,
                            }));

                            if (matchedQuestion) {
                              updateQuestionReview(selected.id, reviewIndex, {
                                questionId: matchedQuestion.id,
                              });
                              setQuestionSearchText((prev) => ({
                                ...prev,
                                [searchKey]: matchedQuestion.title,
                              }));
                              return;
                            }

                            if (nextValue === "") {
                              updateQuestionReview(selected.id, reviewIndex, {
                                questionId: "",
                              });
                            }
                          }}
                          placeholder="Search or select a question"
                          className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <datalist id={`question-options-${selected.id}-${reviewIndex}`}>
                          {availableQuestions.map((question) => (
                            <option key={question.id} value={question.title}>
                              {question.heading}
                            </option>
                          ))}
                        </datalist>
                      </label>

                      <label className="text-sm font-medium text-slate-900">
                        Score (%) - Optional
                        <input
                          type="number"
                          min="0"
                          max={selectedQuestion?.marks}
                          value={review.score}
                          onChange={(event) =>
                            updateQuestionReview(selected.id, reviewIndex, {
                              score:
                                event.target.value === ""
                                  ? ""
                                  : Number(event.target.value),
                            })
                          }
                          disabled={!review.questionId}
                          placeholder="Enter score"
                          className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </label>

                      <label className="text-sm font-medium text-slate-900">
                        Review Notes - Optional
                        <textarea
                          value={review.note}
                          onChange={(event) =>
                            updateQuestionReview(selected.id, reviewIndex, {
                              note: event.target.value,
                            })
                          }
                          disabled={!review.questionId}
                          placeholder="Add notes for this question"
                          className="mt-2 h-11 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </label>

                      <div className="flex items-end">
                        {canAddReview ? (
                          <button
                            type="button"
                            onClick={() => addQuestionReview(selected.id)}
                            className="inline-flex h-11 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white transition-colors hover:bg-emerald-600"
                            aria-label="Add another question review"
                            title="Add another question review"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 5v14m7-7H5"
                              />
                            </svg>
                          </button>
                        ) : (
                          <span className="h-11 w-10" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 bg-zinc-50 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-slate-700">
                Question {activeQuestion + 1} of {questions.length}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => updateStatus(selected.id, "failed")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600 sm:w-auto"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white text-xs">
                    x
                  </span>
                  Mark as Failed
                </button>

                <button
                  onClick={() => updateStatus(selected.id, "passed")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white hover:bg-emerald-600 sm:w-auto"
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 sm:w-auto"
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
