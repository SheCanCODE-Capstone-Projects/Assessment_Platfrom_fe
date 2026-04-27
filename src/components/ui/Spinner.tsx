import type { HTMLAttributes } from "react";

export type SpinnerProps = {
  label?: string;
  sizeClassName?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function Spinner({
  label = "Loading",
  sizeClassName = "h-8 w-8",
  className,
  ...rest
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cx("inline-flex items-center justify-center", className)}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        className={cx("animate-spin text-emerald-600", sizeClassName)}
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4Z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}