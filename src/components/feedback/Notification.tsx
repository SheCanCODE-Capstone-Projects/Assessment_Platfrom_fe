import type { ReactElement } from "react";
import Alert from "./Alert";
import type { AlertVariant } from "./Alert";

type NotificationProps = {
  message: string;
  variant?: AlertVariant;
  position?: "top" | "bottom";
};

const icons: Record<AlertVariant, ReactElement> = {
  info: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
      <path d="M10 3h4l6 10-6 10h-4l-6-10 6-10z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-700" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </svg>
  ),
};

export default function Notification({
  message,
  variant = "info",
  position = "bottom",
}: NotificationProps) {
  return (
    <div
      className={`fixed left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4 ${
        position === "top" ? "top-6" : "bottom-6"
      }`}
    >
      <Alert variant={variant}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5">{icons[variant]}</span>
          <span>{message}</span>
        </div>
      </Alert>
    </div>
  );
}
