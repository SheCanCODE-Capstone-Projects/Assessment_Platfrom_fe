"use client";

import { useState } from "react";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionLanguage = "JAVASCRIPT" | "TYPESCRIPT" | "PYTHON" | "JAVA" | "CPP";

export type AssignQuestionPayload = {
  title: string;
  description: string;
  marks: number;
  difficulty: QuestionDifficulty;
  language: QuestionLanguage;
  starterCode: string;
};

type AssignQuestionModalProps = {
  open: boolean;
  examTitle?: string;
  onClose: () => void;
  onAssign?: (payload: AssignQuestionPayload) => void;
};

const defaultStarterCode = `function solution() {
  // Write your code here
}`;

export default function AssignQuestionModal({
  open,
  examTitle,
  onClose,
  onAssign,
}: AssignQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [marks, setMarks] = useState(10);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("EASY");
  const [language, setLanguage] = useState<QuestionLanguage>("JAVASCRIPT");
  const [starterCode, setStarterCode] = useState(defaultStarterCode);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMarks(10);
    setDifficulty("EASY");
    setLanguage("JAVASCRIPT");
    setStarterCode(defaultStarterCode);
  };

  const handleSubmit = () => {
    onAssign?.({
      title: title.trim() || "Untitled Question",
      description: description.trim() || "No description provided",
      marks: Number.isFinite(marks) ? marks : 0,
      difficulty,
      language,
      starterCode: starterCode.trim(),
    });
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-900">Assign Question</h2>
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
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Two Sum"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the problem statement"
              rows={4}
              className="w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Marks</label>
              <input
                type="number"
                value={marks}
                min={0}
                onChange={(event) => setMarks(Number(event.target.value))}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Difficulty</label>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as QuestionDifficulty)}
                className="h-[38px] w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Language</label>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as QuestionLanguage)}
                className="h-[38px] w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              >
                <option value="JAVASCRIPT">JavaScript</option>
                <option value="TYPESCRIPT">TypeScript</option>
                <option value="PYTHON">Python</option>
                <option value="JAVA">Java</option>
                <option value="CPP">C++</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Starter Code</label>
            <textarea
              value={starterCode}
              onChange={(event) => setStarterCode(event.target.value)}
              spellCheck={false}
              rows={8}
              className="w-full resize-none rounded-md border border-zinc-300 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-50 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
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
            className="inline-flex h-9 items-center rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50"
          >
            Assign Question
          </button>
        </div>
      </div>
    </div>
  );
}
