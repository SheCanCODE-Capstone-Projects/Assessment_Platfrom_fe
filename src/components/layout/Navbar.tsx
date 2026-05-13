import Button from "@/components/ui/Button"
import Link from "next/link";
import type { ReactNode } from "react";


export type NavbarProps = {
  brand?: {
    name: string;
    href?: string;
  };
  right?: ReactNode;
};

export default function Navbar({
  brand = { name: "CodeAssess", href: "/" },
  right,
}: NavbarProps) {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex min-h-[8vh] max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href={brand.href ?? "/"} className="flex items-center gap-2">
      <div className="mx-auto flex min-h-[8vh] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={brand.href ?? "/"} className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-emerald-600 text-white text-xs font-semibold">
            {"</>"}
          </span>
          <span className="truncate text-sm font-semibold text-zinc-900">
            {brand.name}
          </span>
        </Link>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-3">
          {right ?? (
            <Button href="/admin" tone="orange" size="sm" className="w-full sm:w-auto">
              Admin Login
            </Button>
          )}
        </div>
      </div>
      <div className="h-px w-full bg-zinc-200/70" />
    </header>
  );
}
