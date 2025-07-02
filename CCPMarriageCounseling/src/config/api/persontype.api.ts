import axiosInstance from "./axiosInstance"
import type { PersonType, PersonTypeResponse, PersonTypeHistoryResponse } from "@/src/config/types/persontype.type"

// Gọi API lấy loại tính cách theo surveyId
const getPersonTypeBySurveyId = async (surveyId: string): Promise<PersonType> => {
  const response = await axiosInstance.get<PersonTypeResponse>(
    `/PersonType/my-person-type/${surveyId}`
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy loại tính cách")
  }

  return response.data.data
}


const getPersonTypeHistoryBySurveyId = async (surveyId: string) => {
  const response = await axiosInstance.get<PersonTypeHistoryResponse>(
    `/PersonType/my-history/${surveyId}`
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy lịch sử khảo sát")
  }

  return response.data.data
}

const personTypeApi = {
  getPersonTypeBySurveyId,
  getPersonTypeHistoryBySurveyId, 
}

export default personTypeApi
