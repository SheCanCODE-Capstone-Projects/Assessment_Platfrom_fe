"use client";

import { useMemo, useState } from "react";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionLanguage =
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "PYTHON"
  | "JAVA"
  | "CPP"
  | "CSHARP"
  | "PHP";

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
  questions?: QuestionBankItem[];
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
  CSHARP: "C#",
  PHP: "PHP",
};

export const difficultyStyles: Record<QuestionDifficulty, string> = {
  EASY: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MEDIUM: "border-orange-200 bg-orange-50 text-orange-700",
  HARD: "border-red-200 bg-red-50 text-red-700",
};

type DifficultyFilter = "all" | QuestionDifficulty;
type LanguageFilter = "all" | QuestionLanguage;

const difficultyFilterOptions: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const languageFilterOptions: { value: LanguageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "JAVASCRIPT", label: "JavaScript" },
  { value: "TYPESCRIPT", label: "TypeScript" },
  { value: "PYTHON", label: "Python" },
  { value: "JAVA", label: "Java" },
  { value: "CPP", label: "C++" },
  { value: "CSHARP", label: "C#" },
  { value: "PHP", label: "PHP" },
];

export default function AssignQuestionModal({
  open,
  examTitle,
  assignedQuestionIds = [],
  questions = QUESTION_BANK,
  onClose,
  onAssign,
}: AssignQuestionModalProps) {
  if (!open) return null;

  return (
    <AssignQuestionModalContent
      examTitle={examTitle}
      assignedQuestionIds={assignedQuestionIds}
      questions={questions}
      onClose={onClose}
      onAssign={onAssign}
    />
  );
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  open,
  onOpenChange,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: T) => void;
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <label className="text-sm text-zinc-600">
      {label}
      <div
        className="relative mt-1.5"
        onBlur={(event) => {
          const nextFocus = event.relatedTarget as Node | null;

          if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
            onOpenChange(false);
          }
        }}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => onOpenChange(!open)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 outline-none transition hover:border-emerald-500 hover:text-emerald-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
        >
          <span>{selectedOption?.label ?? value}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4 text-zinc-900"
            fill="currentColor"
          >
            <path d="M5.5 7.5h9L10 13l-4.5-5.5Z" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-md border border-zinc-300 bg-white py-1 shadow-lg">
            <div role="listbox" aria-label={label}>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(option.value);
                    onOpenChange(false);
                  }}
                  className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-zinc-700 hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white focus:outline-none"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </label>
  );
}

function AssignQuestionModalContent({
  examTitle,
  assignedQuestionIds,
  questions,
  onClose,
  onAssign,
}: Omit<AssignQuestionModalProps, "open"> & {
  assignedQuestionIds: string[];
  questions: QuestionBankItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [language, setLanguage] = useState<LanguageFilter>("all");
  const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const assignedIds = useMemo(() => new Set(assignedQuestionIds), [assignedQuestionIds]);
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const expandedIdSet = useMemo(() => new Set(expandedIds), [expandedIds]);

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesDifficulty = difficulty === "all" || question.difficulty === difficulty;
      const matchesLanguage = language === "all" || question.language === language;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.title.toLowerCase().includes(normalizedSearch) ||
        question.description.toLowerCase().includes(normalizedSearch) ||
        question.topic.toLowerCase().includes(normalizedSearch);

      return matchesDifficulty && matchesLanguage && matchesSearch;
    });
  }, [difficulty, language, questions, searchTerm]);

  const selectedQuestions = questions.filter((question) => selectedIdSet.has(question.id));
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-6">
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

        <div className="max-h-[72vh] space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
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

            <FilterDropdown
              label="Difficulty"
              value={difficulty}
              options={difficultyFilterOptions}
              open={difficultyDropdownOpen}
              onOpenChange={setDifficultyDropdownOpen}
              onChange={setDifficulty}
            />

            <FilterDropdown
              label="Language"
              value={language}
              options={languageFilterOptions}
              open={languageDropdownOpen}
              onOpenChange={setLanguageDropdownOpen}
              onChange={setLanguage}
            />
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

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedQuestions.length === 0}
            className="inline-flex h-9 w-full items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            Assign Selected
          </button>
        </div>
      </div>
    </div>
  );
}
