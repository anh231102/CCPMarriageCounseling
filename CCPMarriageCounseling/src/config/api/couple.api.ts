import axiosInstance from "./axiosInstance"
import { CreateCoupleResponse } from "@/src/config/types/couple.type"

const createCouple = async (): Promise<string> => {
  const response = await axiosInstance.post<CreateCoupleResponse>("/Couple")

  if (!response.data.success) {
    throw new Error(response.data.error || "Tạo Couple thất bại")
  }

  return response.data.data 
}

const coupleApi = {
  createCouple,
}

export default coupleApi
