import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Navbar from "@/src/components/layout/Navbar";
import Button from "@/src/components/ui/Button";

const TOTAL_SECONDS = 60 * 60;
const MAX_TAB_VIOLATIONS = 3;
const ASSESSMENT_STARTED_AT_KEY = "assessmentStartedAt";

type Difficulty = "Easy" | "Medium";
type Language = "JavaScript" | "Python" | "Java" | "C++" | "TypeScript" | "C#" | "PHP";
type SubmitReason = "manual" | "timer" | "integrity";
type CameraStatus = "opening" | "active" | "blocked";

type TestCase = {
  label: string;
  input: string;
  expected: string;
};

type Question = {
  title: string;
  difficulty: Difficulty;
  marks: number;
  description: string[];
  example: {
    input: string;
    output: string;
    explanation?: string;
  };
  testCases: TestCase[];
  functionName: string;
  signatures: Record<Language, string>;
};

type CandidateSession = {
  preferredLanguage?: string;
};

type AssessmentCameraWindow = Window & {
  __assessmentCameraStream?: MediaStream;
};

const languageOptions: Language[] = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "TypeScript",
  "C#",
  "PHP",
];

const questions: Question[] = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    marks: 20,
    description: [
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    ],
    example: {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    testCases: [
      {
        label: "Test Case 1",
        input: "[2, 7, 11, 15], 9",
        expected: "[0,1]",
      },
    ],
    functionName: "twoSum",
    signatures: {
      JavaScript: "function twoSum(nums, target)",
      Python: "def two_sum(nums, target)",
      Java: "public int[] twoSum(int[] nums, int target)",
      "C++": "vector<int> twoSum(vector<int>& nums, int target)",
      TypeScript: "function twoSum(nums: number[], target: number): number[]",
      "C#": "public int[] TwoSum(int[] nums, int target)",
      PHP: "function twoSum($nums, $target)",
    },
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    marks: 15,
    description: [
      "Write a function that reverses a string. The input string is given as an array of characters.",
      "You must do this by modifying the input array in-place with O(1) extra memory.",
    ],
    example: {
      input: "s = ['h','e','l','l','o']",
      output: "['o','l','l','e','h']",
    },
    testCases: [
      {
        label: "Test Case 1",
        input: "['h', 'e', 'l', 'l', 'o']",
        expected: "['o', 'l', 'l', 'e', 'h']",
      },
    ],
    functionName: "reverseString",
    signatures: {
      JavaScript: "function reverseString(s)",
      Python: "def reverse_string(s)",
      Java: "public void reverseString(char[] s)",
      "C++": "void reverseString(vector<char>& s)",
      TypeScript: "function reverseString(s: string[]): void",
      "C#": "public void ReverseString(char[] s)",
      PHP: "function reverseString($s)",
    },
  },
  {
    title: "Valid Parentheses",
    difficulty: "Medium",
    marks: 25,
    description: [
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      "An input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
    ],
    example: {
      input: "s = '()[]{}'",
      output: "true",
    },
    testCases: [
      {
        label: "Test Case 1",
        input: "'()[]{}'",
        expected: "true",
      },
    ],
    functionName: "isValid",
    signatures: {
      JavaScript: "function isValid(s)",
      Python: "def is_valid(s)",
      Java: "public boolean isValid(String s)",
      "C++": "bool isValid(string s)",
      TypeScript: "function isValid(s: string): boolean",
      "C#": "public bool IsValid(string s)",
      PHP: "function isValid($s)",
    },
  },
];

