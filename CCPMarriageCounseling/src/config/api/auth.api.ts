import { LoginResponse, RegisterMemberRequest, RegisterMemberResponse } from "@/src/config/types/auth.types"
import axiosInstance from "./axiosInstance"

const loginMember = async (email: string, password: string): Promise<string> => {
  const response = await axiosInstance.post<LoginResponse>("/Account/login-member", {
    email,
    password,
  })

  const data = response.data

  if (!data.success) {
    throw new Error(data.error || "Đăng nhập thất bại")
  }

  return data.data 
}
const registerMember = async (payload: RegisterMemberRequest): Promise<number> => {
  const response = await axiosInstance.post<RegisterMemberResponse>(
    "/Account/register-member",
    payload
  )
 

  return response.data.data // Trả về 1 nếu thành công
}

const authApi = {
  loginMember,
  registerMember,
}

export default authApi