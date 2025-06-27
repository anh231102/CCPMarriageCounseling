import axiosInstance from "./axiosInstance"
import type { TransactionListResponse, TransactionType } from "@/src/config/types/transaction.type"

export const getMyTransactions = async (
  transactionType?: TransactionType,
  pageNumber = 1,
  pageSize = 10
) => {
  const params: Record<string, any> = {
    pageNumber,
    pageSize,
  }

  if (transactionType) {
    params.transactionType = transactionType
  }

  const response = await axiosInstance.get<TransactionListResponse>(
    "/SysTransaction/my-transactions",
    { params }
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách giao dịch")
  }

  return response.data.data
}
const transactionApi= {
  getMyTransactions,
}

export default transactionApi