import type { ExamCardData, ExamStatus } from "@/components/cards/ExamCard";
import type { CreateExamPayload } from "@/components/modals/CreateExamModal";
import { apiRequest } from "@/lib/api";
import type { QuestionBankItem } from "@/components/modals/AssignQuestionModal";

type ApiTimeUnit = "SECONDS" | "MINUTES" | "HOURS";

export type AssessmentDto = {
  assessmentId: string;
  examTitle: string;
  description: string;
  timeValue: number;
  timeUnit: ApiTimeUnit;
  passMark: number;
  status: ExamStatus;
  questions?: QuestionDto[];
  createdAt?: string;
  updatedAt?: string;
};

export type QuestionDto = {
  questionId: string;
  title: string;
  description: string;
  marks: number;
  difficulty: QuestionBankItem["difficulty"];
  language: QuestionBankItem["language"];
};

type AssessmentRequest = {
  examTitle: string;
  description: string;
  timeValue: number;
  timeUnit: ApiTimeUnit;
  passMark: number;
  status: ExamStatus;
  questionIds: string[];
};

function assessmentLink(assessmentId: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/assessment?assessmentId=${assessmentId}`;
  }

  return `/assessment?assessmentId=${assessmentId}`;
}

export function mapAssessmentToExamCard(
  assessment: AssessmentDto,
): ExamCardData {
  const questions = assessment.questions ?? [];

  return {
    id: assessment.assessmentId,
    title: assessment.examTitle,
    description: assessment.description,
    duration: assessment.timeValue,
    timeUnit: assessment.timeUnit,
    passMark: assessment.passMark,
    questions: questions.length,
    totalMarks: questions.reduce((total, question) => total + question.marks, 0),
    link: assessmentLink(assessment.assessmentId),
    status: assessment.status,
  };
}

export function getAssessmentQuestionIds(assessment: AssessmentDto) {
  return (assessment.questions ?? []).map((question) => question.questionId);
}

export function mapQuestionToBankItem(question: QuestionDto): QuestionBankItem {
  return {
    id: question.questionId,
    title: question.title,
    description: question.description,
    marks: question.marks,
    difficulty: question.difficulty,
    language: question.language,
    topic: question.language,
  };
}

function toAssessmentRequest(payload: CreateExamPayload): AssessmentRequest {
  return {
    examTitle: payload.examTitle,
    description: payload.description,
    timeValue: payload.timeValue,
    timeUnit: payload.timeUnit,
    passMark: payload.passMark,
    status: payload.status,
    questionIds: payload.selectedQuestionIds ?? [],
  };
}

export async function getAssessments() {
  const assessments = await apiRequest<AssessmentDto[]>("/assessments");
  return assessments.map(mapAssessmentToExamCard);
}

export async function getAssessmentRows() {
  const assessments = await apiRequest<AssessmentDto[]>("/assessments");

  return {
    exams: assessments.map(mapAssessmentToExamCard),
    examQuestionIds: Object.fromEntries(
      assessments.map((assessment) => [
        assessment.assessmentId,
        getAssessmentQuestionIds(assessment),
      ]),
    ),
  };
}

export async function getAssessmentById(id: string) {
  return apiRequest<AssessmentDto>(`/assessments/${id}`);
}

export async function createAssessment(payload: CreateExamPayload) {
  const assessment = await apiRequest<AssessmentDto>("/assessments", {
    method: "POST",
    body: JSON.stringify(toAssessmentRequest(payload)),
  });

  return mapAssessmentToExamCard(assessment);
}

export async function updateAssessment(
  id: string,
  payload: CreateExamPayload,
) {
  const assessment = await apiRequest<AssessmentDto>(`/assessments/${id}`, {
    method: "PUT",
    body: JSON.stringify(toAssessmentRequest(payload)),
  });

  return mapAssessmentToExamCard(assessment);
}

export async function deleteAssessment(id: string) {
  await apiRequest<string>(`/assessments/${id}`, {
    method: "DELETE",
  });
}

export async function updateAssessmentStatus(id: string, status: ExamStatus) {
  const assessment = await apiRequest<AssessmentDto>(
    `/assessments/${id}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PATCH",
    },
  );

  return mapAssessmentToExamCard(assessment);
}

export async function assignAssessmentQuestions(
  id: string,
  questionIds: string[],
) {
  const assessment = await apiRequest<AssessmentDto>(
    `/assessments/${id}/questions`,
    {
      method: "PATCH",
      body: JSON.stringify(questionIds),
    },
  );

  return mapAssessmentToExamCard(assessment);
}