const starterTemplates: Record<Language, (question: Question) => string> = {
  JavaScript: (question) =>
    `${question.signatures.JavaScript} {\n  // Write your code here\n}`,
  TypeScript: (question) =>
    `${question.signatures.TypeScript} {\n  // Write your code here\n}`,
  Python: (question) =>
    `${question.signatures.Python}:\n    # Write your code here\n    pass`,
  Java: (question) =>
    `class Solution {\n    ${question.signatures.Java} {\n        // Write your code here\n    }\n}`,
  "C++": (question) =>
    `class Solution {\npublic:\n    ${question.signatures["C++"]} {\n        // Write your code here\n    }\n};`,
  "C#": (question) =>
    `public class Solution {\n    ${question.signatures["C#"]} {\n        // Write your code here\n    }\n}`,
  PHP: (question) =>
    `<?php\n${question.signatures.PHP} {\n    // Write your code here\n}\n?>`,
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function isLanguage(value: string): value is Language {
  return languageOptions.includes(value as Language);
}

function getCandidateLanguage(): Language {
  if (typeof window === "undefined") return "JavaScript";
  const rawSession = window.sessionStorage.getItem("candidateRegistration");
  if (!rawSession) return "JavaScript";

  try {
    const parsedSession = JSON.parse(rawSession) as CandidateSession;
    const language = parsedSession.preferredLanguage;
    return language && isLanguage(language) ? language : "JavaScript";
  } catch {
    return "JavaScript";
  }
}

function useTimer({
  initialSeconds,
  onComplete,
  paused,
}: {
  initialSeconds: number;
  onComplete: () => void;
  paused: boolean;
}) {
  const [startedAt] = useState(() => {
    if (typeof window === "undefined") return Date.now();

    const savedStartedAt = Number(window.sessionStorage.getItem(ASSESSMENT_STARTED_AT_KEY));
    if (Number.isFinite(savedStartedAt) && savedStartedAt > 0) {
      return savedStartedAt;
    }

    const nextStartedAt = Date.now();
    window.sessionStorage.setItem(ASSESSMENT_STARTED_AT_KEY, String(nextStartedAt));
    return nextStartedAt;
  });
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    return Math.max(initialSeconds - elapsedSeconds, 0);
  });

  useEffect(() => {
    if (paused) return undefined;

    function syncRemainingTime() {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(initialSeconds - elapsedSeconds, 0));
    }

    syncRemainingTime();
    const intervalId = window.setInterval(() => {
      syncRemainingTime();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [initialSeconds, paused, startedAt]);

  useEffect(() => {
    if (secondsLeft === 0) onComplete();
  }, [onComplete, secondsLeft]);

  return secondsLeft;
}

function useTabDetection({
  onViolation,
  disabled,
}: {
  onViolation: () => void;
  disabled: boolean;
}) {
  useEffect(() => {
    if (disabled) return undefined;

    function reportViolation() {
      if (document.hidden || !document.hasFocus()) {
        onViolation();
      }
    }

    document.addEventListener("visibilitychange", reportViolation);
    window.addEventListener("blur", reportViolation);

    return () => {
      document.removeEventListener("visibilitychange", reportViolation);
      window.removeEventListener("blur", reportViolation);
    };
  }, [disabled, onViolation]);
}

function useCameraMonitoring({
  disabled,
  onCameraBlocked,
}: {
  disabled: boolean;
  onCameraBlocked: (message: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("opening");

  useEffect(() => {
    let cancelled = false;

    async function openCamera() {
      if (disabled) return;

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("blocked");
        onCameraBlocked("Camera access is not supported by this browser.");
        return;
      }

      try {
        setCameraStatus("opening");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        (window as AssessmentCameraWindow).__assessmentCameraStream = stream;

        setCameraStatus("active");
      } catch {
        if (!cancelled) {
          setCameraStatus("blocked");
          onCameraBlocked("Camera access is required during the assessment.");
        }
      }
    }

    void openCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      delete (window as AssessmentCameraWindow).__assessmentCameraStream;
    };
  }, [disabled, onCameraBlocked]);

  // attach stream to video element once both are ready
  useEffect(() => {
    if (cameraStatus === "active" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play().catch(() => null);
    }
  }, [cameraStatus]);

  return { cameraStatus, videoRef };
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function Toast({ message, tone }: { message: string; tone: "warning" | "danger" }) {
  if (!message) return null;

  return (
    <div className="fixed right-4 top-20 z-50 max-w-sm rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-lg">
      <span className={tone === "danger" ? "text-red-600" : "text-orange-600"}>{message}</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const easy = difficulty === "Easy";
  return (
    <span
      className={[
        "inline-flex h-7 items-center rounded-md px-2 text-sm font-medium",
        easy ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700",
      ].join(" ")}
    >
      {difficulty}
    </span>
  );
}

function CodeEditor({
  code,
  language,
  onChange,
}: {
  code: string;
  language: Language;
  onChange: (value: string) => void;
}) {
  const lineCount = Math.max(code.split("\n").length, 12);
  const lines = Array.from({ length: lineCount }, (_, index) => index + 1);

  return (
    <section className="border-t border-zinc-800 bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-xs text-zinc-400">
        <span className="uppercase tracking-wide">{language}</span>
        <span>Monaco Editor</span>
      </div>
      <div className="grid min-h-[300px] grid-cols-[48px_1fr] overflow-hidden font-mono text-[13px] leading-6 sm:min-h-[360px]">
        <div className="select-none bg-[#1a1a1a] px-3 py-4 text-right text-zinc-500">
          {lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <textarea
          aria-label={`${language} code editor`}
          value={code}
          onChange={(event) => onChange(event.target.value)}
          spellCheck="false"
          className="min-h-[300px] resize-none bg-[#1e1e1e] px-4 py-4 text-[#d4d4d4] caret-emerald-400 outline-none selection:bg-emerald-500/30 sm:min-h-[360px]"
        />
      </div>
    </section>
  );
}

function CameraMonitor({
  status,
  videoRef,
}: {
  status: CameraStatus;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const active = status === "active";

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[168px] sm:w-[200px] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-800 px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          {active && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
            {active ? "Recording" : status === "opening" ? "Starting…" : "Camera Off"}
          </span>
        </div>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m23 7-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      </div>

      {/* Video */}
      <div className="relative aspect-video bg-zinc-950">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={[
            "h-full w-full object-cover [transform:scaleX(-1)]",
            active ? "block" : "hidden",
          ].join(" ")}
          aria-label="Live camera feed"
        />

        {status === "opening" && (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-5 w-5 animate-spin text-zinc-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}

        {status === "blocked" && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34" />
            </svg>
            <p className="text-[10px] leading-tight text-red-400">Camera access denied</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-zinc-800 px-2.5 py-1.5">
        <p className="text-center text-[10px] leading-tight text-zinc-500">
          Monitored for exam integrity
        </p>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLanguage] = useState<Language>(getCandidateLanguage);
  const [toast, setToast] = useState("");
  const [, setViolations] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const submitAssessment = useCallback((reason: SubmitReason = "manual") => {
    setSubmitted(true);
    setToast(
      reason === "timer"
        ? "Time is up. Your assessment has been submitted."
        : reason === "integrity"
        ? "Three tab switch violations reached. Assessment submitted."
        : "Assessment submitted successfully."
    );

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "assessmentSubmission",
        JSON.stringify({ submittedAt: new Date().toISOString(), reason })
      );
    }
  }, []);

  const handleCameraBlocked = useCallback((message: string) => {
    setToast(message);
  }, []);

  const { cameraStatus, videoRef } = useCameraMonitoring({
    disabled: submitted,
    onCameraBlocked: handleCameraBlocked,
  });

  const secondsLeft = useTimer({
    initialSeconds: TOTAL_SECONDS,
    paused: submitted,
    onComplete: () => submitAssessment("timer"),
  });

  const handleViolation = useCallback(() => {
    setViolations((current) => {
      const next = current + 1;
      setToast(`Tab switch warning ${next}/${MAX_TAB_VIOLATIONS}. Please stay on the assessment page.`);
      if (next >= MAX_TAB_VIOLATIONS) submitAssessment("integrity");
      return next;
    });
  }, [submitAssessment]);

  useTabDetection({ onViolation: handleViolation, disabled: submitted });

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const activeQuestion = questions[activeIndex];
  const starterCode = useMemo(() => {
    const template = starterTemplates[selectedLanguage] ?? starterTemplates.JavaScript;
    return template(activeQuestion);
  }, [activeQuestion, selectedLanguage]);

  const answerKey = `${selectedLanguage}-${activeIndex}`;
  const currentCode = answers[answerKey] ?? starterCode;

  const assessmentTitle = `${selectedLanguage} Developer Assessment`;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar
        right={
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-50 px-3 font-semibold text-emerald-700">
              <ClockIcon />
              <span>{formatTime(secondsLeft)}</span>
            </div>
            <Button tone="orange" onClick={() => submitAssessment("manual")} disabled={submitted} className="h-10 rounded-md px-5 font-semibold">
              Submit
            </Button>
          </div>
        }
      />

      <Toast message={toast} tone={submitted ? "danger" : "warning"} />
      <CameraMonitor status={cameraStatus} videoRef={videoRef} />

      <div className="border-b border-zinc-200 px-4 py-3 text-sm text-slate-600 sm:hidden">
        {assessmentTitle}
      </div>

      <div className="lg:grid lg:min-h-[calc(100vh-8vh-1px)] lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-zinc-200 bg-white p-4 lg:border-b-0 lg:border-r">
          <h2 className="text-lg font-bold text-slate-900">Questions</h2>
          <nav className="mt-4 flex gap-3 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {questions.map((question, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={question.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "min-w-[190px] rounded-lg border p-3 text-left transition lg:w-full",
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-zinc-200 bg-white text-slate-900 hover:border-emerald-200 hover:bg-emerald-50",
                  ].join(" ")}
                >
                  <span className="block font-bold">Question {index + 1}</span>
                  <span className={["mt-2 block text-sm font-semibold", active ? "text-white" : "text-slate-800"].join(" ")}>
                    {question.marks} marks - {question.difficulty}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-col">
          <section className="px-5 py-8 sm:px-7 lg:px-8">
            <div className="hidden text-sm text-slate-600 sm:block">{assessmentTitle}</div>
            <header className="mt-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[26px]">
                {activeIndex + 1}. {activeQuestion.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={activeQuestion.difficulty} />
                <span className="text-sm text-slate-600">{activeQuestion.marks} marks</span>
              </div>
            </header>

            <div className="mt-6 space-y-5 text-[15px] leading-7 text-slate-700">
              {activeQuestion.description.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            <section className="mt-7 text-[15px] leading-7 text-slate-700">
              <h2 className="font-semibold text-slate-950">Example:</h2>
              <p>Input: {activeQuestion.example.input}</p>
              <p>Output: {activeQuestion.example.output}</p>
              {activeQuestion.example.explanation ? <p>Explanation: {activeQuestion.example.explanation}</p> : null}
            </section>

            <section className="mt-7">
              <h2 className="text-lg font-bold text-slate-950">Test Cases</h2>
              <div className="mt-4 space-y-3">
                {activeQuestion.testCases.map((testCase) => (
                  <article key={testCase.label} className="rounded-md border border-zinc-200 bg-slate-50/70 p-4 text-[14px] leading-7 text-slate-700">
                    <h3 className="font-semibold text-slate-900">{testCase.label}</h3>
                    <p>Input: {testCase.input}</p>
                    <p>Expected Output: {testCase.expected}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <CodeEditor
            code={currentCode}
            language={selectedLanguage}
            onChange={(value) => setAnswers((current) => ({ ...current, [answerKey]: value }))}
          />

          <footer className="sticky bottom-0 z-10 grid grid-cols-3 items-center gap-3 border-t border-zinc-200 bg-white px-5 py-4 sm:px-7">
            <Button
              variant="outline"
              tone="zinc"
              disabled={submitted}
              onClick={() =>
                setActiveIndex((current) =>
                  current === 0 ? questions.length - 1 : current - 1
                )
              }
              className="justify-self-start gap-2 rounded-md px-4"
            >
              <ChevronIcon direction="left" />
              Previous
            </Button>
            <span className="justify-self-center text-center text-sm text-slate-600">
              Question {activeIndex + 1} of {questions.length}
            </span>
            <Button
              tone="green"
              disabled={submitted}
              onClick={() =>
                setActiveIndex((current) =>
                  current === questions.length - 1 ? 0 : current + 1
                )
              }
              className="justify-self-end gap-2 rounded-md bg-emerald-600 px-5 hover:bg-emerald-700"
            >
              Next
              <ChevronIcon direction="right" />
            </Button>
          </footer>
        </main>
      </div>
    </div>
  );
}
