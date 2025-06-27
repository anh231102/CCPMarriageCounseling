import axiosInstance from "./axiosInstance"
import type { WalletBalanceResponse, WalletBalanceData } from "@/src/config/types/account.type"

const getWalletBalance = async (): Promise<WalletBalanceData> => {
  const response = await axiosInstance.get<WalletBalanceResponse>("/Account/wallet-balance")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy số dư ví")
  }

  return response.data.data
}

const accountApi = {
  getWalletBalance,
}

export default accountApi
