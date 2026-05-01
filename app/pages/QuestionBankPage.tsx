"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Button from "@/src/components/ui/Button";

type Difficulty = "Easy" | "Medium";

type Question = {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  marks: number;
  language: string;
  testCases: number;
};

type QuestionFormValues = {
  title: string;
  difficulty: Difficulty;
  description: string;
  marks: string;
  language: string;
  testCases: string;
};

type QuestionBankHeaderProps = {
  questionCount: number;
  onAddQuestion: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

type QuestionCardProps = {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
};

type CreateQuestionModalProps = {
  initialValues: QuestionFormValues;
  mode: "create" | "edit";
  onClose: () => void;
  onSave: (values: QuestionFormValues) => void;
};

const initialQuestions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers and a target value, return the indices of the two numbers whose sum equals the target while preserving the most efficient approach possible.",
    marks: 20,
    language: "JavaScript",
    testCases: 8,
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    description:
      "Write a function that reverses a string without relying on built-in reverse helpers, and make sure the solution handles whitespace and punctuation correctly.",
    marks: 15,
    language: "Python",
    testCases: 6,
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Medium",
    description:
      "Determine whether a string containing brackets is valid by ensuring every opening bracket is closed in the correct order using a stack-based solution.",
    marks: 25,
    language: "Java",
    testCases: 10,
  },
  {
    id: 4,
    title: "Merge Sorted Lists",
    difficulty: "Easy",
    description:
      "Merge two sorted linked lists and return the combined list with elements in ascending order.",
    marks: 18,
    language: "TypeScript",
    testCases: 7,
  },
  {
    id: 5,
    title: "Max Subarray",
    difficulty: "Medium",
    description:
      "Find the contiguous subarray with the largest sum within a one-dimensional array of numbers.",
    marks: 22,
    language: "JavaScript",
    testCases: 9,
  },
  {
    id: 6,
    title: "Fizz Buzz",
    difficulty: "Easy",
    description:
      "Print numbers from 1 to n with special rules for multiples of 3 and 5.",
    marks: 10,
    language: "Python",
    testCases: 5,
  },
  {
    id: 7,
    title: "Binary Search",
    difficulty: "Easy",
    description:
      "Search a sorted array to find the index of a target value using a binary search algorithm.",
    marks: 15,
    language: "Java",
    testCases: 6,
  },
  {
    id: 8,
    title: "Rotate Matrix",
    difficulty: "Medium",
    description:
      "Rotate an n x n 2D matrix by 90 degrees in place.",
    marks: 24,
    language: "TypeScript",
    testCases: 8,
  },
  {
    id: 9,
    title: "Anagram Check",
    difficulty: "Easy",
    description:
      "Determine if two strings are anagrams by comparing character counts and ordering.",
    marks: 16,
    language: "JavaScript",
    testCases: 7,
  },
  {
    id: 10,
    title: "Depth First Search",
    difficulty: "Medium",
    description:
      "Traverse a tree or graph using depth first search and return the order of nodes visited.",
    marks: 20,
    language: "Python",
    testCases: 8,
  },
  {
    id: 11,
    title: "Find Duplicates",
    difficulty: "Easy",
    description:
      "Find all duplicate values in an array without altering the original order.",
    marks: 14,
    language: "Java",
    testCases: 6,
  },
  {
    id: 12,
    title: "Count Islands",
    difficulty: "Medium",
    description:
      "Count the number of islands in a grid of land and water using a flood fill algorithm.",
    marks: 26,
    language: "TypeScript",
    testCases: 9,
  },
  {
    id: 13,
    title: "Palindromic Substring",
    difficulty: "Medium",
    description:
      "Find the longest palindromic substring in a given string.",
    marks: 25,
    language: "JavaScript",
    testCases: 10,
  },
  {
    id: 14,
    title: "Tree Height",
    difficulty: "Easy",
    description:
      "Compute the height of a binary tree using recursion.",
    marks: 18,
    language: "Python",
    testCases: 7,
  },
  {
    id: 15,
    title: "Queue using Stacks",
    difficulty: "Medium",
    description:
      "Implement a queue with two stacks while preserving FIFO behavior.",
    marks: 23,
    language: "Java",
    testCases: 8,
  },
  {
    id: 16,
    title: "Word Search",
    difficulty: "Medium",
    description:
      "Search for a word in a 2D board of letters using backtracking.",
    marks: 25,
    language: "TypeScript",
    testCases: 10,
  },
  {
    id: 17,
    title: "JSON Validator",
    difficulty: "Easy",
    description:
      "Validate a JSON string by checking proper syntax and string formatting.",
    marks: 15,
    language: "JavaScript",
    testCases: 6,
  },
  {
    id: 18,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    description:
      "Find the longest common prefix among an array of strings.",
    marks: 14,
    language: "Python",
    testCases: 6,
  },
  {
    id: 19,
    title: "Inorder Traversal",
    difficulty: "Medium",
    description:
      "Return the inorder traversal of a binary tree without recursion.",
    marks: 22,
    language: "Java",
    testCases: 8,
  },
  {
    id: 20,
    title: "Cache Eviction",
    difficulty: "Medium",
    description:
      "Implement a simple LRU cache that evicts the least recently used item.",
    marks: 28,
    language: "TypeScript",
    testCases: 10,
  },
];

