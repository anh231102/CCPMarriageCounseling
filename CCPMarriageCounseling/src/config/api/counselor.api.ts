import axiosInstance from "./axiosInstance"
import type { CounselorResponse } from "@/src/config/types/counselor.type"

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
const counselorApi = {
  getAllCounselor,
  getCounselorWithSub,
}

export default counselorApi
