"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeMap = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

export default function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full rounded-xl border border-zinc-200 bg-white shadow-xl ${sizeMap[size]}`}>
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
            <button
              onClick={onClose}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-zinc-100 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
