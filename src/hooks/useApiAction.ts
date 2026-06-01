"use client";

import { useCallback, useState } from "react";

/**
 * Reusable hook for async API actions with loading / error state.
 */
export function useApiAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (err) {
        const message = (err as Error).message || "Request failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  const clearError = useCallback(() => setError(null), []);

  return { run, loading, error, clearError };
}