const emptyFormValues: QuestionFormValues = {
  title: "",
  difficulty: "Easy",
  description: "",
  marks: "",
  language: "",
  testCases: "",
};

const QUESTIONS_PER_PAGE = 2;
const MAX_PAGE_COUNT = 10;

function CodeAssessIcon() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M8 9l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M16 9l3 3-3 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 7l-4 10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function QuestionBankHeader({
  questionCount,
  searchQuery,
  onSearchChange,
}: QuestionBankHeaderProps) {
  return (
    <nav className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          aria-label="Back to admin"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
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
        </Link>

        <div className="flex items-center gap-3">
          <CodeAssessIcon />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              CodeAssess
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Question Bank
            </h1>
          </div>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pl-10 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
        <svg
          viewBox="0 0 24 24"
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
      </div>
    </nav>
  );
}

function AddQuestionCard({ onAddQuestion }: { onAddQuestion: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Add New Question</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Expand your question library with new coding challenges.
        </p>
      </div>
      <Button
        tone="green"
        size="md"
        onClick={onAddQuestion}
      >
        + Add Question
      </Button>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const badgeClasses =
    difficulty === "Easy"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-orange-50 text-orange-700 ring-orange-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClasses}`}
    >
      {difficulty}
    </span>
  );
}

function IconButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function truncateDescription(description: string) {
  if (description.length <= 140) return description;
  return `${description.slice(0, 137)}...`;
}

function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
              {question.title}
            </h2>
            <DifficultyBadge difficulty={question.difficulty} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span>
              <span className="font-medium text-zinc-700">Marks:</span>{" "}
              {question.marks}
            </span>
            <span>
              <span className="font-medium text-zinc-700">Language:</span>{" "}
              {question.language}
            </span>
            <span>
              <span className="font-medium text-zinc-700">Test Cases:</span>{" "}
              {question.testCases}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {truncateDescription(question.description)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label={`View details for ${question.title}`}
            onClick={() => onEdit(question)}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Details
          </button>

          <IconButton
            label={`Edit ${question.title}`}
            className="border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            onClick={() => onEdit(question)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M12 20h9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>

          <IconButton
            label={`Delete ${question.title}`}
            className="border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(question.id)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M3 6h18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6V4h8v2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 6l-1 14H6L5 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M10 11v6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function inputClasses() {
  return "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
}

function CreateQuestionModal({
  initialValues,
  mode,
  onClose,
  onSave,
}: CreateQuestionModalProps) {
  const [values, setValues] = useState<QuestionFormValues>(initialValues);

  function updateField<K extends keyof QuestionFormValues>(
    field: K,
    value: QuestionFormValues[K]
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(values);
  }

  const title =
    mode === "create" ? "Create Question" : `Edit ${initialValues.title}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Add the full question details and keep your bank organized.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
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
                d="M18 6L6 18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <Field label="Question Title">
            <input
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              className={inputClasses()}
              placeholder="e.g. Two Sum"
              required
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Difficulty">
              <select
                value={values.difficulty}
                onChange={(event) =>
                  updateField("difficulty", event.target.value as Difficulty)
                }
                className={inputClasses()}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
              </select>
            </Field>

            <Field label="Language">
              <input
                value={values.language}
                onChange={(event) =>
                  updateField("language", event.target.value)
                }
                className={inputClasses()}
                placeholder="e.g. JavaScript"
                required
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={values.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className={`${inputClasses()} min-h-32 resize-none`}
              placeholder="Describe the problem statement, constraints, and expected output."
              required
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Marks">
              <input
                type="number"
                min="1"
                value={values.marks}
                onChange={(event) => updateField("marks", event.target.value)}
                className={inputClasses()}
                placeholder="e.g. 20"
                required
              />
            </Field>

            <Field label="Test Cases">
              <input
                type="number"
                min="1"
                value={values.testCases}
                onChange={(event) =>
                  updateField("testCases", event.target.value)
                }
                className={inputClasses()}
                placeholder="e.g. 8"
                required
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:justify-end">
            <Button variant="outline" tone="zinc" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" tone="green">
              {mode === "create" ? "Save Question" : "Update Question"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toFormValues(question: Question): QuestionFormValues {
  return {
    title: question.title,
    difficulty: question.difficulty,
    description: question.description,
    marks: String(question.marks),
    language: question.language,
    testCases: String(question.testCases),
  };
}

function QuestionList({
  questions,
  onEdit,
  onDelete,
}: {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between px-2 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Question Library
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Review, edit, and remove coding questions from your bank.
          </p>
        </div>
      </div>

      <div className="max-h-[32rem] space-y-4 overflow-y-auto pr-1">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const activeQuestion = useMemo(
    () => questions.find((question) => question.id === activeQuestionId) ?? null,
    [activeQuestionId, questions]
  );

  function openCreateModal() {
    setActiveQuestionId(null);
    setModalMode("create");
  }

  function openEditModal(question: Question) {
    setActiveQuestionId(question.id);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setActiveQuestionId(null);
  }

  function handleDelete(questionId: number) {
    setQuestions((current) =>
      current.filter((question) => question.id !== questionId)
    );

    if (activeQuestionId === questionId) {
      closeModal();
    }
  }

  function handleSave(values: QuestionFormValues) {
    const nextQuestion: Omit<Question, "id"> = {
      title: values.title.trim(),
      difficulty: values.difficulty,
      description: values.description.trim(),
      marks: Number(values.marks),
      language: values.language.trim(),
      testCases: Number(values.testCases),
    };

    if (modalMode === "edit" && activeQuestionId !== null) {
      setQuestions((current) =>
        current.map((question) =>
          question.id === activeQuestionId
            ? { ...question, ...nextQuestion }
            : question
        )
      );
    } else {
      setQuestions((current) => [
        ...current,
        {
          id: current.length === 0 ? 1 : Math.max(...current.map((q) => q.id)) + 1,
          ...nextQuestion,
        },
      ]);
    }

    closeModal();
  }

  const modalInitialValues =
    modalMode === "edit" && activeQuestion
      ? toFormValues(activeQuestion)
      : emptyFormValues;

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.min(
    MAX_PAGE_COUNT,
    Math.max(1, Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE))
  );

  useEffect(() => {
    const lastValidPage = Math.min(
      MAX_PAGE_COUNT,
      Math.max(1, Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE))
    );

    if (currentPage > lastValidPage) {
      setCurrentPage(lastValidPage);
    }
  }, [filteredQuestions.length, currentPage]);

  const visibleQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < pageCount;
  const startIndex = filteredQuestions.length === 0 ? 0 : (currentPage - 1) * QUESTIONS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * QUESTIONS_PER_PAGE, filteredQuestions.length);

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <QuestionBankHeader
          questionCount={questions.length}
          onAddQuestion={openCreateModal}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="mt-6">
          <AddQuestionCard onAddQuestion={openCreateModal} />
        </div>

        <div className="mt-6">
          <QuestionList
            questions={visibleQuestions}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />

          <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-3xl border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:px-5">
            <p className="text-sm text-zinc-500">
              Showing {startIndex}-{endIndex} of {filteredQuestions.length} questions
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={!hasPreviousPage}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-full border px-4 text-sm font-medium transition ${
                    pageNumber === currentPage
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={!hasNextPage}
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalMode ? (
        <CreateQuestionModal
          mode={modalMode}
          initialValues={modalInitialValues}
          onClose={closeModal}
          onSave={handleSave}
        />
      ) : null}
    </main>
  );
}
