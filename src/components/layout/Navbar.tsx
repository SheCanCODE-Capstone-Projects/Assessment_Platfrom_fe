import Link from "next/link";
import type { ReactNode } from "react";

import Button from "@/src/components/ui/Button";

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
      <div className="mx-auto flex min-h-[8vh] max-w-6xl items-center justify-between px-6">
        <Link href={brand.href ?? "/"} className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-emerald-600 text-white text-xs font-semibold">
            {"</>"}
          </span>
          <span className="text-sm font-semibold text-zinc-900">
            {brand.name}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {right ?? (
            <Button href="/admin" tone="orange" size="sm">
              Admin Login
            </Button>
          )}
        </div>
      </div>
      <div className="h-px w-full bg-zinc-200/70" />
    </header>
  );
}

