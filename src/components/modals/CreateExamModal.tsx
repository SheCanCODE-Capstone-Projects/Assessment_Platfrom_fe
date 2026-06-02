"use client";

import { useState } from "react";
import {
  QUESTION_BANK,
  difficultyLabels,
  difficultyStyles,
  type QuestionBankItem,
} from "@/components/modals/AssignQuestionModal";
import { greenSelectClassName, greenSelectOptionClassName } from "@/components/ui/selectStyles";

type TimeUnit = "SECONDS" | "MINUTES" | "HOURS";

export type CreateExamPayload = {
  examTitle: string;
  description: string;
  timeValue: number;
  timeUnit: TimeUnit;
  passMark: number;
  status: "ACTIVE" | "INACTIVE";
  selectedQuestionIds?: string[];
};

type CreateExamModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: CreateExamPayload) => void;
  questions?: QuestionBankItem[];
  initialExam?: CreateExamPayload;
  initialSelectedQuestionIds?: string[];
  mode?: "create" | "edit";
};

export default function CreateExamModal({
  open,
  onClose,
  onCreate,
  questions = QUESTION_BANK,
  initialExam,
  initialSelectedQuestionIds,
  mode = "create",
}: CreateExamModalProps) {
  if (!open) return null;

  return (
    <CreateExamModalContent
      onClose={onClose}
      onCreate={onCreate}
      questions={questions}
      initialExam={initialExam}
      initialSelectedQuestionIds={initialSelectedQuestionIds}
      mode={mode}
    />
  );
}

