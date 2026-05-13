import { useEffect } from "react";

/**
 * Confirms manual assessment submission before the candidate loses edit access.
 */
export default function SubmitConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  isSubmitting = false,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 py-6"
      role="dialog"
    >
      <div className="w-full max-w-[448px] rounded-lg bg-white px-6 py-7 shadow-2xl">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        <h2 className="mt-5 text-center text-xl font-bold text-slate-950">
          Submit Assessment?
        </h2>
        <p className="mx-auto mt-3 max-w-[330px] text-center text-sm leading-6 text-slate-600">
          Are you sure you want to submit your assessment? You won&apos;t be able
          to make changes after submission.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex h-11 min-w-28 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:pointer-events-none disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex h-11 min-w-32 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
