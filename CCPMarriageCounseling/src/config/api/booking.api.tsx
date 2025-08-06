import axiosInstance from "./axiosInstance"
import type {
  BookingRequest,
  BookingResponse,
  BookingData,
  BookingMemberResponse,
  BookingMemberData,
  RoomUrlData,
  RoomUrlResponse,
  CancelBookingResponse,
  ReportBookingRequest,
  ReportBookingResponse,
  RatingBookingRequest,
  RatingBookingResponse,
  FeedbackForCounselor,
  FeedbackForCounselorResponse,
  BookingDiscountResponse,
  BookingInvitationsResponse,
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  AssignMember2Response,
  CancelInvitationResponse,
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
const getRoomUrl = async (bookingId: string): Promise<RoomUrlData> => {
  const response = await axiosInstance.get<RoomUrlResponse>(
    `/Booking/${bookingId}/GetRoomUrl`
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy đường dẫn phòng tư vấn")
  }

  return response.data.data
}

const cancelBookingByMember = async (bookingId: string): Promise<string> => {
  const response = await axiosInstance.put<CancelBookingResponse>(
    `/Booking/${bookingId}/member-cancel`,
    { bookingId }
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể hủy lịch hẹn")
  }

  return response.data.data
}
const reportBooking = async (
  payload: ReportBookingRequest
): Promise<string> => {
  const response = await axiosInstance.put<ReportBookingResponse>(
    "/Booking/report",
    payload
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể gửi báo cáo")
  }

  return response.data.data
}

const rateBooking = async (
  payload: RatingBookingRequest
): Promise<string> => {
  const response = await axiosInstance.put<RatingBookingResponse>(
    "/Booking/rating",
    payload
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể gửi đánh giá")
  }

  return response.data.data 
}

const getFeedbacksByCounselor = async (
  counselorId: string
): Promise<FeedbackForCounselor[]> => {
  const response = await axiosInstance.get<FeedbackForCounselorResponse>(
    `/Booking/feedbacks/${counselorId}`
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy phản hồi của counselor")
  }

  return response.data.data
}

const getMyBookingDiscount = async (): Promise<number> => {
  const response = await axiosInstance.get<BookingDiscountResponse>("/Booking/my-booking-discount")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy mức giảm giá")
  }

  return response.data.data 
}

const getBookingInvitations = async (): Promise<BookingMemberData[]> => {
  const response = await axiosInstance.get<BookingInvitationsResponse>("/Booking/invitations")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy lời mời đặt lịch")
  }

  return response.data.data
}

const postAcceptInvitation = async (bookingId: string): Promise<string> => {
  const response = await axiosInstance.post<AcceptInvitationResponse>(
    `/Booking/accept-invitation?bookingId=${bookingId}`,
    { bookingId }
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể chấp nhận lời mời")
  }

  return response.data.data
}

const postDeclineInvitation = async (bookingId: string): Promise<string> => {
  const response = await axiosInstance.post<DeclineInvitationResponse>(
    `/Booking/decline-invitation?bookingId=${bookingId}`,
    { bookingId }
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể từ chối lời mời")
  }

  return response.data.data
}

export const putAssignMember2 = async (bookingId: string, memberCode: string): Promise<AssignMember2Response> => {
  const response = await axiosInstance.put("/Booking/assign-member2", null, {
    params: {
      bookingId,
      memberCode
    }
  });
  return response.data;
};


export const postCancelInvitation = async (bookingId: string): Promise<string> => {
  const response = await axiosInstance.post<CancelInvitationResponse>(
    `/Booking/cancel-invitation?bookingId=${bookingId}`
  )
  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể hủy lời mời")
  }
  return response.data.data
}



const bookingApi = {
  postBooking,
  getMyBookings,
  getRoomUrl,
  cancelBookingByMember,
  reportBooking,
  rateBooking,
  getFeedbacksByCounselor,
  getMyBookingDiscount,
  getBookingInvitations,
  postAcceptInvitation,
  postDeclineInvitation,
  putAssignMember2,
  postCancelInvitation,
}

export default bookingApi
