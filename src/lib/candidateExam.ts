export type CandidateExamSession = {
  assignmentId: string;
  assessmentId: string;
  attemptId?: string;
  candidateId?: string;
  candidateName?: string;
  language?: string;
  startTime?: string;
  endTime?: string;
};

const KEY = "candidateExam";

export function readCandidateExam(): CandidateExamSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CandidateExamSession;
  } catch {
    return null;
  }
}

export function writeCandidateExam(session: CandidateExamSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function updateCandidateExam(patch: Partial<CandidateExamSession>) {
  const current = readCandidateExam();
  writeCandidateExam({ ...(current ?? ({} as CandidateExamSession)), ...patch });
}

