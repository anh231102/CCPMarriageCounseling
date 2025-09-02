export interface NotificationSummaryResponse {
  unreadCount: number
  unopenedCount: number
  hasUnopenedInLast3Seconds: boolean
  unopenedList: NotificationItem[] // bạn có thể định nghĩa chi tiết nếu có cấu trúc item
}

export interface NotificationItem {
  // giả sử chưa biết chi tiết nên để any
  [key: string]: any
}

export interface MyNotificationsResponse {
  success: boolean
  data: Notification[]
  error: string | null
}

export interface Notification {
  id: string
  notiType: string
  description: string
  isRead: boolean
  isOpen: boolean
  docNo: string
  createBy: string
  createDate: string
  status: number
}

export enum NotiType {
  HoanThanhBooking = 1,
  MemberHuyBooking = 2,
  MemberBaoCao = 3,
  AdminDuyetBaoCao = 4,
  AdminKhongDongYBooking = 5,
  MemberNapTien = 7,
  GiaoDichThanhCong = 8,
  
  MemberNhanKetLuan = 10,

}

export const getNotiTypeLabel = (notiType: NotiType): string => {
  switch (notiType) {
    case NotiType.HoanThanhBooking:
      return "Buổi tư vấn đã hoàn thành"
    case NotiType.MemberHuyBooking:
      return "Buổi tư vấn đã bị hủy"
    case NotiType.MemberBaoCao:
      return "Buổi tư vấn đã bị báo cáo"
    case NotiType.AdminDuyetBaoCao:
      return "Báo cáo của bạn đã được duyệt"
    case NotiType.AdminKhongDongYBooking:
      return "Báo cáo của bạn không được duyệt"
    case NotiType.MemberNapTien:
      return "Bạn đã nạp tiền vào ví"
    case NotiType.GiaoDichThanhCong:
      return "Giao dịch thành công "
    case NotiType.MemberNhanKetLuan:
      return "Bạn đã nhận được Kết luận "
    default:
      return "Thông báo"
  }
}
