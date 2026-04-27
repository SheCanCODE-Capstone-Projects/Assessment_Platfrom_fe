import { useState } from "react";
import { useRouter } from "next/router";

import Navbar from "@/src/components/layout/Navbar";
import Button from "@/src/components/ui/Button";

type CandidateSession = {
  fullName: string;
  preferredLanguage: string;
};

const INITIAL_SESSION: CandidateSession = {
  fullName: "",
  preferredLanguage: "",
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
  const [candidateSession] = useState<CandidateSession>(() => {
    if (typeof window === "undefined") {
      return INITIAL_SESSION;
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
                  You need to score at least 70% to pass this assessment.
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

          <div className="mt-8 border-t border-zinc-200 pt-8">
            <p className="text-[15px] leading-7 text-slate-700">
              Once you start, the timer will begin counting down. Make sure
              you&apos;re ready before proceeding.
            </p>

            <Button
              type="button"
              tone="green"
              size="lg"
              onClick={() => void router.push("/")}
              className="mt-7 h-12 w-full rounded-lg bg-[#1ec28b] text-base font-semibold hover:bg-[#18af7d]"
            >
              Start Assessment
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
