// src/config/types/couple.type.ts
import { Member } from "./member.type"

export interface CreateCoupleResponse {
  success: boolean
   data: string | null 
  error: string | null
}

export interface Couple {
  id: string
  isOwned: boolean
  member: Member
  member1: Member
  mbti: string | null
  disc: string | null
  loveLanguage: string | null
  bigFive: string | null
  mbti1: string | null
  disc1: string | null
  loveLanguage1: string | null
  bigFive1: string | null
  mbtiResult: string | null
  discResult: string | null
  loveLanguageResult: string | null
  bigFiveResult: string | null
  isVirtual: boolean | null
  virtualName: string | null
  virtualDob: string | null
  createAt: string
  rec1: string | null
  rec2: string | null
  status: number
  accessCode: string
}

export interface GetLatestCoupleResponse {
  success: boolean
  data: Couple
  error: string | null
}

export interface JoinCoupleRequest {
  accessCode: string
}

export interface JoinCoupleResponse {
  success: boolean
  data: string 
  error: string | null
}


export interface CancelCoupleResponse {
  success: boolean
  data: null
  error: string | null
}

export enum CoupleRoomStatus {
  Cancelled = 0,
  Active = 1,
}

export const getCoupleRoomStatusLabel = (status: CoupleRoomStatus): string => {
  switch (status) {
    case CoupleRoomStatus.Cancelled:
      return "Phòng đã hủy"
    case CoupleRoomStatus.Active:
      return "Đang hoạt động"
    default:
      return "Không xác định"
  }
}
