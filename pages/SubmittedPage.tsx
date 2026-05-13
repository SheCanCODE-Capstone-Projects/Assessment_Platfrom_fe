import Button from "@/src/components/ui/Button";
import SuccessToast from "@/src/components/feedback/SuccessToast";

/**
 * Shows the final confirmation after an assessment has been submitted.
 */
export default function SubmittedPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 text-slate-900 sm:px-6">
      <SuccessToast message="Assessment submitted successfully!" />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[448px] items-center">
        <section className="w-full rounded-lg border border-zinc-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 6-7" />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-bold leading-tight text-slate-950">
            Assessment Submitted Successfully!
          </h1>
          <p className="mx-auto mt-4 max-w-[350px] text-[15px] leading-7 text-slate-600">
            Thank you for completing the assessment. Your responses have been
            submitted and will be reviewed by our team.
          </p>

          <section className="mt-7 rounded-md border border-emerald-100 bg-emerald-50/60 p-5 text-left">
            <h2 className="text-center text-lg font-bold text-slate-950">
              What&apos;s Next?
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
              <li>Our team will review your code submissions</li>
              <li>You&apos;ll receive an email with the results within 3-5 business days</li>
              <li>Qualified candidates will be contacted for the next round of interviews</li>
            </ul>
          </section>

          <p className="mt-7 text-sm leading-6 text-slate-600">
            You can now safely close this window. We&apos;ll be in touch soon!
          </p>

          <Button href="/" tone="green" className="mt-6 min-w-40 rounded-md">
            Return to Home
          </Button>
        </section>
      </main>
    </div>
  );
}
