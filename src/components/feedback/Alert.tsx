import type { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

export type AlertProps = {
  children: ReactNode;
  variant?: AlertVariant;
};

const variantClasses: Record<AlertVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-red-200 bg-red-50 text-red-950",
};


export default function Alert({ children, variant = "info" }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-md border px-4 py-3 text-sm ${variantClasses[variant]}`}
    >
      {children}
    </div>
  );
}

