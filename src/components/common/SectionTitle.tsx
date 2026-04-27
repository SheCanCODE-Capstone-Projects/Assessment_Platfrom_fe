import type { ReactNode } from "react";

export type SectionTitleProps = {
  title: ReactNode;
  subtitle?: ReactNode;
};

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm text-zinc-600">{subtitle}</p>
      ) : null}
    </div>
  );
}

