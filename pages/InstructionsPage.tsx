import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";

type ReadinessStatus = "idle" | "checking" | "granted" | "denied";

type ReadinessState = {
  camera: ReadinessStatus;
  internet: "online" | "offline";
};

type CandidateSession = {
  fullName: string;
  preferredLanguage: string;
};

const INITIAL_SESSION: CandidateSession = {
  fullName: "",
  preferredLanguage: "",
};

const ASSESSMENT_STARTED_AT_KEY = "assessmentStartedAt";
const PASS_MARK = 70;

type AssessmentCameraWindow = Window & {
  __assessmentCameraStream?: MediaStream;
};

const guidelineItems = [
  "Read each question carefully before writing code",
  "You can navigate between questions using the question list",
  "Your answers are auto-saved as you type",
  "Make sure to test your code with the provided test cases",
  "You can submit the assessment at any time before the timer expires",
  "Once submitted, you cannot make changes to your answers",
  "Ensure you have a stable internet connection throughout the test",
  "Do not refresh or close the browser window during the assessment",
];

const editorFeatures = [
  "Syntax highlighting and auto-completion",
  "Line numbers and bracket matching",
  "Keyboard shortcuts (Ctrl+S to save, etc.)",
  "Dark/light theme options",
];

function IconCircle({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function InstructionsPage() {
  const router = useRouter();
  const [readiness, setReadiness] = useState<ReadinessState>({
    camera: "idle",
    internet: typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showReadinessModal, setShowReadinessModal] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setReadiness((r) => ({ ...r, internet: "online" }));
    }
    function handleOffline() {
      setReadiness((r) => ({ ...r, internet: "offline" }));
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  async function checkCamera() {
    setReadiness((r) => ({ ...r, camera: "checking" }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setReadiness((r) => ({ ...r, camera: "granted" }));
    } catch {
      setReadiness((r) => ({ ...r, camera: "denied" }));
    }
  }

  async function handleStartClick() {
    if (
      readiness.camera === "idle" ||
      readiness.camera === "denied" ||
      readiness.internet === "offline" ||
      !termsAccepted
    ) {
      setShowReadinessModal(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      (window as AssessmentCameraWindow).__assessmentCameraStream = stream;
      window.sessionStorage.setItem(ASSESSMENT_STARTED_AT_KEY, String(Date.now()));
    } catch {
      setReadiness((r) => ({ ...r, camera: "denied" }));
      setShowReadinessModal(true);
      return;
    }

    void router.push("/assessment");
  }

  const allReady =
    readiness.camera === "granted" &&
    readiness.internet === "online" &&
    termsAccepted;

  const [candidateSession] = useState<CandidateSession>(() => {
    if (typeof window === "undefined") {
      return INITIAL_SESSION;
    }

    // If user arrived from an invite link (/exam/:assignmentId), prefer that session.
    const candidateExamRaw = window.sessionStorage.getItem("candidateExam");
    if (candidateExamRaw) {
      try {
        const parsed = JSON.parse(candidateExamRaw) as {
          candidateName?: string;
          language?: string;
        };
        return {
          fullName: parsed.candidateName ?? "",
          preferredLanguage: parsed.language ?? "",
        };
      } catch {
        // fall back to candidateRegistration below
      }
    }

    const rawSession = window.sessionStorage.getItem("candidateRegistration");

    if (!rawSession) {
      return INITIAL_SESSION;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as CandidateSession;

      return {
        fullName: parsedSession.fullName ?? "",
        preferredLanguage: parsedSession.preferredLanguage ?? "",
      };
    } catch {
      return INITIAL_SESSION;
    }
  });

  const candidateName = candidateSession.fullName || "Candidate";
  const languageName = candidateSession.preferredLanguage || "JavaScript";
  const assessmentTitle = `${languageName} Developer Assessment`;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar right={<span aria-hidden="true" />} />

      <main className="px-4 py-12 sm:px-6 sm:py-14">
        <section className="mx-auto w-full max-w-[836px] rounded-xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-9">
          <header>
            <h1 className="text-[30px] font-bold tracking-tight text-[#0f172a] sm:text-[32px]">
              Assessment Instructions
            </h1>
            <p className="mt-3 text-[15px] leading-7 text-slate-600">
              Please read carefully before starting the test
            </p>
          </header>

          <section className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
            <p className="text-[15px] leading-7 text-slate-800">
              <span className="font-semibold text-slate-900">
                Welcome, {candidateName}!
              </span>{" "}
              You&apos;re about to start the{" "}
              <span className="font-semibold text-slate-900">
                {assessmentTitle}.
              </span>
            </p>
          </section>

          <section className="mt-9">
            <div className="flex items-center gap-3">
              <IconCircle className="h-5 w-5 text-orange-500">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8h.01" />
                <path d="M11 12h1v4h1" />
              </IconCircle>
              <h2 className="text-[18px] font-semibold text-[#0f172a]">
                Important Information
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 text-[15px] leading-8 text-slate-800">
                <IconCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </IconCircle>
                <p>
                  <span className="font-semibold text-slate-900">
                    Time Limit:
                  </span>{" "}
                  You have 60 minutes to complete the assessment. The timer
                  will start as soon as you click &quot;Start Assessment&quot;.
                </p>
              </div>

              <div className="flex items-start gap-3 text-[15px] leading-8 text-slate-800">
                <IconCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 2.5 2.5L16 9" />
                </IconCircle>
                <p>
                  <span className="font-semibold text-slate-900">
                    Questions:
                  </span>{" "}
                  The assessment contains 3 coding questions of varying
                  difficulty levels.
                </p>
              </div>

              <div className="flex items-start gap-3 text-[15px] leading-8 text-slate-800">
                <IconCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 2.5 2.5L16 9" />
                </IconCircle>
                <p>
                  <span className="font-semibold text-slate-900">
                    Pass Mark:
                  </span>{" "}
                  You need to score at least {PASS_MARK}% to pass this assessment.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-[18px] font-semibold text-[#0f172a]">
              Guidelines
            </h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-8 text-slate-800">
              {guidelineItems.map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-xl border border-orange-200 bg-orange-50/40 p-4 sm:p-5">
            <h3 className="text-[16px] font-semibold text-[#0f172a]">
              Code Editor Features:
            </h3>
            <ul className="mt-4 space-y-1 text-[15px] leading-8 text-slate-800">
              {editorFeatures.map((feature) => (
                <li key={feature}>&bull; {feature}</li>
              ))}
            </ul>
          </section>

          {/* Pre-Assessment Readiness */}
          <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 sm:p-5">
            <h3 className="text-[16px] font-semibold text-[#0f172a]">
              Pre-Assessment Checks
            </h3>
            <p className="mt-1 text-[13px] text-slate-500">
              All three checks must pass before you can start.
            </p>

            <div className="mt-4 space-y-3">
              {/* Internet */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-800">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Internet Connection
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    readiness.internet === "online"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {readiness.internet === "online" ? "Connected" : "No Connection"}
                </span>
              </div>

              {/* Camera */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-800">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m23 7-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  Camera Access
                </div>
                {readiness.camera === "idle" && (
                  <button
                    type="button"
                    onClick={() => void checkCamera()}
                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    Verify Camera
                  </button>
                )}
                {readiness.camera === "checking" && (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
                    Checking…
                  </span>
                )}
                {readiness.camera === "granted" && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Granted
                  </span>
                )}
                {readiness.camera === "denied" && (
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                      Denied
                    </span>
                    <button
                      type="button"
                      onClick={() => void checkCamera()}
                      className="text-xs text-emerald-600 underline hover:text-emerald-800"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>

            {readiness.camera === "denied" && (
              <p className="mt-3 text-[13px] text-red-600">
                Camera access was denied. Please enable it in your browser settings and retry.
              </p>
            )}

              {/* Terms and Conditions */}
              <div className={[
                "mt-3 flex items-start gap-3 rounded-lg border px-4 py-3 transition",
                termsAccepted
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-zinc-200 bg-white",
              ].join(" ")}>
                <input
                  id="termsAccepted"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-emerald-600"
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-[13px] leading-6 text-slate-700 cursor-pointer"
                >
                  I have read and understood all the instructions above. I agree to the{" "}
                  <span className="font-semibold text-[#0f172a]">
                    terms and conditions
                  </span>{" "}
                  of this assessment, including the integrity policy. I understand that
                  tab switching will be monitored and violations may result in automatic submission.
                </label>
              </div>
          </section>

          <div className="mt-8 border-t border-zinc-200 pt-8">
            <p className="text-[15px] leading-7 text-slate-700">
              Once you start, the timer will begin counting down. Make sure
              you&apos;re ready before proceeding.
            </p>

            <Button
              type="button"
              tone="green"
              size="lg"
              onClick={handleStartClick}
              className={`mt-7 h-12 w-full rounded-lg text-base font-semibold transition ${
                allReady
                  ? "bg-[#1ec28b] hover:bg-[#18af7d]"
                  : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {allReady ? "Start Assessment" : "Complete Checks to Start"}
            </Button>
          </div>
        </section>
      </main>

      {/* Readiness warning modal */}
      {showReadinessModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
            <h2 className="text-[17px] font-semibold text-[#0f172a]">
              Readiness Check Failed
            </h2>
            <ul className="mt-4 space-y-2 text-[14px] text-slate-700">
              {readiness.internet === "offline" && (
                <li className="flex items-center gap-2 text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  No internet connection detected.
                </li>
              )}
              {(readiness.camera === "idle" || readiness.camera === "denied") && (
                <li className="flex items-center gap-2 text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  Camera access is required. Please grant permission.
                </li>
              )}
              {!termsAccepted && (
                <li className="flex items-center gap-2 text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  You must accept the terms and conditions.
                </li>
              )}
            </ul>
            <Button
              type="button"
              tone="zinc"
              size="md"
              onClick={() => setShowReadinessModal(false)}
              className="mt-6 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
