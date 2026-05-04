"use client";

import { useState } from "react";

type TimeUnit = "SECONDS" | "MINUTES" | "HOURS";

export type CreateExamPayload = {
  examTitle: string;
  description: string;
  timeValue: number;
  timeUnit: TimeUnit;
  passMark: number;
  status: "ACTIVE" | "INACTIVE";
};

type CreateExamModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: CreateExamPayload) => void;
  initialExam?: CreateExamPayload;
  mode?: "create" | "edit";
};

export default function CreateExamModal({
  open,
  onClose,
  onCreate,
  initialExam,
  mode = "create",
}: CreateExamModalProps) {
  if (!open) return null;

  return (
    <CreateExamModalContent
      onClose={onClose}
      onCreate={onCreate}
      initialExam={initialExam}
      mode={mode}
    />
  );
}

function CreateExamModalContent({
  onClose,
  onCreate,
  initialExam,
  mode,
}: Omit<CreateExamModalProps, "open"> & { mode: "create" | "edit" }) {
  const [title, setTitle] = useState(initialExam?.examTitle ?? "");
  const [description, setDescription] = useState(initialExam?.description ?? "");
  const [timeLimit, setTimeLimit] = useState(initialExam?.timeValue ?? 60);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(initialExam?.timeUnit ?? "MINUTES");
  const [passMark, setPassMark] = useState(initialExam?.passMark ?? 70);
  const isEditMode = mode === "edit";

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTimeLimit(60);
    setTimeUnit("MINUTES");
    setPassMark(70);
  };

  const handleSubmit = () => {
    onCreate?.({
      examTitle: title.trim() || "Untitled Exam",
      description: description.trim() || "No description provided",
      timeValue: timeLimit,
      timeUnit,
      passMark,
      status: initialExam?.status ?? "ACTIVE",
    });
    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-semibold text-zinc-900">
            {isEditMode ? "Edit Exam" : "Create New Exam"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">
              Exam Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. JavaScript Developer Assessment"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the purpose of this assessment"
              rows={3}
              className="w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                Time Value
              </label>
              <input
                type="number"
                value={timeLimit}
                min={1}
                onChange={(event) => setTimeLimit(Number(event.target.value))}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                Time Unit
              </label>
              <select
                value={timeUnit}
                onChange={(event) => setTimeUnit(event.target.value as TimeUnit)}
                className="h-[38px] w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              >
                <option value="SECONDS">Seconds</option>
                <option value="MINUTES">Minutes</option>
                <option value="HOURS">Hours</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                Pass Mark (%)
              </label>
              <input
                type="number"
                value={passMark}
                min={0}
                max={100}
                onChange={(event) => setPassMark(Number(event.target.value))}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
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
            {isEditMode ? "Save Changes" : "Create Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}
