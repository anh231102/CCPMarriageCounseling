// src/config/api/member.api.ts
import axiosInstance from "./axiosInstance"
import {
  Member,
  MemberProfileResponse,
  UpdateMemberProfileRequest,
  UpdateMemberProfileResponse,
} from "@/src/config/types/member.type"

const getMyProfile = async (): Promise<Partial<Member>> => {
  const response = await axiosInstance.get<MemberProfileResponse>("/Member/my-profile")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy thông tin hồ sơ")
  }

  return response.data.data
}

const updateMyProfile = async (payload: UpdateMemberProfileRequest): Promise<string> => {
  const response = await axiosInstance.put<UpdateMemberProfileResponse>("/Member/my-profile", payload)

  if (!response.data.success) {
    throw new Error(response.data.error || "Cập nhật hồ sơ thất bại")
  }

  return response.data.data // "Profile updated successfully."
}

const memberApi = {
  getMyProfile,
  updateMyProfile,
}

export default memberApi
