import axiosInstance from "./axiosInstance"
import {
  CreateCoupleResponse,
  GetLatestCoupleResponse,
  JoinCoupleRequest,
  JoinCoupleResponse,
  CancelCoupleResponse,
} from "@/src/config/types/couple.type"

const createCouple = async (surveyIds: string[]): Promise<CreateCoupleResponse> => {
 
  try {
    const response = await axiosInstance.post<CreateCoupleResponse>("/Couple", {
      surveyIds,
    })
   

    return response.data
  } catch (error: any) {
    if (error.response) {
 
      return error.response.data // trả response lỗi để xử lý ở ngoài
    } else {

      return {
        success: false,
        data: null,
        error: error.message,
      }
    }
  }
}

const getLatestCoupleRoom = async () => {
  const response = await axiosInstance.get<GetLatestCoupleResponse>(
    "/Couple/get-latest-room"
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Lấy Couple Room thất bại")
  }

  return response.data.data
}

const joinCoupleRoom = async (payload: JoinCoupleRequest): Promise<string> => {
  const response = await axiosInstance.post<JoinCoupleResponse>(
    "/Couple/join",
    payload
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Join Couple thất bại")
  }

  return response.data.data
}

const cancelCoupleRoom = async (): Promise<void> => {
  try {
    const response = await axiosInstance.put<CancelCoupleResponse>("/Couple/cancel-room")

    if (!response.data.success) {
      throw new Error(response.data.error || "Hủy phòng thất bại")
    }
  } catch (error: any) {
    if (error.response) {
      console.error("[cancelCoupleRoom] API Error Response:", error.response.data)
    } else {
      console.error("[cancelCoupleRoom] Error:", error.message)
    }
    throw error
  }
}

const coupleApi = {
  createCouple,
  getLatestCoupleRoom,
  joinCoupleRoom,
  cancelCoupleRoom,
}

export default coupleApi
