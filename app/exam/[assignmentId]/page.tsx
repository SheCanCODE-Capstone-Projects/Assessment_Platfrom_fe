"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { writeCandidateExam } from "@/lib/candidateExam";

type ValidatePayload = {
  assignmentId?: string;
  assessmentId?: string;
  assessmentTitle?: string;
  candidateId?: string;
  candidateName?: string;
  language?: string;
  startTime?: string;
  endTime?: string;
};

function unwrap<T>(body: any): T {
  return (body?.data ?? body) as T;
}

export default function CandidateExamEntryPage() {
  const router = useRouter();
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params?.assignmentId ?? "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) {
      setLoading(false);
      setError("Invalid link: missing assignment id");
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      try {
        // 1) Validate assignment/invite link
        const validateRes = await fetch(
          `/api/backend/api/assignments/validate?assignmentId=${encodeURIComponent(
            assignmentId,
          )}`,
          { headers: { Accept: "application/json" } },
        );
        const validateBody = await validateRes.json().catch(() => null);
        if (!validateRes.ok) {
          const message =
            validateBody?.message ??
            validateBody?.error ??
            `Link validation failed (HTTP ${validateRes.status})`;
          throw new Error(message);
        }

        const validated = unwrap<ValidatePayload>(validateBody);
        const assessmentId = validated.assessmentId;
        if (!assessmentId) {
          throw new Error("Invalid link: missing assessmentId");
        }

        // 2) Start attempt
        const startRes = await fetch(`/api/backend/api/attempt/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ assignmentId }),
        });
        const startBody = await startRes.json().catch(() => null);
        if (!startRes.ok) {
          const message =
            startBody?.message ??
            startBody?.error ??
            `Unable to start attempt (HTTP ${startRes.status})`;
          throw new Error(message);
        }
        const started = unwrap<any>(startBody);
        const attemptId = String(
          started?.attemptId ??
            started?.id ??
            started?.candidateAssessmentId ??
            started?.data?.attemptId ??
            "",
        );

        // Persist session for the existing /instructions -> /assessment flow
        writeCandidateExam({
          assignmentId,
          assessmentId: String(assessmentId),
          attemptId: attemptId || undefined,
          candidateId: validated.candidateId,
          candidateName: validated.candidateName,
          language: validated.language,
          startTime: validated.startTime,
          endTime: validated.endTime,
        });

        if (!cancelled) {
          router.replace("/instructions");
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message || "Failed to start exam");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [assignmentId, router]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar right={<span aria-hidden="true" />} />

      <main className="flex flex-1 items-center justify-center px-6">
        <Card className="w-full max-w-lg p-8">
          <h1 className="text-xl font-semibold text-zinc-900">
            Preparing your assessment…
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            We’re validating your link and starting your attempt.
          </p>

          {error ? (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex gap-3">
            <Button
              tone="green"
              disabled={loading}
              onClick={() => router.refresh()}
            >
              Retry
            </Button>
            <Button href="/" variant="outline" tone="zinc">
              Back to Home
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

