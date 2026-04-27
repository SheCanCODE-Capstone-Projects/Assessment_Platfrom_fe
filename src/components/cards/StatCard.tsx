import type { ReactNode } from "react";

export type StatCardProps = {
  title: string;
  value: ReactNode;
  description?: ReactNode;
};

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-zinc-600">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-zinc-950">{value}</div>
      {description ? (
        <div className="mt-1 text-sm text-zinc-500">{description}</div>
      ) : null}
    </div>
  );
}

