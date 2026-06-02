"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { getAccessToken } from "@/lib/adminAuth";

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type DifficultyFilter = "ALL" | Difficulty;
type Language =
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "PYTHON"
  | "JAVA"
  | "CPLUSPLUS"
  | "GO"
  | "CSHARP"
  | "KOTLIN"
  | "RUST"
  | "SWIFT"
  | "RUBY"
  | "PHP";

type Question = {
  id: string | number;
  title: string;
  description: string;
  marks: number;
  difficulty: Difficulty;
  language: Language;
  starterCode: string;
  testCases?: Array<{ input: string; expectedOutput: string }>;
};

type QuestionFormValues = {
  title: string;
  description: string;
  marks: string;
  difficulty: Difficulty | "";
  language: Language;
  starterCode: string;
  testInput: string;
  expectedOutput: string;
};

type QuestionCardProps = {
  question: Question;
  onViewDetails: (question: Question) => void;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string | number) => void;
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

type QuestionDetailsModalProps = {
  question: Question;
  onClose: () => void;
};

const initialQuestions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    description: "Find two array values that add up to the target.",
    marks: 20,
    difficulty: "EASY",
    language: "JAVASCRIPT",
    starterCode:
      "function twoSum(nums, target) {\n  // return the indices here\n}",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    description: "Check if every bracket opens and closes in the right order.",
    marks: 25,
    difficulty: "MEDIUM",
    language: "JAVA",
    starterCode:
      "public boolean isValid(String s) {\n    // write your logic here\n}",
  },
  {
    id: 3,
    title: "Merge K Sorted Lists",
    description: "Merge many sorted linked lists into one sorted list.",
    marks: 45,
    difficulty: "HARD",
    language: "JAVA",
    starterCode:
      "public ListNode mergeKLists(ListNode[] lists) {\n    // solve here\n}",
  },
  {
    id: 4,
    title: "Reverse String",
    description: "Reverse a string without using built-in reverse helpers.",
    marks: 15,
    difficulty: "EASY",
    language: "PYTHON",
    starterCode: "def reverse_string(value):\n    # return reversed string\n    pass",
  },
  {
    id: 5,
    title: "Longest Substring",
    description: "Return the longest substring with no repeated characters.",
    marks: 30,
    difficulty: "MEDIUM",
    language: "JAVASCRIPT",
    starterCode:
      "function lengthOfLongestSubstring(text) {\n  // solve here\n}",
  },
  {
    id: 6,
    title: "Median of Two Sorted Arrays",
    description: "Find the median of two sorted arrays efficiently.",
    marks: 50,
    difficulty: "HARD",
    language: "CPLUSPLUS",
    starterCode:
      "double findMedianSortedArrays(vector<int>& a, vector<int>& b) {\n  // solve here\n}",
  },
  {
    id: 7,
    title: "Palindrome Number",
    description: "Decide if an integer reads the same forward and backward.",
    marks: 14,
    difficulty: "EASY",
    language: "CSHARP",
    starterCode:
      "public bool IsPalindrome(int x) {\n    // solve here\n}",
  },
  {
    id: 8,
    title: "Product Except Self",
    description: "Build an output array without using division.",
    marks: 28,
    difficulty: "MEDIUM",
    language: "JAVA",
    starterCode:
      "public int[] productExceptSelf(int[] nums) {\n    // solve here\n}",
  },
  {
    id: 9,
    title: "Trapping Rain Water",
    description: "Calculate how much water can stay between bars.",
    marks: 44,
    difficulty: "HARD",
    language: "PYTHON",
    starterCode: "def trap(height):\n    # solve here\n    pass",
  },
  {
    id: 10,
    title: "Binary Search",
    description: "Find the target index in a sorted array.",
    marks: 20,
    difficulty: "EASY",
    language: "TYPESCRIPT",
    starterCode:
      "function search(nums: number[], target: number): number {\n  // solve here\n}",
  },
  {
    id: 11,
    title: "Top K Frequent Elements",
    description: "Return the most frequent values from an array.",
    marks: 32,
    difficulty: "MEDIUM",
    language: "GO",
    starterCode:
      "func topKFrequent(nums []int, k int) []int {\n    // solve here\n}",
  },
  {
    id: 12,
    title: "Word Ladder",
    description: "Find the shortest word transformation sequence.",
    marks: 46,
    difficulty: "HARD",
    language: "TYPESCRIPT",
    starterCode:
      "function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {\n  // solve here\n}",
  },
  {
    id: 13,
    title: "Contains Duplicate",
    description: "Check if an array contains any repeated value.",
    marks: 12,
    difficulty: "EASY",
    language: "JAVA",
    starterCode:
      "public boolean containsDuplicate(int[] nums) {\n    // solve here\n}",
  },
  {
    id: 14,
    title: "Group Anagrams",
    description: "Group words that share the same sorted letters.",
    marks: 26,
    difficulty: "MEDIUM",
    language: "KOTLIN",
    starterCode:
      "fun groupAnagrams(strs: Array<String>): List<List<String>> {\n    // solve here\n}",
  },
  {
    id: 15,
    title: "Sudoku Solver",
    description: "Fill the board by trying only valid number choices.",
    marks: 55,
    difficulty: "HARD",
    language: "RUST",
    starterCode:
      "fn solve_sudoku(board: &mut Vec<Vec<char>>) {\n    // solve here\n}",
  },
  {
    id: 16,
    title: "Roman to Integer",
    description: "Convert a Roman numeral string into a number.",
    marks: 17,
    difficulty: "EASY",
    language: "GO",
    starterCode:
      "func romanToInt(s string) int {\n    // solve here\n}",
  },
  {
    id: 17,
    title: "Coin Change",
    description: "Find the fewest coins needed for a target amount.",
    marks: 34,
    difficulty: "MEDIUM",
    language: "PYTHON",
    starterCode: "def coin_change(coins, amount):\n    # solve here\n    pass",
  },
  {
    id: 18,
    title: "N-Queens",
    description: "Return all valid ways to place queens on the board.",
    marks: 47,
    difficulty: "HARD",
    language: "JAVASCRIPT",
    starterCode:
      "function solveNQueens(n) {\n  // solve here\n}",
  },
  {
    id: 19,
    title: "Climbing Stairs",
    description: "Count the total ways to reach the top.",
    marks: 16,
    difficulty: "EASY",
    language: "RUBY",
    starterCode:
      "def climb_stairs(n)\n  # solve here\nend",
  },
  {
    id: 20,
    title: "Spiral Matrix",
    description: "Return matrix values in spiral order.",
    marks: 27,
    difficulty: "MEDIUM",
    language: "CSHARP",
    starterCode:
      "public IList<int> SpiralOrder(int[][] matrix) {\n    // solve here\n}",
  },
  {
    id: 21,
    title: "Fizz Buzz",
    description: "Return the right word or number for each value from one to n.",
    marks: 10,
    difficulty: "EASY",
    language: "PHP",
    starterCode:
      "function fizzBuzz($n) {\n    // solve here\n}",
  },
  {
    id: 22,
    title: "Min Stack",
    description: "Design a stack that can return the minimum value in constant time.",
    marks: 29,
    difficulty: "MEDIUM",
    language: "TYPESCRIPT",
    starterCode:
      "class MinStack {\n  // solve here\n}",
  },
  {
    id: 23,
    title: "Serialize Binary Tree",
    description: "Convert a binary tree to text and rebuild it again.",
    marks: 48,
    difficulty: "HARD",
    language: "PYTHON",
    starterCode:
      "class Codec:\n    def serialize(self, root):\n        pass\n\n    def deserialize(self, data):\n        pass",
  },
  {
    id: 24,
    title: "Single Number",
    description: "Find the one value that appears only once in the array.",
    marks: 18,
    difficulty: "EASY",
    language: "SWIFT",
    starterCode:
      "func singleNumber(_ nums: [Int]) -> Int {\n    // solve here\n}",
  },
  {
    id: 25,
    title: "Course Schedule",
    description: "Decide if all courses can be finished from the prerequisite list.",
    marks: 33,
    difficulty: "MEDIUM",
    language: "JAVA",
    starterCode:
      "public boolean canFinish(int numCourses, int[][] prerequisites) {\n    // solve here\n}",
  },
  {
    id: 26,
    title: "Alien Dictionary",
    description: "Work out the letter order from a sorted list of alien words.",
    marks: 52,
    difficulty: "HARD",
    language: "GO",
    starterCode:
      "func alienOrder(words []string) string {\n    // solve here\n}",
  },
  {
    id: 27,
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest total sum.",
    marks: 21,
    difficulty: "EASY",
    language: "SWIFT",
    starterCode:
      "func maxSubArray(_ nums: [Int]) -> Int {\n    // solve here\n}",
  },
  {
    id: 28,
    title: "Number of Islands",
    description: "Count all disconnected islands in the grid.",
    marks: 31,
    difficulty: "MEDIUM",
    language: "PYTHON",
    starterCode:
      "def num_islands(grid):\n    # solve here\n    pass",
  },
  {
    id: 29,
    title: "Regular Expression Matching",
    description: "Match a string against a pattern with dot and star rules.",
    marks: 54,
    difficulty: "HARD",
    language: "JAVA",
    starterCode:
      "public boolean isMatch(String s, String p) {\n    // solve here\n}",
  },
  {
    id: 30,
    title: "Best Time to Buy and Sell Stock",
    description: "Return the best profit you can make with one trade.",
    marks: 19,
    difficulty: "EASY",
    language: "TYPESCRIPT",
    starterCode:
      "function maxProfit(prices: number[]): number {\n  // solve here\n}",
  },
  {
    id: 31,
    title: "Decode Ways",
    description: "Count how many ways a numeric string can be decoded.",
    marks: 35,
    difficulty: "MEDIUM",
    language: "KOTLIN",
    starterCode:
      "fun numDecodings(s: String): Int {\n    // solve here\n}",
  },
  {
    id: 32,
    title: "LFU Cache",
    description: "Design a cache that evicts the least frequently used entry.",
    marks: 56,
    difficulty: "HARD",
    language: "CPLUSPLUS",
    starterCode:
      "class LFUCache {\npublic:\n  // solve here\n};",
  },
  {
    id: 33,
    title: "Move Zeroes",
    description: "Shift all zeroes to the end while keeping other values in order.",
    marks: 13,
    difficulty: "EASY",
    language: "GO",
    starterCode:
      "func moveZeroes(nums []int) {\n    // solve here\n}",
  },
  {
    id: 34,
    title: "Search in Rotated Sorted Array",
    description: "Find the target in a sorted array that has been rotated.",
    marks: 36,
    difficulty: "MEDIUM",
    language: "RUST",
    starterCode:
      "fn search(nums: Vec<i32>, target: i32) -> i32 {\n    // solve here\n}",
  },
  {
    id: 35,
    title: "Burst Balloons",
    description: "Choose the best order to burst balloons for the maximum score.",
    marks: 58,
    difficulty: "HARD",
    language: "PYTHON",
    starterCode:
      "def max_coins(nums):\n    # solve here\n    pass",
  },
  {
    id: 36,
    title: "Majority Element",
    description: "Return the value that appears more than half the time.",
    marks: 11,
    difficulty: "EASY",
    language: "JAVA",
    starterCode:
      "public int majorityElement(int[] nums) {\n    // solve here\n}",
  },
  {
    id: 37,
    title: "Daily Temperatures",
    description: "For each day, return how long it takes to get a warmer day.",
    marks: 30,
    difficulty: "MEDIUM",
    language: "JAVASCRIPT",
    starterCode:
      "function dailyTemperatures(temperatures) {\n  // solve here\n}",
  },
  {
    id: 38,
    title: "Edit Distance",
    description: "Compute the fewest edits needed to transform one word into another.",
    marks: 53,
    difficulty: "HARD",
    language: "CSHARP",
    starterCode:
      "public int MinDistance(string word1, string word2) {\n    // solve here\n}",
  },
  {
    id: 39,
    title: "Pascal's Triangle",
    description: "Generate the first rows of Pascal's Triangle.",
    marks: 12,
    difficulty: "EASY",
    language: "PHP",
    starterCode:
      "function generate($numRows) {\n    // solve here\n}",
  },
  {
    id: 40,
    title: "K Closest Points to Origin",
    description: "Return the points closest to the origin.",
    marks: 33,
    difficulty: "MEDIUM",
    language: "TYPESCRIPT",
    starterCode:
      "function kClosest(points: number[][], k: number): number[][] {\n  // solve here\n}",
  },
];

