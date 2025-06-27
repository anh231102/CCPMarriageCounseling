import axiosInstance from "./axiosInstance"
import type {
  Survey,
  SurveyResponse,
  Question,
  QuestionResponse
} from "@/src/config/types/survey.type"

// Lấy danh sách survey
const getSurveys = async (): Promise<Survey[]> => {
  const response = await axiosInstance.get<SurveyResponse>("/Survey")
  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách khảo sát")
  }
  return response.data.data
}

// ✅ Gọi API random câu hỏi cho survey cụ thể
const getRandomSurveyQuestions = async (
  surveyId: string,
  count = 25
): Promise<Question[]> => {
  const response = await axiosInstance.get<QuestionResponse>(
    `/Survey/randomSurvey`,
    {
      params: { surveyId, count }
    }
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy câu hỏi khảo sát")
  }

  return response.data.data
}

const surveyApi = {
  getSurveys,
  getRandomSurveyQuestions,
}

export default surveyApi
