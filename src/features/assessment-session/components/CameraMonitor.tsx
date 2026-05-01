import { useCameraMonitor } from "@/src/hooks/useCameraMonitor";

export default function CameraMonitor() {
  const { status, attachVideo } = useCameraMonitor();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl w-[168px] sm:w-[200px]">
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-800">
        <div className="flex items-center gap-1.5">
          {status === "active" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
          <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            {status === "active" ? "Recording" : status === "starting" ? "Starting…" : "Camera Off"}
          </span>
        </div>
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m23 7-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      </div>

      {/* Video feed */}
      <div className="relative bg-zinc-950 aspect-video">
        {status === "active" && (
          <video
            ref={attachVideo}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover scale-x-[-1]"
            aria-label="Live camera feed"
          />
        )}

        {status === "starting" && (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin text-zinc-500"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}

        {(status === "denied" || status === "unavailable") && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34" />
              <path d="m23 7-7 5 7 5V7z" />
            </svg>
            <p className="text-[10px] text-red-400 leading-tight">
              {status === "denied" ? "Camera access denied" : "Camera unavailable"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-2.5 py-1.5 bg-zinc-800">
        <p className="text-[10px] text-zinc-500 text-center leading-tight">
          Monitored for exam integrity
        </p>
      </div>
    </div>
  );
}
