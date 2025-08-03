import axiosInstance from "./axiosInstance"
import {
  CreateCoupleResponse,
  GetLatestCoupleResponse,
  JoinCoupleRequest,
  JoinCoupleResponse,
  CancelCoupleResponse,
  CoupleSurveyResultRequest,
  CoupleSurveyResultResponse,
  PartnerProgressData,
  Couple,
  CoupleResultResponse,
  CoupleHistoryResponse,
  ApplyLatestResultResponse,
  CreateVirtualCoupleRequest,
} from "@/src/config/types/couple.type"

const createCouple = async (surveyIds: string[]): Promise<CreateCoupleResponse> => {

  try {
    const response = await axiosInstance.post<CreateCoupleResponse>("/Couple", {
      surveyIds,
    })


    return response.data
  } catch (error: any) {
    if (error.response) {

      return error.response.data
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

const postCoupleSurveyResult = async (
  body: CoupleSurveyResultRequest
): Promise<string> => {
  const response = await axiosInstance.post<CoupleSurveyResultResponse>(
    "/Couple/submit",
    body
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy kết quả khảo sát")
  }

  return response.data.data
}

import { PartnerProgressResponse } from "@/src/config/types/couple.type" // nhớ import

const getPartnerProgress = async (): Promise<PartnerProgressData> => {
  const response = await axiosInstance.get<PartnerProgressResponse>(
    "/Couple/partner-progress"
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy tiến trình đối phương")
  }

  return response.data.data
}

const completeCoupleRoom = async (coupleId: string): Promise<string> => {
  try {
    const response = await axiosInstance.put(`/Couple/${coupleId}/complete`, coupleId, {
      headers: {
        "Content-Type": "text/plain",
      }
    })

    if (!response.data.success) {
      throw new Error(response.data.error || "Không thể hoàn tất phòng")
    }

    return response.data.data || "Hoàn tất thành công"
  } catch (error: any) {
    if (error.response) {
      console.error("[completeCoupleRoom] API Error:", error.response.data)
    } else {
      console.error("[completeCoupleRoom] Error:", error.message)
    }
    throw error
  }
}

const getCoupleResult = async (coupleId: string): Promise<Couple> => {
  try {
    const response = await axiosInstance.get<CoupleResultResponse>(
      `/Couple/result/${coupleId}`
    )

    if (!response.data.success) {
      throw new Error(response.data.error || "Không thể lấy kết quả Couple")
    }

    return response.data.data
  } catch (error: any) {
    if (error.response) {
      console.error("[getCoupleResult] API Error Response:", error.response.data)
    } else {
      console.error("[getCoupleResult] Error:", error.message)
    }
    throw error
  }
}

const getCoupleHistory = async (): Promise<Couple[]> => {
  try {
    const response = await axiosInstance.get<CoupleHistoryResponse>(
      "/Couple/my-couples-history"
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Không thể lấy lịch sử Couple");
    }

    return response.data.data; // Trả về danh sách Couple
  } catch (error: any) {
    if (error.response) {
      console.error("[getCoupleHistory] API Error Response:", error.response.data);
    } else {
      console.error("[getCoupleHistory] Error:", error.message);
    }
    throw error;
  }
}

const applyLatestResult = async (
  surveyId: string
): Promise<string> => {
  try {
    const response = await axiosInstance.post<ApplyLatestResultResponse>(
      "/Couple/apply-latest-result",
      { surveyId }
    )

    if (!response.data.success) {
      throw new Error(response.data.error || "Không thể áp dụng kết quả mới nhất")
    }

    return response.data.data
  } catch (error: any) {
    let message = "Không thể sử dụng kết quả có sẵn."
    if (error.response && error.response.data && error.response.data.error) {
      message = error.response.data.error
    } else if (typeof error === "object" && error !== null && "message" in error) {
      message = error.message
    }
    // Sửa lỗi thiếu return: ném lại lỗi để hàm luôn trả về Promise<string>
    throw new Error(message)
  }
}

const createVirtualCouple = async (
  payload: CreateVirtualCoupleRequest
): Promise<CreateCoupleResponse> => {
  try {
    const response = await axiosInstance.post<CreateCoupleResponse>(
      "/Couple/create-virtual",
      payload
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data as CreateCoupleResponse;
    } else {
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }
};


const coupleApi = {
  createCouple,
  getLatestCoupleRoom,
  joinCoupleRoom,
  cancelCoupleRoom,
  postCoupleSurveyResult,
  getPartnerProgress,
  completeCoupleRoom,
  getCoupleResult,
  getCoupleHistory,
  applyLatestResult,
  createVirtualCouple,
}

export default coupleApi
