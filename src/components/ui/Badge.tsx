import type { ReactNode } from "react";

type BadgeTone = "green" | "orange" | "zinc" | "red" | "blue";

const toneClasses: Record<BadgeTone, string> = {
  green:  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  orange: "bg-orange-50  text-orange-700  ring-orange-200",
  zinc:   "bg-zinc-100   text-zinc-600    ring-zinc-200",
  red:    "bg-red-50     text-red-700     ring-red-200",
  blue:   "bg-blue-50    text-blue-700    ring-blue-200",
};

export type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export default function Badge({ children, tone = "zinc", className }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
