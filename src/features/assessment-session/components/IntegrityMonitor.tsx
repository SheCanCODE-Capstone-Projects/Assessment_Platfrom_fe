import { useIntegritySystem } from "@/hooks/useIntegritySystem";
import CameraMonitor from "./CameraMonitor";

type Props = {
  onAutoSubmit: () => void;
};

const BANNER_COLORS: Record<number, string> = {
  1: "bg-orange-50 border-orange-300 text-orange-800",
  2: "bg-orange-100 border-orange-400 text-orange-900",
  3: "bg-red-100 border-red-400 text-red-900",
};

export default function IntegrityMonitor({ onAutoSubmit }: Props) {
  const { violations, warningMessage, autoSubmitted, dismissWarning } =
    useIntegritySystem(onAutoSubmit);

  const colorClass = BANNER_COLORS[violations] ?? BANNER_COLORS[1];

  return (
    <>
      {/* Tab-switch violation banner */}
      {warningMessage && (
        <div
          role="alert"
          className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b px-4 py-3 text-sm font-medium sm:px-6 ${colorClass}`}
        >
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{warningMessage}</span>
            <span className="ml-2 rounded-full bg-white/60 px-2 py-0.5 text-xs font-semibold">
              {violations}/3 violations
            </span>
          </div>

          {!autoSubmitted && (
            <button
              type="button"
              onClick={dismissWarning}
              aria-label="Dismiss warning"
              className="shrink-0 rounded p-0.5 hover:bg-black/10 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Live camera card — always visible during exam */}
      <CameraMonitor />
    </>
  );
}
