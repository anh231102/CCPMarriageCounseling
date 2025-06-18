import axiosInstance from "./axiosInstance"
import type {
  BookingRequest,
  BookingResponse,
  BookingData,
  BookingMemberResponse,
  BookingMemberData,
} from "@/src/config/types/booking.type"

const postBooking = async (bookingData: BookingRequest): Promise<BookingData> => {
  const response = await axiosInstance.post<BookingResponse>("/Booking/book", bookingData)

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể đặt lịch hẹn")
  }

  return response.data.data
}

const getMyBookings = async (): Promise<BookingMemberData[]> => {
  const response = await axiosInstance.get<BookingMemberResponse>("/Booking/my-bookings/member")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách lịch hẹn")
  }

  return response.data.data
}

const bookingApi = {
  postBooking,
  getMyBookings,
}

export default bookingApi
