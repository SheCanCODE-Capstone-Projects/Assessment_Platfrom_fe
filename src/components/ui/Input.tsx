import type { InputHTMLAttributes } from "react";

export type InputProps = {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, error, leftIcon, className, id, ...rest }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-zinc-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            leftIcon ? "pl-9" : "",
            error ? "border-red-400 focus:ring-red-400/40" : "",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
