"use client";

import { useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { bulkUploadCandidates, type BulkUploadResult } from "../_api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (result: BulkUploadResult) => void;
};

function FileUpload({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
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
        <p className="text-xs text-zinc-400 mt-1">Supports Excel (.xlsx, .xls) and .csv files</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.xlsm,.xlsb,.ods"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}

export default function ExcelUploadModal({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [error, setError] = useState("");

  function handleFile(f: File) {
    setFile(f);
    setResult(null);
    setError("");
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await bulkUploadCandidates(file);
      setResult(res);
      onSuccess(res);
    } catch (err) {
      setError((err as Error).message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleClose() {
    setFile(null);
    setResult(null);
    setError("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload Candidates"
      size="lg"
      footer={
        result ? (
          <Button tone="green" size="sm" onClick={handleClose}>Done</Button>
        ) : file && !uploading ? (
          <>
            <Button variant="outline" tone="zinc" size="sm" onClick={() => setFile(null)}>
              Clear
            </Button>
            <Button tone="green" size="sm" onClick={handleUpload}>
              Upload to Server
            </Button>
          </>
        ) : (
          <Button variant="outline" tone="zinc" size="sm" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        {result ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700">{result.created}</div>
                <div className="text-xs text-emerald-600 mt-1">Candidates Created</div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center">
                <div className="text-2xl font-bold text-zinc-600">{result.skipped}</div>
                <div className="text-xs text-zinc-500 mt-1">Skipped (duplicates)</div>
              </div>
            </div>
            {result.errors.length > 0 && (() => {
              const isDuplicateMsg = result.errors.some((e) => {
                const lc = e.toLowerCase();
                return lc.includes("already") || lc.includes("exist") || lc.includes("duplicate");
              });
              return (
                <div className={`rounded-lg border p-3 ${isDuplicateMsg ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                  <p className={`text-xs font-semibold mb-2 ${isDuplicateMsg ? "text-amber-700" : "text-red-700"}`}>
                    {isDuplicateMsg
                      ? "These candidates already exist in the system:"
                      : `${result.errors.length} row${result.errors.length !== 1 ? "s" : ""} had errors:`}
                  </p>
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.map((e, i) => (
                      <li key={i} className={`text-xs ${isDuplicateMsg ? "text-amber-700" : "text-red-600"}`}>• {e}</li>
                    ))}
                  </ul>
                  {isDuplicateMsg && (
                    <p className="mt-2 text-xs text-amber-600">
                      Deleting candidates from the list marks them inactive on the server but does not free their email for re-upload. Use a different email address or contact your backend administrator to permanently remove records.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-emerald-600" />
            <p className="text-sm text-zinc-600">Uploading {file?.name}…</p>
          </div>
        ) : file ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{file.name}</p>
                <p className="text-xs text-zinc-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <p className="text-xs text-zinc-500">
              Click <strong className="text-zinc-700">Upload to Server</strong> to import candidates. Duplicate emails will be skipped.
            </p>
          </div>
        ) : (
          <>
            <FileUpload onFile={handleFile} />
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <div className="rounded-md border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
              <p className="font-medium text-zinc-700 mb-1">Expected columns:</p>
              <p>name, email, phoneNumber, language</p>
              <p className="mt-1 text-zinc-400">Accepts: .csv, .xlsx, .xls — first row must be the header.</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
