"use client";

import Modal from "@/src/components/ui/Modal";
import Button from "@/src/components/ui/Button";
import type { Candidate } from "../_data/types";

type Props = {
  open: boolean;
  onClose: () => void;
  candidate: Candidate | null;
};

export default function CandidateDetailsModal({ open, onClose, candidate }: Props) {
  if (!candidate) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Candidate Details"
      size="md"
      footer={
        <>
          <Button variant="outline" tone="zinc" size="sm" onClick={onClose}>Close</Button>
        </>
      }
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm text-zinc-500">Name</div>
          <div className="text-base font-semibold text-zinc-900">{candidate.name}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Candidate ID</div>
            <div className="text-sm text-zinc-900">{candidate.id}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Status</div>
            <div className="text-sm text-zinc-900 capitalize">{candidate.status.replace("_", " ")}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Email</div>
            <div className="text-sm text-zinc-900">{candidate.email}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Phone</div>
            <div className="text-sm text-zinc-900">{candidate.phone}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Exam</div>
            <div className="text-sm text-zinc-900">{candidate.exam}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Nationality</div>
            <div className="text-sm text-zinc-900">{candidate.nationality}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Disability</div>
            <div className="text-sm text-zinc-900">{candidate.disability}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-sm text-zinc-500">Registered</div>
            <div className="text-sm text-zinc-900">{candidate.date}</div>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-sm text-zinc-500">Assessment Link</div>
          <div className="text-sm text-emerald-700 break-all">{candidate.assessmentLink}</div>
        </div>
      </div>
    </Modal>
  );
}
