import { Member } from "./member.type"
import { Counselor } from "./counselor.type"
import { SubCategory } from "./category.type"

export interface BookingRequest {
  counselorId: string
  timeStart: string
  timeEnd: string
  note: string
  subCategoryIds: string[]
}

export interface BookingResponse {
  success: boolean
  data: BookingData
  error: string | null
}

export interface BookingData {
  bookingId: string
  price: number
  remaining: number
  transactionId: string
  message: string
}

export interface BookingMemberResponse {
  success: boolean
  data: BookingMemberData[]
  error: string | null
}

export interface BookingMemberData {
  id: string
  memberId: string
  member2Id: string | null
  counselorId: string
  note: string
  timeStart: string
  timeEnd: string
  price: number
  cancelReason: string | null
  createAt: string
  rating: number | null
  feedback: string | null
  isCouple: boolean | null
  problemSummary: string | null
  problemAnalysis: string | null
  guides: string | null
  isReport: boolean | null
  reportMessage: string | null
  status: BookingStatus
  member: Member
  member2: Member | null
  counselor: Counselor
  subCategories: SubCategory[]
}

export enum BookingStatus {
  XacNhan = 1,
  HoanThanh = 2,
  DeXuatLichMoi = 3,
  ThanhVienHuy = 4,
  BaoCao = 5,
  HoanTien = 6,
  KetThuc = 7,
}

export const getBookingStatusLabel = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.XacNhan:
      return "Đã xác nhận"
    case BookingStatus.HoanThanh:
      return "Đã hoàn thành buổi tư vấn"
    case BookingStatus.DeXuatLichMoi:
      return "Đề xuất lịch mới"
    case BookingStatus.ThanhVienHuy:
      return "Thành viên đã hủy"
    case BookingStatus.BaoCao:
      return "Đã báo cáo"
    case BookingStatus.HoanTien:
      return "Hoàn tiền"
    case BookingStatus.KetThuc:
      return "Kết thúc"
    default:
      return "Không xác định"
  }
}

export interface RoomUrlResponse {
  success: boolean
  data: RoomUrlData
  error: string | null
}

export interface RoomUrlData {
  joinUrl: string
  roomName: string
  userName: string
}

export interface CancelBookingResponse {
  success: boolean
  data: string
  error: string | null
}
export interface ReportBookingRequest {
  bookingId: string
  reportMessage: string
}

export interface ReportBookingResponse {
  success: boolean
  data: string
  error: string | null
}

export interface RatingBookingRequest {
  bookingId: string
  rating: number
  feedback: string
}

export interface RatingBookingResponse {
  success: boolean
  data: string
  error: string | null
}
export interface FeedbackForCounselor {
  rating: number
  feedback: string
  timeEnd: string
  memberFullName: string
}

export interface FeedbackForCounselorResponse {
  success: boolean
  data: FeedbackForCounselor[]
  error: string | null
}

export interface BookingDiscountResponse {
  success: boolean
  data: number 
  error: string | null
}
