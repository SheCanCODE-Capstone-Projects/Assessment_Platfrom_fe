 "use client";

import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";


function BackButton () {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => {
        router.back();
        setTimeout(() => {
          if (window.history.length <= 1) router.push("/admin");
        }, 0);
      }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

function PeopleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6" />
      <path d="M23 11h-6" />
    </svg>
  );
}

export default function CandidatesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="w-full bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          <BackButton />
          <div className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded bg-emerald-600 text-white">
            <PeopleIcon />
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-zinc-900">
              Candidate Management
            </div>
            <div className="text-xs text-zinc-500">0 candidates</div>
          </div>
        </div>
        <div className="h-px w-full bg-zinc-200/70" />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-zinc-900">
            How to Assign Candidates
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-600">
            To assign a candidate to an exam, share the assessment link with
            them. The link can be found on the Exam Management page.
          </p>

          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-[11px] text-emerald-900">
            <div className="font-medium">Example:</div>
            <div className="mt-1">
              https://fg.story_16809212.figma.site/candidate/exam
            </div>
            <div className="mt-2 text-emerald-800/90">
              When candidates click this link, they’ll fill out their
              information and start the assessment.
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-500">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6" />
              <path d="M23 11h-6" />
            </svg>
          </div>
          <div className="mt-3 text-sm font-medium text-zinc-700">
            No candidates yet
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Share assessment links with candidates to get started
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

