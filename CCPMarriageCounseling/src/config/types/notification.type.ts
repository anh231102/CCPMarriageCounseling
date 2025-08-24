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