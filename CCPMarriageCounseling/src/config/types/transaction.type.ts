export interface Transaction {
  id: string
  transactionType: TransactionType
  docNo: string
  amount: number
  createDate: string
  description: string
}

export interface TransactionListResponse {
  success: boolean
  data: {
    items: Transaction[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
  }
  error: string | null
}

export enum TransactionType {
  Booking = "1",
  Refund50 = "2",
  Refund100 = "3",
  BuyCourse = "4",
  BuyMembership = "5",
  RefundCourse = "6",
  CounselorEarn = "7",
  Withdraw = "8",
}

export const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.Booking:
      return "Thanh toán buổi tư vấn"
    case TransactionType.Refund50:
      return "Hoàn tiền 50% tư vấn"
    case TransactionType.Refund100:
      return "Hoàn tiền 100% tư vấn"
    case TransactionType.BuyCourse:
      return "Mua khóa học"
    case TransactionType.BuyMembership:
      return "Mua thành viên"
    case TransactionType.RefundCourse:
      return "Hoàn tiền khóa học"
    case TransactionType.CounselorEarn:
      return "Tư vấn viên nhận tiền"
    case TransactionType.Withdraw:
      return "Rút tiền"
    default:
      return "Không xác định"
  }
}
