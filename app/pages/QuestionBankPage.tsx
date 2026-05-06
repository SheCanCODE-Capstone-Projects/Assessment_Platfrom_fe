"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Button from "@/src/components/ui/Button";

type Difficulty = "Easy" | "Medium" | "Hard";

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

type DeleteQuestionModalProps = {
  questionTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
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
    title: "Valid Parentheses",
    difficulty: "Medium",
    description:
      "Determine whether a string containing brackets is valid by ensuring every opening bracket is closed in the correct order using a stack-based solution.",
    marks: 25,
    language: "Java",
    testCases: 10,
  },
  {
    id: 3,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    description:
      "Merge multiple sorted linked lists into one sorted list using a strategy that scales well as the number of lists grows.",
    marks: 45,
    language: "Java",
    testCases: 12,
  },
  {
    id: 4,
    title: "Reverse String",
    difficulty: "Easy",
    description:
      "Write a function that reverses a string without relying on built-in reverse helpers, and make sure the solution handles whitespace and punctuation correctly.",
    marks: 15,
    language: "Python",
    testCases: 6,
  },
  {
    id: 5,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description:
      "Find the length of the longest substring without duplicate characters using an optimized sliding window approach.",
    marks: 30,
    language: "JavaScript",
    testCases: 11,
  },
  {
    id: 6,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description:
      "Find the median of two sorted arrays with logarithmic complexity rather than merging the arrays directly.",
    marks: 50,
    language: "C++",
    testCases: 13,
  },
  {
    id: 7,
    title: "Palindrome Number",
    difficulty: "Easy",
    description:
      "Determine whether an integer reads the same forward and backward without converting the number to a string.",
    marks: 14,
    language: "C#",
    testCases: 6,
  },
  {
    id: 8,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description:
      "Return an array where each element is the product of all other values without using division and with linear time complexity.",
    marks: 28,
    language: "Java",
    testCases: 9,
  },
  {
    id: 9,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description:
      "Calculate how much rain water can be trapped between elevation bars using an optimized linear-time approach.",
    marks: 44,
    language: "Python",
    testCases: 11,
  },
  {
    id: 10,
    title: "Merge Sorted Arrays",
    difficulty: "Easy",
    description:
      "Combine two sorted arrays into one sorted result while preserving duplicate values and keeping time complexity efficient.",
    marks: 18,
    language: "TypeScript",
    testCases: 7,
  },
  {
    id: 11,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    description:
      "Return the k most frequent elements from an array while keeping the solution more efficient than full sorting.",
    marks: 32,
    language: "Go",
    testCases: 10,
  },
  {
    id: 12,
    title: "Word Ladder",
    difficulty: "Hard",
    description:
      "Find the shortest transformation sequence between two words where only one character can change at a time.",
    marks: 46,
    language: "TypeScript",
    testCases: 12,
  },
  {
    id: 13,
    title: "Binary Search",
    difficulty: "Easy",
    description:
      "Implement binary search for a sorted array and return the target index or -1 when the value does not exist.",
    marks: 20,
    language: "C++",
    testCases: 8,
  },
  {
    id: 14,
    title: "Group Anagrams",
    difficulty: "Medium",
    description:
      "Group words that are anagrams of one another and return them in a structure that keeps related words together.",
    marks: 26,
    language: "Kotlin",
    testCases: 8,
  },
  {
    id: 15,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    description:
      "Design matching serialization and deserialization functions that preserve the full structure of a binary tree.",
    marks: 48,
    language: "Go",
    testCases: 12,
  },
  {
    id: 16,
    title: "FizzBuzz Variant",
    difficulty: "Easy",
    description:
      "Generate the classic FizzBuzz sequence with a small rule extension and format the result exactly as required.",
    marks: 10,
    language: "Python",
    testCases: 5,
  },
  {
    id: 17,
    title: "Coin Change",
    difficulty: "Medium",
    description:
      "Compute the minimum number of coins needed to make a target amount, or report that it is impossible.",
    marks: 34,
    language: "Python",
    testCases: 11,
  },
  {
    id: 18,
    title: "N-Queens",
    difficulty: "Hard",
    description:
      "Place queens on a chessboard so none attack one another, and return every valid board configuration.",
    marks: 47,
    language: "JavaScript",
    testCases: 11,
  },
  {
    id: 19,
    title: "Climbing Stairs",
    difficulty: "Easy",
    description:
      "Calculate the number of distinct ways to reach the top of a staircase when you can climb one or two steps at a time.",
    marks: 16,
    language: "Ruby",
    testCases: 6,
  },
  {
    id: 20,
    title: "Container With Most Water",
    difficulty: "Medium",
    description:
      "Choose two heights that form the container with the largest area using a two-pointer strategy.",
    marks: 29,
    language: "C++",
    testCases: 9,
  },
  {
    id: 21,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    description:
      "Return the smallest substring of a source string that contains every character from a target string.",
    marks: 49,
    language: "Kotlin",
    testCases: 12,
  },
  {
    id: 22,
    title: "Contains Duplicate",
    difficulty: "Easy",
    description:
      "Check whether any value appears at least twice in an array and return the result with a clean, efficient implementation.",
    marks: 12,
    language: "Java",
    testCases: 6,
  },
  {
    id: 23,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description:
      "Locate a target in a rotated sorted array in logarithmic time without first restoring the original ordering.",
    marks: 31,
    language: "TypeScript",
    testCases: 10,
  },
  {
    id: 24,
    title: "Alien Dictionary",
    difficulty: "Hard",
    description:
      "Infer the ordering of characters in an unknown alphabet from a sorted list of words using graph logic.",
    marks: 43,
    language: "Swift",
    testCases: 10,
  },
  {
    id: 25,
    title: "Roman to Integer",
    difficulty: "Easy",
    description:
      "Convert a Roman numeral string into its integer value while correctly handling subtractive notation cases.",
    marks: 17,
    language: "Go",
    testCases: 7,
  },
  {
    id: 26,
    title: "Spiral Matrix",
    difficulty: "Medium",
    description:
      "Return all values from a matrix in spiral order while carefully managing boundaries after each traversal.",
    marks: 27,
    language: "C#",
    testCases: 8,
  },
  {
    id: 27,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    description:
      "Implement pattern matching for strings with dot and star operators while respecting full-string matching rules.",
    marks: 52,
    language: "C#",
    testCases: 14,
  },
  {
    id: 28,
    title: "Maximum Subarray",
    difficulty: "Easy",
    description:
      "Find the contiguous subarray with the largest sum and explain the time-efficient dynamic programming approach used.",
    marks: 22,
    language: "Kotlin",
    testCases: 8,
  },
  {
    id: 29,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    description:
      "Find the length of the longest run of consecutive integers in an unsorted array with linear-time complexity.",
    marks: 33,
    language: "Rust",
    testCases: 10,
  },
  {
    id: 30,
    title: "Sudoku Solver",
    difficulty: "Hard",
    description:
      "Fill a partially completed Sudoku board by exploring valid candidates and pruning impossible states quickly.",
    marks: 55,
    language: "Rust",
    testCases: 13,
  },
  {
    id: 31,
    title: "Pascal Triangle",
    difficulty: "Easy",
    description:
      "Generate the first numRows of Pascal triangle with correctly nested arrays and predictable output formatting.",
    marks: 13,
    language: "Swift",
    testCases: 5,
  },
  {
    id: 32,
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    description:
      "Modify a matrix so that rows and columns become zero whenever a zero appears, with minimal extra space.",
    marks: 30,
    language: "JavaScript",
    testCases: 9,
  },
  {
    id: 33,
    title: "Distinct Subsequences",
    difficulty: "Hard",
    description:
      "Count how many distinct subsequences of one string equal another string using dynamic programming.",
    marks: 46,
    language: "PHP",
    testCases: 11,
  },
  {
    id: 34,
    title: "Valid Anagram",
    difficulty: "Easy",
    description:
      "Determine whether two strings are anagrams of each other while handling repeated characters accurately.",
    marks: 12,
    language: "PHP",
    testCases: 6,
  },
  {
    id: 35,
    title: "Decode Ways",
    difficulty: "Medium",
    description:
      "Count the number of valid decodings for a digit string using dynamic programming and careful handling of zeros.",
    marks: 32,
    language: "Ruby",
    testCases: 10,
  },
  {
    id: 36,
    title: "Text Justification",
    difficulty: "Hard",
    description:
      "Format text so each line has the required width and spacing rules, including left justification for the last line.",
    marks: 42,
    language: "Ruby",
    testCases: 10,
  },
  {
    id: 37,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description:
      "Compute the maximum depth of a binary tree using either recursive or iterative traversal correctly.",
    marks: 15,
    language: "Go",
    testCases: 6,
  },
  {
    id: 38,
    title: "Number of Islands",
    difficulty: "Medium",
    description:
      "Count the number of islands in a grid by exploring connected land cells without recounting visited positions.",
    marks: 31,
    language: "Java",
    testCases: 10,
  },
  {
    id: 39,
    title: "Course Schedule III",
    difficulty: "Hard",
    description:
      "Choose the maximum number of courses that can be completed before their deadlines using a greedy strategy.",
    marks: 45,
    language: "Java",
    testCases: 11,
  },
  {
    id: 40,
    title: "Linked List Cycle",
    difficulty: "Easy",
    description:
      "Detect whether a linked list contains a cycle using a space-efficient pointer technique.",
    marks: 14,
    language: "TypeScript",
    testCases: 6,
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
  searchQuery,
  onSearchChange,
}: QuestionBankHeaderProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
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
                Code Assess
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Question Bank
              </h1>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
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
      <Button tone="green" size="md" onClick={onAddQuestion}>
        + Add Question
      </Button>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const badgeClasses =
    difficulty === "Easy"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : difficulty === "Medium"
        ? "bg-orange-50 text-orange-700 ring-orange-200"
        : "bg-rose-50 text-rose-700 ring-rose-200";

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
                <option value="Hard">Hard</option>
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

