import axiosInstance from "./axiosInstance"
import type {
  NotificationSummaryResponse,
  MyNotificationsResponse,
  Notification,
} from "@/src/config/types/notification.type"

// lấy summary
const getNotificationSummary = async (): Promise<NotificationSummaryResponse> => {
  const response = await axiosInstance.get<NotificationSummaryResponse>("/Notification/summary")
  return response.data
}

// lấy danh sách thông báo
const getMyNotifications = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get<MyNotificationsResponse>("/Notification/my-notifications")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách thông báo")
  }

  return response.data.data
}

const notificationApi = {
  getNotificationSummary,
  getMyNotifications,
}

export default notificationApi
