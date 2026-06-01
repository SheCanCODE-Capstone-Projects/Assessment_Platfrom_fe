"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Candidate } from "../_data/types";

type Props = {
  open: boolean;
  mode: "invite" | "reminder";
  targets: Candidate[];
  onClose: () => void;
  onConfirm: (startTime: string, endTime: string) => Promise<void>;
};

function toApiDateTime(localValue: string): string {
  return localValue.replace("T", " ");
}

function nowPlusDays(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 16);
}

export default function ScheduleEmailModal({ open, mode, targets, onClose, onConfirm }: Props) {
  const [startTime, setStartTime] = useState(nowPlusDays(1));
  const [endTime, setEndTime]     = useState(nowPlusDays(2));
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState("");

  const minNow = new Date().toISOString().slice(0, 16);
  const isInvite = mode === "invite";

  async function handleSend() {
    if (isInvite && startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await onConfirm(toApiDateTime(startTime), toApiDateTime(endTime));
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isInvite ? "Send Assessment Invite" : "Send Reminder"}
      size="sm"
      footer={
        <>
          <Button variant="outline" tone="zinc" size="sm" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button tone="green" size="sm" onClick={handleSend} disabled={sending}>
            {sending ? "Sending…" : `Send to ${targets.length} Candidate${targets.length !== 1 ? "s" : ""}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-600">
          {isInvite
            ? `Invitation emails will be sent to ${targets.length} candidate${targets.length !== 1 ? "s" : ""}. Links are taken from exam assignments when available.`
            : `Reminder emails will be sent to ${targets.length} candidate${targets.length !== 1 ? "s" : ""}.`}
        </div>

        {isInvite && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-700">Assessment Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              min={minNow}
              onChange={(e) => { setStartTime(e.target.value); setError(""); }}
              className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-700">
            {isInvite ? "Assessment End Time" : "Deadline (End Time)"}
          </label>
          <input
            type="datetime-local"
            value={endTime}
            min={isInvite ? startTime : minNow}
            onChange={(e) => { setEndTime(e.target.value); setError(""); }}
            className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
