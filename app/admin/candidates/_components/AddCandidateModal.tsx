"use client";

import { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import type { Candidate } from "../_data/types";

const EXAMS = ["Frontend", "Backend", "Fundamentals"];

const NATIONALITIES = [
  "Rwandan", "Ugandan", "Kenyan", "Tanzanian", "Burundian",
  "Congolese", "Ethiopian", "Nigerian", "Ghanaian", "Other",
];

const DISABILITY_OPTIONS = [
  "None",
  "Visual Impairment",
  "Hearing Impairment",
  "Physical / Mobility",
  "Cognitive / Learning",
  "Speech / Language",
  "Prefer not to say",
  "Other",
];

export type CandidateFormData = {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  disability: string;
  exam: string;
};

type Errors = Partial<Record<keyof CandidateFormData, string>>;

type Props = {
  open: boolean;
  onClose: () => void;
  prefill?: Partial<CandidateFormData>;
  onSave: (data: Pick<Candidate, "name" | "email" | "phone" | "nationality" | "disability" | "exam">) => void;
  editing?: Candidate | null;
};

const empty: CandidateFormData = {
  name: "", email: "", phone: "",
  nationality: NATIONALITIES[0], disability: DISABILITY_OPTIONS[0], exam: EXAMS[0],
};

function SelectField({ label, value, options, onChange, error }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 w-full rounded-md border bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 ${error ? "border-red-400" : "border-zinc-200"}`}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function AddCandidateModal({ open, onClose, prefill, onSave, editing }: Props) {
  const initialForm: CandidateFormData = editing
    ? {
        name: editing.name,
        email: editing.email,
        phone: editing.phone,
        nationality: editing.nationality || NATIONALITIES[0],
        disability: editing.disability || DISABILITY_OPTIONS[0],
        exam: editing.exam,
      }
    : { ...empty, ...prefill };

  const [form, setForm] = useState<CandidateFormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});

  function set(field: keyof CandidateFormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      name: form.name,
      email: form.email,
      phone: form.phone,
      nationality: form.nationality,
      disability: form.disability,
      exam: form.exam,
    });
    onClose();
  }

  const isPrefilled = !!prefill && Object.keys(prefill).length > 0;
  const isEditing = !!editing;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Candidate" : isPrefilled ? "Review & Confirm Candidate" : "Add Candidate"}
      size="md"
      footer={
        <>
          <Button variant="outline" tone="zinc" size="sm" onClick={onClose}>Cancel</Button>
          <Button tone="green" size="sm" onClick={handleSave}>
            {isEditing ? "Update Candidate" : isPrefilled ? "Confirm & Add" : "Add Candidate"}
          </Button>
        </>
      }
    >
      {isPrefilled && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          Data imported from Excel — please review and fill in any missing fields.
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Ahmed Al-Rashid"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. ahmed@example.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
        />
        <Input
          label="Phone Number"
          placeholder="e.g. +250 78 123 4567"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          error={errors.phone}
        />
        <SelectField
          label="Nationality"
          value={form.nationality}
          options={NATIONALITIES}
          onChange={(v) => set("nationality", v)}
        />
        <SelectField
          label="Disability Information"
          value={form.disability}
          options={DISABILITY_OPTIONS}
          onChange={(v) => set("disability", v)}
        />
        <SelectField
          label="Exam"
          value={form.exam}
          options={EXAMS}
          onChange={(v) => set("exam", v)}
        />
      </div>
    </Modal>
  );
}
