import type { Candidate } from "../_data/types";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  normalizePhoneNumber,
  unwrapData,
  unwrapList,
} from "@/lib/apiClient";

// ── Types ────────────────────────────────────────────────────────────────────

export type ApiLanguage =
  | "JAVASCRIPT" | "PYTHON" | "JAVA" | "CPP"
  | "TYPESCRIPT" | "CSHARP" | "PHP";

export interface ApiUser {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "ADMIN" | "CANDIDATE";
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  language: ApiLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAssessment {
  assessmentId: string;
  examTitle: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiAssignment {
  assignmentId: string;
  assessmentId: string;
  assessmentTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  accessLink: string;
  assignedAt: string;
}

export interface BulkUploadResult {
  created: number;
  skipped: number;
  errors: string[];
}

const CANDIDATE_QUERY = (data: {
  name: string;
  email: string;
  phoneNumber: string;
  language: string;
}) => ({
  name: data.name.trim(),
  email: data.email.trim(),
  phoneNumber: normalizePhoneNumber(data.phoneNumber),
  language: data.language,
});

// ── Users / Candidates ───────────────────────────────────────────────────────

export async function fetchCandidates(): Promise<ApiUser[]> {
  const body = await apiGet<{ data: ApiUser[] } | ApiUser[]>("/users");
  return unwrapList<ApiUser>(body).filter((u) => u.role === "CANDIDATE");
}

export function examToLanguage(exam: string): ApiLanguage {
  const map: Record<string, ApiLanguage> = {
    Frontend: "JAVASCRIPT",
    Backend: "PYTHON",
    Fundamentals: "JAVA",
    JavaScript: "JAVASCRIPT",
    Python: "PYTHON",
    Java: "JAVA",
    "C++": "CPP",
    TypeScript: "TYPESCRIPT",
    "C#": "CSHARP",
    PHP: "PHP",
  };
  return map[exam] ?? (exam as ApiLanguage) ?? "JAVASCRIPT";
}

export function mapUserToCandidate(
  user: ApiUser,
  assignment?: ApiAssignment,
): Candidate {
  return {
    id: user.userId,
    name: user.name,
    email: user.email,
    phone: user.phoneNumber ?? "",
    nationality: "Other",
    disability: "None",
    exam: assignment?.assessmentTitle ?? "",
    status: user.status === "ACTIVE" ? "pending" : "expired",
    date: (user.createdAt ?? new Date().toISOString()).slice(0, 10),
    assessmentLink: assignment?.accessLink ?? "",
  };
}

export async function loadCandidatesWithAssignments(): Promise<Candidate[]> {
  const [users, assignments] = await Promise.all([
    fetchCandidates(),
    fetchAllAssignments().catch(() => [] as ApiAssignment[]),
  ]);

  const latestByCandidate = new Map<string, ApiAssignment>();
  for (const a of assignments) {
    const existing = latestByCandidate.get(a.candidateId);
    if (!existing || a.assignedAt > existing.assignedAt) {
      latestByCandidate.set(a.candidateId, a);
    }
  }

  return users.map((u) => mapUserToCandidate(u, latestByCandidate.get(u.userId)));
}

export async function createCandidate(data: {
  name: string;
  email: string;
  phoneNumber: string;
  language: string;
}): Promise<ApiUser> {
  const body = await apiPost<{ data: ApiUser } | ApiUser>("/users", {
    multipartQuery: CANDIDATE_QUERY(data),
    formData: new FormData(),
  });
  return unwrapData<ApiUser>(body);
}

export async function updateCandidate(
  id: string,
  data: { name: string; email: string; phoneNumber: string; language: string },
): Promise<ApiUser> {
  const body = await apiPut<{ data: ApiUser } | ApiUser>(`/users/${id}`, {
    query: CANDIDATE_QUERY(data),
  });
  return unwrapData<ApiUser>(body);
}

export async function deleteCandidate(id: string): Promise<void> {
  await apiDelete(`/users/${id}`);
}

export async function bulkUploadCandidates(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append("file", file);

  let body: Record<string, unknown>;
  try {
    body = await apiPost<Record<string, unknown>>("/users/bulk-upload", { formData: form });
  } catch (err) {
    const msg = (err as Error).message ?? "";
    const lc = msg.toLowerCase();
    // Backend returns 4xx with "already exists" / "duplicate" — treat as all skipped
    if (lc.includes("already") || lc.includes("exist") || lc.includes("duplicate")) {
      return { created: 0, skipped: 0, errors: [msg] };
    }
    throw err;
  }

  const data = body.data as BulkUploadResult | undefined;
  if (data && typeof data.created === "number") return data;

  if (typeof body.created === "number") {
    return {
      created: body.created as number,
      skipped: (body.skipped as number | undefined) ?? 0,
      errors: (body.errors as string[] | undefined) ?? [],
    };
  }

  // Backend responded 200 but without counts — treat as all skipped
  const message = typeof body.message === "string" ? body.message : "";
  return {
    created: 0,
    skipped: 0,
    errors: message ? [message] : ["No candidates were created — they may already exist in the system."],
  };
}

// ── Assessments ──────────────────────────────────────────────────────────────

export async function fetchAssessments(): Promise<ApiAssessment[]> {
  const body = await apiGet<{ data: ApiAssessment[] } | ApiAssessment[]>("/assessments");
  return unwrapList<ApiAssessment>(body);
}

// ── Assignments ──────────────────────────────────────────────────────────────

export async function fetchAllAssignments(): Promise<ApiAssignment[]> {
  const body = await apiGet<{ data: ApiAssignment[] } | ApiAssignment[]>("/api/assignments");
  return unwrapList<ApiAssignment>(body);
}

export async function fetchAssignmentsForCandidate(
  candidateId: string,
): Promise<ApiAssignment[]> {
  const body = await apiGet<{ data: ApiAssignment[] } | ApiAssignment[]>(
    `/api/assignments/candidate/${candidateId}`,
  );
  return unwrapList<ApiAssignment>(body);
}

export async function assignExamBulk(
  assessmentId: string,
  candidateIds: string[],
): Promise<ApiAssignment[]> {
  const body = await apiPost<{ data: ApiAssignment[] } | ApiAssignment[]>(
    "/api/assignments/bulk",
    { json: { assessmentId, candidateIds } },
  );
  return unwrapList<ApiAssignment>(body);
}

/** Resolve exam link for invite/reminder emails. */
export async function resolveCandidateExamLink(candidate: Candidate): Promise<string> {
  const stored = candidate.assessmentLink?.trim();
  if (stored) return stored;

  try {
    const assignments = await fetchAssignmentsForCandidate(candidate.id);
    const sorted = [...assignments].sort((a, b) =>
      b.assignedAt.localeCompare(a.assignedAt),
    );
    const link = sorted[0]?.accessLink?.trim();
    if (link) return link;
  } catch {
    /* use fallback below */
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/exam/${candidate.id}`;
  }

  return "";
}

// ── Email ────────────────────────────────────────────────────────────────────

export async function sendInviteEmail(data: {
  email: string;
  name: string;
  link: string;
  startTime: string;
  endTime: string;
}): Promise<void> {
  await apiPost("/api/email/invite", { json: data });
}

export async function sendReminderEmail(data: {
  email: string;
  name: string;
  link: string;
  endTime: string;
}): Promise<void> {
  await apiPost("/api/email/reminder", { json: data });
}
