"use client";

import { useMemo, useState } from "react";
import { greenSelectClassName, greenSelectOptionClassName } from "@/components/ui/selectStyles";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionLanguage = "JAVASCRIPT" | "TYPESCRIPT" | "PYTHON" | "JAVA" | "CPP";

export type QuestionBankItem = {
  id: string;
  title: string;
  description: string;
  marks: number;
  difficulty: QuestionDifficulty;
  language: QuestionLanguage;
  topic: string;
};

export type AssignQuestionPayload = {
  questions: QuestionBankItem[];
};

type AssignQuestionModalProps = {
  open: boolean;
  examTitle?: string;
  assignedQuestionIds?: string[];
  onClose: () => void;
  onAssign?: (payload: AssignQuestionPayload) => void;
};

export const QUESTION_BANK: QuestionBankItem[] = [
  {
    id: "q1",
    title: "Two Sum",
    description: "Find two array indexes whose values add up to the target.",
    marks: 20,
    difficulty: "EASY",
    language: "JAVASCRIPT",
    topic: "Arrays",
  },
  {
    id: "q2",
    title: "Reverse String",
    description: "Reverse a character array in-place using constant extra memory.",
    marks: 15,
    difficulty: "EASY",
    language: "JAVASCRIPT",
    topic: "Strings",
  },
  {
    id: "q3",
    title: "Valid Parentheses",
    description: "Validate whether brackets are closed by the correct type in the correct order.",
    marks: 25,
    difficulty: "MEDIUM",
    language: "JAVASCRIPT",
    topic: "Stacks",
  },
  {
    id: "q4",
    title: "Merge Intervals",
    description: "Merge all overlapping intervals and return the non-overlapping ranges.",
    marks: 30,
    difficulty: "MEDIUM",
    language: "TYPESCRIPT",
    topic: "Arrays",
  },
  {
    id: "q5",
    title: "LRU Cache",
    description: "Design a cache with get and put operations in O(1) average time.",
    marks: 40,
    difficulty: "HARD",
    language: "JAVA",
    topic: "Design",
  },
  {
    id: "q6",
    title: "Binary Tree Level Order Traversal",
    description: "Return a binary tree's values level by level from left to right.",
    marks: 25,
    difficulty: "MEDIUM",
    language: "PYTHON",
    topic: "Trees",
  },
];

export const difficultyLabels: Record<QuestionDifficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export const languageLabels: Record<QuestionLanguage, string> = {
  JAVASCRIPT: "JavaScript",
  TYPESCRIPT: "TypeScript",
  PYTHON: "Python",
  JAVA: "Java",
  CPP: "C++",
};

export const difficultyStyles: Record<QuestionDifficulty, string> = {
  EASY: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MEDIUM: "border-orange-200 bg-orange-50 text-orange-700",
  HARD: "border-red-200 bg-red-50 text-red-700",
};

export default function AssignQuestionModal({
  open,
  examTitle,
  assignedQuestionIds = [],
  onClose,
  onAssign,
}: AssignQuestionModalProps) {
  if (!open) return null;

  return (
    <AssignQuestionModalContent
      examTitle={examTitle}
      assignedQuestionIds={assignedQuestionIds}
      onClose={onClose}
      onAssign={onAssign}
    />
  );
}

