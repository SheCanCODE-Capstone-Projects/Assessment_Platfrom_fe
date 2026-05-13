"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export type DropdownAction = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

type Props = {
  label: string;
  actions: DropdownAction[];
};

export default function DropdownButton({ label, actions }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [close]);

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowDown") { e.preventDefault(); itemRefs.current[Math.min(i + 1, actions.length - 1)]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); itemRefs.current[Math.max(i - 1, 0)]?.focus(); }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
        {label}
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-30 w-52 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {actions.map((action, i) =>
            action.label === "divider" ? (
              <div key={i} className="my-1 h-px bg-zinc-100" />
            ) : (
            <button
              key={action.label}
              ref={(el) => { itemRefs.current[i] = el; }}
              role="menuitem"
              type="button"
              onKeyDown={(e) => onKey(e, i)}
              onClick={() => { if (!action.disabled) { action.onClick(); close(); } }}
              disabled={action.disabled}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm focus-visible:outline-none ${
                action.disabled
                  ? "text-zinc-300 cursor-not-allowed"
                  : "text-zinc-700 hover:bg-zinc-50 focus-visible:bg-zinc-50"
              }`}
            >
              <span className="text-emerald-600">{action.icon}</span>
              {action.label}
            </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
