export type CandidateStatus = "pending" | "in_progress" | "completed" | "expired";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  disability: string;
  exam: string;
  status: CandidateStatus;
  date: string;
  assessmentLink: string;
}
