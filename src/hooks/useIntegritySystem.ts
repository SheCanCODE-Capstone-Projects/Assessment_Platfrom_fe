import { useEffect, useRef, useState, useCallback } from "react";

export type ViolationLevel = 0 | 1 | 2 | 3;

export type IntegrityState = {
  violations: ViolationLevel;
  warningMessage: string | null;
  autoSubmitted: boolean;
};

const MESSAGES: Record<1 | 2 | 3, string> = {
  1: "Warning 1: Please stay on the exam page.",
  2: "Warning 2: Second violation detected.",
  3: "Warning 3: Exam submitted due to repeated violations.",
};

export function useIntegritySystem(onAutoSubmit: () => void) {
  const [state, setState] = useState<IntegrityState>({
    violations: 0,
    warningMessage: null,
    autoSubmitted: false,
  });

  const autoSubmitted = useRef(false);

  const recordViolation = useCallback(() => {
    if (autoSubmitted.current) return;

    setState((prev) => {
      const next = Math.min(prev.violations + 1, 3) as ViolationLevel;
      const message = MESSAGES[next as 1 | 2 | 3];

      if (next === 3 && !autoSubmitted.current) {
        autoSubmitted.current = true;
        setTimeout(onAutoSubmit, 1500);
      }

      return {
        violations: next,
        warningMessage: message,
        autoSubmitted: next === 3,
      };
    });
  }, [onAutoSubmit]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        recordViolation();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [recordViolation]);

  function dismissWarning() {
    setState((prev) => ({ ...prev, warningMessage: null }));
  }

  return { ...state, dismissWarning };
}
