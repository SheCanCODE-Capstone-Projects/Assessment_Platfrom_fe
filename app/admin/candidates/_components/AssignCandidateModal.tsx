"use client";

import { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Button from "@/src/components/ui/Button";
import type { Candidate } from "../_data/types";

const EXAMS = ["Frontend", "Backend", "Fundamentals"];

type Props = {
  open: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onRequestAssign: (candidateIds: string[], exam: string) => void;
  editing?: Candidate | null;
};

export default function AssignCandidateModal({ open, onClose, candidates, onRequestAssign, editing }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [exam, setExam] = useState(() => editing?.exam ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    new Set(editing ? [editing.id] : [])
  );
  const [examError, setExamError] = useState("");
  const [candidateError, setCandidateError] = useState("");
  function toggleCandidate(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setCandidateError("");
  }

  function handleNext() {
    if (!exam) { setExamError("Please select an exam"); return; }
    setStep(2);
  }

  function handleAssign() {
    if (selectedIds.size === 0) { setCandidateError("Please select at least one candidate"); return; }
    onRequestAssign(Array.from(selectedIds), exam);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Exam" : "Assign Exam"}
      size="sm"
      footer={
        step === 1 ? (
          <>
            <Button variant="outline" tone="zinc" size="sm" onClick={onClose}>Cancel</Button>
            <Button tone="green" size="sm" onClick={handleNext}>Next →</Button>
          </>
        ) : (
          <>
            <Button variant="outline" tone="zinc" size="sm" onClick={() => setStep(1)}>← Back</Button>
            <Button tone="green" size="sm" onClick={handleAssign}>
              {editing ? "Update Exam" : `Assign to ${selectedIds.size > 0 ? selectedIds.size : ""} Candidate${selectedIds.size !== 1 ? "s" : ""}`}
            </Button>
          </>
        )
      }
    >
      {step === 1 ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-zinc-500">Select the exam you want to assign:</p>
          <div className="flex flex-col gap-2">
            {EXAMS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => { setExam(ex); setExamError(""); }}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  exam === ex
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:bg-zinc-50"
                }`}
              >
                {ex}
                {exam === ex && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {examError && <p className="text-xs text-red-500">{examError}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Assigning exam:</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{exam}</span>
          </div>
          <p className="text-xs text-zinc-500">{editing ? "Candidate to update:" : "Select candidates to assign:"}</p>
          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
            {(editing ? [editing] : candidates).map((c) => (
              editing ? (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                    selectedIds.has(c.id)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    selectedIds.has(c.id) ? "border-emerald-500 bg-emerald-500" : "border-zinc-300"
                  }`}>
                    {selectedIds.has(c.id) && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900">{c.name}</div>
                    <div className="text-xs text-zinc-400">{c.email}</div>
                    <div className="text-xs text-zinc-500">Current exam: {c.exam || "None"}</div>
                  </div>
                </div>
              ) : (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCandidate(c.id)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    selectedIds.has(c.id)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-zinc-200 bg-white hover:border-emerald-300 hover:bg-zinc-50"
                  }`}
                >
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    selectedIds.has(c.id) ? "border-emerald-500 bg-emerald-500" : "border-zinc-300"
                  }`}>
                    {selectedIds.has(c.id) && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900">{c.name}</div>
                    <div className="text-xs text-zinc-400">{c.email}</div>
                    <div className="text-xs text-zinc-500">Current exam: {c.exam || "None"}</div>
                  </div>
                </button>
              )
            ))}
          </div>
          {candidateError && <p className="text-xs text-red-500">{candidateError}</p>}
        </div>
      )}
    </Modal>
  );
}