const emptyFormValues: QuestionFormValues = {
  title: "",
  description: "",
  marks: "",
  difficulty: "",
  language: "JAVASCRIPT",
  starterCode: "",
  testInput: "",
  expectedOutput: "",
};

const difficultyOrder: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const languageOptions: Language[] = [
  "JAVASCRIPT",
  "TYPESCRIPT",
  "PYTHON",
  "JAVA",
  "CPLUSPLUS",
  "GO",
  "CSHARP",
  "KOTLIN",
  "RUST",
  "SWIFT",
  "RUBY",
  "PHP",
];

async function apiRequest<T>(
  path: string,
  init: Omit<RequestInit, "headers"> & { headers?: Record<string, string> } = {},
): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Unauthorized: missing access token");

  const res = await fetch(`/api/backend${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const body = (await res.json().catch(() => null)) as any;
  if (!res.ok) {
    const message = body?.message ?? body?.error ?? `HTTP ${res.status}`;
    throw new Error(message);
  }
  return (body?.data ?? body) as T;
}

function formatDifficulty(difficulty: Difficulty) {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
}

function formatLanguage(language: Language) {
  if (language === "JAVASCRIPT") return "JavaScript";
  if (language === "TYPESCRIPT") return "TypeScript";
  if (language === "CPLUSPLUS") return "C++";
  if (language === "CSHARP") return "C#";
  return language.charAt(0) + language.slice(1).toLowerCase();
}

function getVisiblePages(totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

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

function QuestionBankHeader() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center px-6 py-5">
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
      </div>
    </nav>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const badgeClasses =
    difficulty === "EASY"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : difficulty === "MEDIUM"
        ? "bg-orange-50 text-orange-700 ring-orange-200"
        : "bg-rose-50 text-rose-700 ring-rose-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClasses}`}
    >
      {formatDifficulty(difficulty)}
    </span>
  );
}

