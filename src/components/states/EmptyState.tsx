import type { ReactNode } from "react";

export type EmptyStateProps = {
  message?: ReactNode;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center p-6 text-gray-500">
      {message ?? "No data available"}
    </div>
  );
}

