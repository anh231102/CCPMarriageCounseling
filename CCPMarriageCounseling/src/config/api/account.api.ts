import axiosInstance from "./axiosInstance"
import type { WalletBalanceResponse, WalletBalanceData, ChangePasswordRequest, ChangePasswordResponse } from "@/src/config/types/account.type"

const getWalletBalance = async (): Promise<WalletBalanceData> => {
  const response = await axiosInstance.get<WalletBalanceResponse>("/Account/wallet-balance")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy số dư ví")
  }

  return response.data.data
}

const putChangePassword = async (body: ChangePasswordRequest): Promise<string> => {
  const response = await axiosInstance.put<ChangePasswordResponse>("/Account/change-password", body)

  if (!response.data.success) {
    console.error(response.data.error || "Không thể đổi mật khẩu")
    throw new Error(response.data.error || "Không thể đổi mật khẩu")
  }

  return response.data.data || "Đổi mật khẩu thành công"
}




const accountApi = {
  getWalletBalance,
  putChangePassword,
}

export default accountApi
