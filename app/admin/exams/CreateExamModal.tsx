"use client";

import { useState } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";

type Question = {
  title: string;
  difficulty: Difficulty;
  marks: number;
};

type CreateExamModalProps = {
  open: boolean;
  onClose: () => void;
};

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

const AVAILABLE_QUESTIONS: Question[] = [
  { title: "Two Sum", difficulty: "Easy", marks: 20 },
  { title: "Reverse String", difficulty: "Easy", marks: 15 },
  { title: "Valid Parentheses", difficulty: "Medium", marks: 25 },
];

export default function CreateExamModal({ open, onClose }: CreateExamModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [passMark, setPassMark] = useState(70);

  const toggle = (questionTitle: string) => {
    setSelected((prev) =>
      prev.includes(questionTitle)
        ? prev.filter((q) => q !== questionTitle)
        : [...prev, questionTitle]
    );
  };

  if (!open) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-semibold text-zinc-900">Create New Exam</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">

          {/* Exam Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Exam Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JavaScript Developer Assessment"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this assessment"
              rows={3}
              className="w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          {/* Time Limit + Pass Mark side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Time Limit (minutes)</label>
              <input
                type="number"
                value={timeLimit}
                min={1}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Pass Mark (%)</label>
              <input
                type="number"
                value={passMark}
                min={0}
                max={100}
                onChange={(e) => setPassMark(Number(e.target.value))}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
          </div>

          {/* Select Questions */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Select Questions</label>
            <div className="max-h-48 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50 divide-y divide-zinc-100">
              {AVAILABLE_QUESTIONS.map((q) => {
                const isChecked = selected.includes(q.title);
                return (
                  <label
                    key={q.title}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${isChecked ? "bg-orange-50" : "hover:bg-white"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(q.title)}
                      className="h-4 w-4 rounded border-zinc-300 accent-orange-500"
                    />
                    <span className="flex-1 text-sm font-medium text-zinc-800">{q.title}</span>
                    <DifficultyBadge level={q.difficulty} />
                    <span className="text-xs text-zinc-500 tabular-nums">{q.marks} marks</span>
                  </label>
                );
              })}
            </div>

            {selected.length > 0 && (
              <p className="mt-1.5 text-[11px] text-zinc-500">
                {selected.length} question{selected.length !== 1 ? "s" : ""} selected ·{" "}
                {AVAILABLE_QUESTIONS.filter((q) => selected.includes(q.title)).reduce((sum, q) => sum + q.marks, 0)} total marks
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            Create Exam
          </button>
        </div>

      </div>
    </div>
  );
}