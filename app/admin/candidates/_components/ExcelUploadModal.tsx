"use client";

import { useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { CandidateFormData } from "./AddCandidateModal";

export type ParsedRow = Partial<CandidateFormData>;

type Props = {
  open: boolean;
  onClose: () => void;
  onPreview: (rows: ParsedRow[]) => void;
};

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
    return {
      name:       row["name"]        || row["full_name"]      || "",
      email:      row["email"]       || row["email_address"]  || "",
      phone:      row["phone"]       || row["phone_number"]   || "",
      program:    row["program"]     || row["exam"]           || "Advanced Web Development",
      gender:     row["gender"]      || "",
      dob:        row["dob"]         || row["date_of_birth"]  || "",
      education:  row["education"]   || row["education_level"]|| "",
      experience: row["experience"]  || "",
      notes:      row["notes"]       || "",
    };
  }).filter((r) => r.name || r.email);
}

function FileUpload({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    onFile(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${
        dragging ? "border-emerald-400 bg-emerald-50" : "border-zinc-200 bg-zinc-50 hover:border-emerald-300 hover:bg-emerald-50/50"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-700">Drop your file here or click to browse</p>
        <p className="text-xs text-zinc-400 mt-1">Supports all Excel formats and .csv files</p>
      </div>
      <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls,.xlsm,.xlsb,.ods" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

function DataPreviewTable({ rows }: { rows: ParsedRow[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 overflow-hidden">
      <div className="overflow-x-auto max-h-56">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100 text-left text-xs font-medium text-zinc-500">
              {["#", "Name", "Email", "Phone", "Program"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-zinc-50/60">
                <td className="px-3 py-2 text-zinc-400 text-xs">{i + 1}</td>
                <td className="px-3 py-2 text-zinc-900">{r.name || "—"}</td>
                <td className="px-3 py-2 text-zinc-600">{r.email || "—"}</td>
                <td className="px-3 py-2 text-zinc-600">{r.phone || "—"}</td>
                <td className="px-3 py-2 text-zinc-600">{r.exam || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ExcelUploadModal({ open, onClose, onPreview }: Props) {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setError("No valid rows found. Make sure your file has name and email columns.");
      } else {
        setRows(parsed);
      }
    };
    reader.readAsText(file);
  }

  function handleProceed() {
    onPreview(rows);
    setRows([]);
    setFileName("");
    onClose();
  }

  function handleClose() {
    setRows([]);
    setFileName("");
    setError("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload File"
      size="lg"
      footer={
        rows.length > 0 ? (
          <>
            <Button variant="outline" tone="zinc" size="sm" onClick={() => { setRows([]); setFileName(""); }}>
              Clear
            </Button>
            <Button tone="green" size="sm" onClick={handleProceed}>
              Review {rows.length} Candidate{rows.length !== 1 ? "s" : ""}
            </Button>
          </>
        ) : (
          <Button variant="outline" tone="zinc" size="sm" onClick={handleClose}>Cancel</Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        {rows.length === 0 ? (
          <>
            <FileUpload onFile={handleFile} />
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <div className="rounded-md border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
              <p className="font-medium text-zinc-700 mb-1">Expected columns:</p>
              <p>name, email, phone, program, gender, dob, education, experience, notes</p>
              <p className="mt-1 text-zinc-400">Accepts: .csv, .xlsx, .xls, .xlsm, .xlsb, .ods</p>
              <p className="mt-1">First row must be the header row.</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-zinc-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="font-medium">{fileName}</span>
              <span className="text-zinc-400">— {rows.length} rows found</span>
            </div>
            <DataPreviewTable rows={rows} />
            <p className="text-xs text-zinc-500">
              Click <strong className="text-zinc-700">Review {rows.length} Candidates</strong> to open each one in the form for review before adding.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