function AssignQuestionModalContent({
  examTitle,
  assignedQuestionIds,
  onClose,
  onAssign,
}: Omit<AssignQuestionModalProps, "open"> & { assignedQuestionIds: string[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | QuestionDifficulty>("all");
  const [language, setLanguage] = useState<"all" | QuestionLanguage>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const assignedIds = useMemo(() => new Set(assignedQuestionIds), [assignedQuestionIds]);
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const expandedIdSet = useMemo(() => new Set(expandedIds), [expandedIds]);

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return QUESTION_BANK.filter((question) => {
      const matchesDifficulty = difficulty === "all" || question.difficulty === difficulty;
      const matchesLanguage = language === "all" || question.language === language;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.title.toLowerCase().includes(normalizedSearch) ||
        question.description.toLowerCase().includes(normalizedSearch) ||
        question.topic.toLowerCase().includes(normalizedSearch);

      return matchesDifficulty && matchesLanguage && matchesSearch;
    });
  }, [difficulty, language, searchTerm]);

  const selectedQuestions = QUESTION_BANK.filter((question) => selectedIdSet.has(question.id));
  const selectedMarks = selectedQuestions.reduce((total, question) => total + question.marks, 0);

  const toggleQuestion = (questionId: string) => {
    if (assignedIds.has(questionId)) return;

    setSelectedIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleExpanded = (questionId: string) => {
    setExpandedIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = () => {
    if (selectedQuestions.length === 0) return;

    onAssign?.({ questions: selectedQuestions });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-900">Assign Questions</h2>
            {examTitle && <p className="mt-0.5 truncate text-xs text-zinc-500">{examTitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px_160px]">
            <label className="text-sm text-zinc-600">
              Search question bank
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search title, topic, or description"
                className="mt-1.5 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </label>

            <label className="text-sm text-zinc-600">
              Difficulty
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as "all" | QuestionDifficulty)}
                className={`mt-1.5 h-10 w-full px-3 ${greenSelectClassName}`}
              >
                <option className={greenSelectOptionClassName} value="all">All</option>
                <option className={greenSelectOptionClassName} value="EASY">Easy</option>
                <option className={greenSelectOptionClassName} value="MEDIUM">Medium</option>
                <option className={greenSelectOptionClassName} value="HARD">Hard</option>
              </select>
            </label>

            <label className="text-sm text-zinc-600">
              Language
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as "all" | QuestionLanguage)}
                className={`mt-1.5 h-10 w-full px-3 ${greenSelectClassName}`}
              >
                <option className={greenSelectOptionClassName} value="all">All</option>
                <option className={greenSelectOptionClassName} value="JAVASCRIPT">JavaScript</option>
                <option className={greenSelectOptionClassName} value="TYPESCRIPT">TypeScript</option>
                <option className={greenSelectOptionClassName} value="PYTHON">Python</option>
                <option className={greenSelectOptionClassName} value="JAVA">Java</option>
                <option className={greenSelectOptionClassName} value="CPP">C++</option>
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
            <span className="text-zinc-600">
              {selectedQuestions.length} selected
            </span>
            <span className="font-medium text-zinc-900">{selectedMarks} marks</span>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((question) => {
              const isAssigned = assignedIds.has(question.id);
              const isSelected = selectedIdSet.has(question.id);
              const isExpanded = expandedIdSet.has(question.id);

              return (
                <article
                  key={question.id}
                  onClick={() => toggleExpanded(question.id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-orange-300 bg-orange-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  } ${isAssigned ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isAssigned || isSelected}
                      disabled={isAssigned}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleQuestion(question.id)}
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-400 disabled:cursor-not-allowed"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-900">{question.title}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${difficultyStyles[question.difficulty]}`}>
                          {difficultyLabels[question.difficulty]}
                        </span>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                          {languageLabels[question.language]}
                        </span>
                        {isAssigned && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Assigned
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-5 text-zinc-500">{question.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        <span>{question.topic}</span>
                        <span>{question.marks} marks</span>
                        <span>{isExpanded ? "Click to collapse" : "Click to preview"}</span>
                      </div>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`mt-1 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 rounded-md border border-zinc-200 bg-white px-4 py-3">
                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <div className="text-[11px] font-medium uppercase text-zinc-400">Topic</div>
                          <div className="mt-1 font-medium text-zinc-800">{question.topic}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium uppercase text-zinc-400">Language</div>
                          <div className="mt-1 font-medium text-zinc-800">{languageLabels[question.language]}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium uppercase text-zinc-400">Marks</div>
                          <div className="mt-1 font-medium text-zinc-800">{question.marks}</div>
                        </div>
                      </div>
                      <div className="mt-3 border-t border-zinc-100 pt-3">
                        <div className="text-[11px] font-medium uppercase text-zinc-400">Question Preview</div>
                        <p className="mt-1 text-sm leading-6 text-zinc-600">{question.description}</p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {filteredQuestions.length === 0 && (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500">
                No questions match the current filters.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedQuestions.length === 0}
            className="inline-flex h-9 items-center rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 disabled:pointer-events-none disabled:opacity-50"
          >
            Assign Selected
          </button>
        </div>
      </div>
    </div>
  );
}
