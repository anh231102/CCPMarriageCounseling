import axiosInstance from "./axiosInstance"
import type { CounselorResponse, AvailableScheduleResponse, AvailableScheduleData, RecommendedCounselorResponse } from "@/src/config/types/counselor.type"

const getAllCounselor = async () => {
  const response = await axiosInstance.get<CounselorResponse>("/Counselor")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách tư vấn viên")
  }

  return response.data.data
}

const getCounselorWithSub = async () => {
  const response = await axiosInstance.get<CounselorResponse>("/Counselor/active-with-sub")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách tư vấn viên")
  }

  return response.data.data
}

const postAvailableSchedule = async (counselorId: string): Promise<AvailableScheduleData> => {
  const response = await axiosInstance.post<AvailableScheduleResponse>("/Counselor/available-schedule", {
    counselorId,
  })

  const data = response.data

  if (!data.success) {
    throw new Error(data.error || "Không thể lấy lịch hẹn")
  }

  return data.data
}

const getRecommendedCounselors = async () => {
  const response = await axiosInstance.get<RecommendedCounselorResponse>("/Counselor/recommend")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách gợi ý tư vấn viên")
  }

  return response.data.data
}


const counselorApi = {
  getAllCounselor,
  getCounselorWithSub,
  postAvailableSchedule,
  getRecommendedCounselors,
}

export default counselorApi
