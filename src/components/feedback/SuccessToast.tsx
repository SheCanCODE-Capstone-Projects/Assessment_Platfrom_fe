type SuccessToastProps = {
  message: string;
};

export default function SuccessToast({ message }: SuccessToastProps) {
  return (
    <div className="fixed right-4 top-6 z-50 max-w-[calc(100vw-2rem)] rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-lg sm:right-7">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            <path d="m6 12 4 4 8-8" />
          </svg>
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}