function DeleteQuestionModal({
  questionTitle,
  onCancel,
  onConfirm,
}: DeleteQuestionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Delete Question
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
             If you want to delete this question click on Ok if not Cancel.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close delete modal"
            onClick={onCancel}
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

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-base font-medium text-zinc-900">
              Are you sure you want to delete this question ?
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:justify-end">
            <Button tone="orange" onClick={onCancel}>
              Cancel
            </Button>
            <Button tone="green" onClick={onConfirm}>
              OK
            </Button>
          </div>
        </div>
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
  const [pendingDeleteQuestionId, setPendingDeleteQuestionId] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4;

  const activeQuestion = useMemo(
    () => questions.find((question) => question.id === activeQuestionId) ?? null,
    [activeQuestionId, questions]
  );

  const pendingDeleteQuestion = useMemo(
    () =>
      questions.find((question) => question.id === pendingDeleteQuestionId) ??
      null,
    [pendingDeleteQuestionId, questions]
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

  function requestDelete(questionId: number) {
    setPendingDeleteQuestionId(questionId);
  }

  function closeDeleteModal() {
    setPendingDeleteQuestionId(null);
  }

  function confirmDelete() {
    if (pendingDeleteQuestionId === null) {
      return;
    }

    setQuestions((current) =>
      current.filter((question) => question.id !== pendingDeleteQuestionId)
    );

    if (activeQuestionId === pendingDeleteQuestionId) {
      closeModal();
    }

    closeDeleteModal();
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

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  const modalInitialValues =
    modalMode === "edit" && activeQuestion
      ? toFormValues(activeQuestion)
      : emptyFormValues;

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / questionsPerPage)
  );
  const visiblePage = Math.min(currentPage, totalPages);
  const startIndex = (visiblePage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  return (
    <main className="min-h-screen bg-zinc-50">
      <QuestionBankHeader
        questionCount={questions.length}
        onAddQuestion={openCreateModal}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mt-6">
          <AddQuestionCard onAddQuestion={openCreateModal} />
        </div>

        <div className="mt-6">
          <QuestionList
            questions={paginatedQuestions}
            onEdit={openEditModal}
            onDelete={requestDelete}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(visiblePage - 1, 1))}
              disabled={visiblePage === 1}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-200"
            >
              Previous
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    visiblePage === page
                      ? "bg-emerald-600 text-white"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-200 hover:text-emerald-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(visiblePage + 1, totalPages))}
              disabled={visiblePage === totalPages}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-200"
            >
              Next
            </button>
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

      {pendingDeleteQuestion ? (
        <DeleteQuestionModal
          questionTitle={pendingDeleteQuestion.title}
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      ) : null}
    </main>
  );
}
