import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";



type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonTone = "green" | "orange" | "zinc";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

function classes(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function variantClasses(variant: ButtonVariant, tone: ButtonTone) {
  const toneSolid: Record<ButtonTone, string> = {
    green:"bg-emerald-600 text-white hover:bg-emerald-700",
    orange: "bg-orange-500 text-white hover:bg-orange-600",
    zinc: "bg-zinc-900 text-white hover:bg-zinc-800",
  };

  const toneOutline: Record<ButtonTone, string> = {
    green: "border-emerald-600 text-emerald-700 hover:bg-emerald-50",
    orange: "border-orange-500 text-orange-600 hover:bg-orange-50",
    zinc: "border-zinc-300 text-zinc-800 hover:bg-zinc-50",
  };

  const toneGhost: Record<ButtonTone, string> = {
    green: "text-emerald-700 hover:bg-emerald-50",
    orange: "text-orange-600 hover:bg-orange-50",
    zinc: "text-zinc-800 hover:bg-zinc-50",
  };

  if (variant === "solid") return toneSolid[tone];
  if (variant === "outline")
    return classes("border bg-transparent", toneOutline[tone]);
  return toneGhost[tone];
}

function sizeClasses(size: ButtonSize) {
  if (size === "sm") return "h-9 px-3 text-sm";
  if (size === "lg") return "h-12 px-6 text-base";
  return "h-10 px-4 text-sm";
}

export default function Button({
  children,
  className,
  href,
  onClick,
  variant = "solid",
  tone = "zinc",
  size = "md",
  type,
  ...rest
}: ButtonProps) {
  const shared = classes(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50",
    sizeClasses(size),
    variantClasses(variant, tone),
    className
  );

  if (href) {
    return (
      <Link href={href} className={shared}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type ?? "button"}
      className={shared}
      {...rest}
    >
      {children}
    </button>
  );
}