function CreateExamModalContent({
  onClose,
  onCreate,
  questions,
  initialExam,
  initialSelectedQuestionIds = [],
  mode,
}: Omit<CreateExamModalProps, "open"> & {
  mode: "create" | "edit";
  questions: QuestionBankItem[];
}) {
  const [title, setTitle] = useState(initialExam?.examTitle ?? "");
  const [description, setDescription] = useState(initialExam?.description ?? "");
  const [timeLimit, setTimeLimit] = useState(initialExam?.timeValue ?? 60);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(initialExam?.timeUnit ?? "MINUTES");
  const [passMark, setPassMark] = useState(initialExam?.passMark ?? 70);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(initialSelectedQuestionIds);
  const isEditMode = mode === "edit";
  const usesExamBuilderLayout = mode === "create" || isEditMode;
  const selectedQuestionCount = selectedQuestionIds.length;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTimeLimit(60);
    setTimeUnit("MINUTES");
    setPassMark(70);
    setSelectedQuestionIds([]);
  };

  const handleSubmit = () => {
    onCreate?.({
      examTitle: title.trim() || "Untitled Exam",
      description: description.trim() || "No description provided",
      timeValue: timeLimit,
      timeUnit: usesExamBuilderLayout ? "MINUTES" : timeUnit,
      passMark,
      status: initialExam?.status ?? "ACTIVE",
      selectedQuestionIds: usesExamBuilderLayout ? selectedQuestionIds : undefined,
    });
    resetForm();
    onClose();
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full rounded-xl border border-zinc-200 bg-white shadow-xl ${usesExamBuilderLayout ? "max-w-5xl" : "max-w-lg"}`}>
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className={`${usesExamBuilderLayout ? "text-2xl" : "text-base"} font-semibold text-zinc-900`}>
            {isEditMode ? "Edit Exam" : "Create New Exam"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-green-100 hover:text-zinc-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`${usesExamBuilderLayout ? "max-h-[72vh] space-y-7" : "max-h-[70vh] space-y-4"} overflow-y-auto px-4 py-5 sm:px-6`}>
          <div>
            <label className={`${usesExamBuilderLayout ? "mb-2 text-sm" : "mb-1.5 text-xs"} block font-medium text-zinc-700`}>
              Exam Title{usesExamBuilderLayout && " *"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. JavaScript Developer Assessment"
              className={`${usesExamBuilderLayout ? "h-12 px-4 text-base" : "px-3 py-2 text-sm"} w-full rounded-md border border-zinc-300 bg-white text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20`}
            />
          </div>

          <div>
            <label className={`${usesExamBuilderLayout ? "mb-2 text-sm" : "mb-1.5 text-xs"} block font-medium text-zinc-700`}>
              Description{usesExamBuilderLayout && " *"}
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the purpose of this assessment"
              rows={usesExamBuilderLayout ? 5 : 3}
              className={`${usesExamBuilderLayout ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"} w-full resize-none rounded-md border border-zinc-300 bg-white text-zinc-900 outline-none transition placeholder-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20`}
            />
          </div>

          <div className={`grid grid-cols-1 gap-6 ${usesExamBuilderLayout ? "sm:grid-cols-2" : "sm:grid-cols-3 sm:gap-3"}`}>
            <div>
              <label className={`${usesExamBuilderLayout ? "mb-2 text-sm" : "mb-1.5 text-xs"} block font-medium text-zinc-700`}>
                {usesExamBuilderLayout ? "Time Limit (minutes) *" : "Time Value"}
              </label>
              <input
                type="number"
                value={timeLimit}
                min={1}
                onChange={(event) => setTimeLimit(Number(event.target.value))}
                className={`${usesExamBuilderLayout ? "h-12 px-4 text-base" : "px-3 py-2 text-sm"} w-full rounded-md border border-zinc-300 bg-white text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20`}
              />
            </div>
            {!usesExamBuilderLayout && (
              <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                Time Unit
              </label>
              <select
                value={timeUnit}
                onChange={(event) => setTimeUnit(event.target.value as TimeUnit)}
                className={`h-9.5 w-full px-3 ${greenSelectClassName}`}
              >
                <option className={greenSelectOptionClassName} value="SECONDS">Seconds</option>
                <option className={greenSelectOptionClassName} value="MINUTES">Minutes</option>
                <option className={greenSelectOptionClassName} value="HOURS">Hours</option>
              </select>
            </div>
            )}
            <div>
              <label className={`${usesExamBuilderLayout ? "mb-2 text-sm" : "mb-1.5 text-xs"} block font-medium text-zinc-700`}>
                Pass Mark (%){usesExamBuilderLayout && " *"}
              </label>
              <input
                type="number"
                value={passMark}
                min={0}
                max={100}
                onChange={(event) => setPassMark(Number(event.target.value))}
                className={`${usesExamBuilderLayout ? "h-12 px-4 text-base" : "px-3 py-2 text-sm"} w-full rounded-md border border-zinc-300 bg-white text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20`}
              />
            </div>
          </div>

          {usesExamBuilderLayout && (
            <QuestionSelectionList
              questions={questions}
              selectedQuestionIds={selectedQuestionIds}
              selectedQuestionCount={selectedQuestionCount}
              onToggleQuestion={toggleQuestion}
            />
          )}
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
            className="inline-flex h-9 w-full items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 sm:w-auto"
          >
            {isEditMode ? "Update Exam" : "Create Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionSelectionList({
  questions,
  selectedQuestionIds,
  selectedQuestionCount,
  onToggleQuestion,
}: {
  questions: QuestionBankItem[];
  selectedQuestionIds: string[];
  selectedQuestionCount: number;
  onToggleQuestion: (questionId: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 text-sm font-medium text-zinc-700">
        Select Questions * ({selectedQuestionCount} selected)
      </div>
      <div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4">
        <div className="space-y-3">
          {questions.map((question) => {
            const checked = selectedQuestionIds.includes(question.id);

            return (
              <label
                key={question.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg bg-zinc-50 px-4 py-4 transition-colors hover:bg-zinc-100"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleQuestion(question.id)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-zinc-900">{question.title}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${difficultyStyles[question.difficulty]}`}>
                      {difficultyLabels[question.difficulty]}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-zinc-600">{question.marks} marks</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