function StatusFilter({
  activeFilter,
  onFilterChange,
  onAddQuestion,
  searchQuery,
  onSearchChange,
}: {
  activeFilter: DifficultyFilter;
  onFilterChange: (filter: DifficultyFilter) => void;
  onAddQuestion: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options: Array<{ value: DifficultyFilter; label: string }> = [
    { value: "ALL", label: "All status" },
    ...difficultyOrder.map((difficulty) => ({
      value: difficulty,
      label: formatDifficulty(difficulty),
    })),
  ];
  const activeOption =
    options.find((option) => option.value === activeFilter) ?? options[0];

  return (
    <section className="w-full rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Button tone="green" size="md" onClick={onAddQuestion}>
          + Add Question
        </Button>

        <div
          ref={containerRef}
          className="relative w-full lg:flex-1 lg:px-6"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-medium text-zinc-600">
              Question Status
            </span>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((current) => !current)}
              className="flex min-w-[130px] items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-900 outline-none transition hover:border-emerald-300 hover:bg-emerald-50/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <span>{activeOption.label}</span>
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 text-zinc-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="m6 9 6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {isOpen ? (
            <div className="absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-full max-w-[220px] -translate-x-1/2 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg">
              <ul role="listbox" aria-label="Question status filter">
                {options.map((option) => {
                  const isActive = option.value === activeFilter;
                  const isAllStatus = option.value === "ALL";

                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => {
                          onFilterChange(option.value);
                          setIsOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition ${
                          isAllStatus
                            ? "bg-white text-zinc-900 hover:bg-white hover:text-zinc-900"
                            : isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-zinc-900 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="relative w-full lg:w-[260px]">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 w-full rounded-md border border-zinc-900 px-3 pl-10 pr-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
    </section>
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

function QuestionCard({
  question,
  onViewDetails,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white px-4 py-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
              {question.title}
            </h2>
            <DifficultyBadge difficulty={question.difficulty} />
          </div>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {question.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span>
              <span className="font-medium text-zinc-700">Marks:</span>{" "}
              {question.marks}
            </span>
            <span>
              <span className="font-medium text-zinc-700">Language:</span>{" "}
              {formatLanguage(question.language)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label={`View details for ${question.title}`}
            onClick={() => onViewDetails(question)}
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
            className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
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

function SelectChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DifficultySelect({
  value,
  onChange,
}: {
  value: Difficulty | "";
  onChange: (value: Difficulty) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-emerald-400 bg-white px-4 py-3 text-left text-sm outline-none transition hover:border-emerald-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      >
        <span className={value ? "text-zinc-900" : "text-zinc-500"}>
          {value ? formatDifficulty(value) : "Question Type"}
        </span>
        <span className="text-emerald-700">
          <SelectChevron isOpen={isOpen} />
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg">
          <ul role="listbox" aria-label="Difficulty">
            {difficultyOrder.map((difficulty) => {
              const isActive = difficulty === value;

              return (
                <li key={difficulty}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(difficulty);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-zinc-900 hover:bg-emerald-600 hover:text-white"
                    }`}
                  >
                    {formatDifficulty(difficulty)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function LanguageSelect({
  value,
  onChange,
}: {
  value: Language;
  onChange: (value: Language) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-900 outline-none transition hover:border-emerald-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      >
        <span>{formatLanguage(value)}</span>
        <span className="text-zinc-700">
          <SelectChevron isOpen={isOpen} />
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 max-h-72 overflow-y-auto rounded-2xl border border-emerald-200 bg-white shadow-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul role="listbox" aria-label="Language">
            {languageOptions.map((language) => {
              const isActive = language === value;

              return (
                <li key={language}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(language);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-zinc-900 hover:bg-emerald-600 hover:text-white"
                    }`}
                  >
                    {formatLanguage(language)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function CreateQuestionModal({
  initialValues,
  mode,
  onClose,
  onSave,
}: CreateQuestionModalProps) {
  const [values, setValues] = useState<QuestionFormValues>(initialValues);
  const [showDifficultyError, setShowDifficultyError] = useState(false);

  function updateField<K extends keyof QuestionFormValues>(
    field: K,
    value: QuestionFormValues[K]
  ) {
    if (field === "difficulty" && value) {
      setShowDifficultyError(false);
    }

    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.difficulty) {
      setShowDifficultyError(true);
      return;
    }

    onSave(values);
  }

  const title =
    mode === "create" ? "Create Question" : `Edit ${initialValues.title}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-4 py-8">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-3.5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Fill in the required question fields and save your update.
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

        <form onSubmit={handleSubmit} className="space-y-3 px-5 py-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                value={values.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={inputClasses()}
                placeholder="e.g. Two Sum"
                required
              />
            </Field>

            <Field label="Difficulty">
              <DifficultySelect
                value={values.difficulty}
                onChange={(difficulty) => updateField("difficulty", difficulty)}
              />
              {showDifficultyError ? (
                <p className="mt-2 text-xs text-red-600">
                  Please choose a question type.
                </p>
              ) : null}
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Language">
              <LanguageSelect
                value={values.language}
                onChange={(language) => updateField("language", language)}
              />
            </Field>

            <Field label="Marks">
              <input
                type="number"
                min="0"
                value={values.marks}
                onChange={(event) => updateField("marks", event.target.value)}
                className={inputClasses()}
                placeholder="e.g. 20"
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
              className={`${inputClasses()} min-h-20 resize-none`}
              placeholder="Write a short question description."
              required
            />
          </Field>

          <div className="grid grid-cols-1 gap-3">
            <Field label="Starter Code">
              <textarea
                value={values.starterCode}
                onChange={(event) =>
                  updateField("starterCode", event.target.value)
                }
                className={`${inputClasses()} min-h-20 resize-none`}
                placeholder="Add starter code here."
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Test case input">
              <textarea
                value={values.testInput}
                onChange={(event) => updateField("testInput", event.target.value)}
                className={`${inputClasses()} min-h-16 resize-none`}
                placeholder="e.g. [2,7,11,15], 9"
                required
              />
            </Field>

            <Field label="Expected output">
              <textarea
                value={values.expectedOutput}
                onChange={(event) =>
                  updateField("expectedOutput", event.target.value)
                }
                className={`${inputClasses()} min-h-16 resize-none`}
                placeholder="e.g. [0,1]"
                required
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-3 sm:flex-row sm:justify-end">
            <Button
              tone="zinc"
              onClick={onClose}
              className="bg-red-600 text-white hover:bg-red-700"
            >
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
              Are you sure you want to delete {questionTitle}?
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              tone="zinc"
              onClick={onCancel}
              className="border-red-600 bg-red-600 text-white hover:bg-red-700"
            >
              Cancel
            </Button>
            <Button
              tone="zinc"
              onClick={onConfirm}
              className="!border-red-600 !bg-red-600 !text-white hover:!bg-red-700"
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionDetailsModal({
  question,
  onClose,
}: QuestionDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Question Details
            </p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-900">
              {question.title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close details modal"
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

        <div className="mt-4 flex flex-wrap gap-2">
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
            {formatLanguage(question.language)}
          </span>
          <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
            {question.marks} marks
          </span>
        </div>

        <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-900">About Question</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {question.description}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-200 p-4">
          <p className="text-sm font-medium text-zinc-900">Starter Code</p>
          <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-zinc-600">
            {question.starterCode}
          </p>
        </div>
      </div>
    </div>
  );
}

function toFormValues(question: Question): QuestionFormValues {
  const first = question.testCases?.[0];
  return {
    title: question.title,
    description: question.description,
    marks: String(question.marks),
    difficulty: question.difficulty,
    language: question.language,
    starterCode: question.starterCode,
    testInput: first?.input ?? "",
    expectedOutput: first?.expectedOutput ?? "",
  };
}

function QuestionList({
  questions,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  questions: Question[];
  onViewDetails: (question: Question) => void;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string | number) => void;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between px-2 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Question Library
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Review, edit, and filter questions by difficulty.
          </p>
        </div>
      </div>

      <div
        className="max-h-[32rem] space-y-4 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {questions.length ? (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-12 text-center">
            <p className="text-base font-medium text-zinc-900">
              No questions found
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Try another search or choose a different difficulty filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [detailQuestionId, setDetailQuestionId] = useState<string | null>(null);
  const [pendingDeleteQuestionId, setPendingDeleteQuestionId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<DifficultyFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const list = await apiRequest<any[]>("/questions", {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const mapped: Question[] = (list ?? [])
          .map((q) => ({
            id: String(q?.id ?? q?.questionId ?? ""),
            title: String(q?.title ?? ""),
            description: String(q?.description ?? ""),
            marks: Number(q?.marks ?? 0),
            difficulty: (q?.difficulty ?? "EASY") as Difficulty,
            language: (q?.language ?? "JAVASCRIPT") as Language,
            starterCode: String(q?.starterCode ?? ""),
            testCases: Array.isArray(q?.testCases) ? q.testCases : undefined,
          }))
          .filter((q) => q.id.trim() !== "");

        if (!cancelled) {
          setQuestions(mapped);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError((e as Error).message || "Failed to load questions");
          setQuestions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeQuestion = useMemo(
    () =>
      questions.find((question) => String(question.id) === activeQuestionId) ??
      null,
    [activeQuestionId, questions]
  );

  const detailQuestion = useMemo(
    () =>
      questions.find((question) => String(question.id) === detailQuestionId) ??
      null,
    [detailQuestionId, questions]
  );

  const pendingDeleteQuestion = useMemo(
    () =>
      questions.find((question) => String(question.id) === pendingDeleteQuestionId) ??
      null,
    [pendingDeleteQuestionId, questions]
  );

  function openCreateModal() {
    setActiveQuestionId(null);
    setModalMode("create");
  }

  function openEditModal(question: Question) {
    setActiveQuestionId(String(question.id));
    setModalMode("edit");
  }

  function openDetailsModal(question: Question) {
    setDetailQuestionId(String(question.id));
  }

  function closeModal() {
    setModalMode(null);
    setActiveQuestionId(null);
  }

  function closeDetailsModal() {
    setDetailQuestionId(null);
  }

  function requestDelete(questionId: string | number) {
    setPendingDeleteQuestionId(String(questionId));
  }

  function closeDeleteModal() {
    setPendingDeleteQuestionId(null);
  }

  async function confirmDelete() {
    if (pendingDeleteQuestionId === null) {
      return;
    }

    try {
      await apiRequest<void>(`/questions/${pendingDeleteQuestionId}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
    } catch (e) {
      setLoadError((e as Error).message || "Failed to delete question");
    }

    setQuestions((current) =>
      current.filter((question) => String(question.id) !== pendingDeleteQuestionId)
    );

    if (activeQuestionId === pendingDeleteQuestionId) {
      closeModal();
    }

    if (detailQuestionId === pendingDeleteQuestionId) {
      closeDetailsModal();
    }

    closeDeleteModal();
  }

  async function handleSave(values: QuestionFormValues) {
    const nextQuestion: Omit<Question, "id"> = {
      title: values.title.trim(),
      description: values.description.trim(),
      marks: Number(values.marks),
      difficulty: values.difficulty || "EASY",
      language: values.language,
      starterCode: values.starterCode.trim(),
      testCases: [
        {
          input: values.testInput.trim(),
          expectedOutput: values.expectedOutput.trim(),
        },
      ],
    };

    if (modalMode === "edit" && activeQuestionId !== null) {
      try {
        await apiRequest(`/questions/${activeQuestionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(nextQuestion),
        });
      } catch (e) {
        setLoadError((e as Error).message || "Failed to update question");
      }
      setQuestions((current) =>
        current.map((question) =>
          String(question.id) === activeQuestionId
            ? { ...question, ...nextQuestion }
            : question
        )
      );
    } else {
      try {
        const created = await apiRequest<any>("/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(nextQuestion),
        });
        const createdId = String(created?.id ?? created?.questionId ?? "");
        setQuestions((current) => [
          ...current,
          {
            id: createdId.trim() ? createdId : `tmp-${Date.now()}`,
            ...nextQuestion,
          },
        ]);
      } catch (e) {
        setLoadError((e as Error).message || "Failed to create question");
        setQuestions((current) => [
          ...current,
          {
            id: `tmp-${Date.now()}`,
            ...nextQuestion,
          },
        ]);
      }
    }

    closeModal();
  }

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleFilterChange(filter: DifficultyFilter) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  const modalInitialValues =
    modalMode === "edit" && activeQuestion
      ? toFormValues(activeQuestion)
      : emptyFormValues;

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatLanguage(question.language)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      activeFilter === "ALL" || question.difficulty === activeFilter;

    return matchesSearch && matchesDifficulty;
  });

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
  const visiblePages = getVisiblePages(totalPages);

  return (
    <main className="min-h-screen bg-zinc-50">
      <QuestionBankHeader />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {loading ? (
          <div className="mb-4 rounded-3xl border border-zinc-200 bg-white px-6 py-4 text-sm text-zinc-600 shadow-sm">
            Loading questions…
          </div>
        ) : null}

        {loadError ? (
          <div className="mb-4 rounded-3xl border border-orange-200 bg-orange-50 px-6 py-4 text-sm text-orange-800">
            {loadError}
          </div>
        ) : null}

        <div>
          <StatusFilter
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onAddQuestion={openCreateModal}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>

        <div className="mt-6">
          <QuestionList
            questions={paginatedQuestions}
            onViewDetails={openDetailsModal}
            onEdit={openEditModal}
            onDelete={requestDelete}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-3 shadow-sm">
            <button
              onClick={() => setCurrentPage(Math.max(visiblePage - 1, 1))}
              disabled={visiblePage === 1}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-200"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition ${
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
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-200"
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

      {detailQuestion ? (
        <QuestionDetailsModal
          question={detailQuestion}
          onClose={closeDetailsModal}
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
