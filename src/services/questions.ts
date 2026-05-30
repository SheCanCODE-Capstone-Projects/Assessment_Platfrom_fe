import { apiRequest } from "@/lib/api";
import {
  mapQuestionToBankItem,
  type QuestionDto,
} from "@/services/assessments";

export async function getQuestions() {
  const questions = await apiRequest<QuestionDto[]>("/questions");
  return questions.map(mapQuestionToBankItem);
}
