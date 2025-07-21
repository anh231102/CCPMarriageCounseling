// src/config/types/couple.type.ts
import { Member } from "./member.type"
import { Category } from "./category.type"
import { PersonType } from "./persontype.type"

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
  mbtiDescription?: string
  mbti1Description?: string
  discDescription?: string
  disc1Description?: string
  loveLanguageDescription?: string
  loveLanguage1Description?: string
  bigFiveDescription?: string
  bigFive1Description?: string
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
  mbtiDetail?: ResultDetail
  discDetail?: ResultDetail
  loveLanguageDetail?: ResultDetail
  bigFiveDetail?: ResultDetail
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
  Completed = 2,
}

export const getCoupleRoomStatusLabel = (status: CoupleRoomStatus): string => {
  switch (status) {
    case CoupleRoomStatus.Cancelled:
      return "Phòng đã hủy"
    case CoupleRoomStatus.Active:
      return "Đang hoạt động"
    case CoupleRoomStatus.Completed:
      return "Dã hoàn thành"
    default:
      return "Không xác định"
  }
}

export interface CoupleSurveyResultRequest {
  surveyId: string
  answers: {
    tag: string
    score: number
  }[]
}

export interface CoupleSurveyResultResponse {
  success: boolean
  data: string
  error: string | null
}
export interface PartnerProgressData {
  partnerTotalDone: number
  partnerTotalSurveys: number
  isPartnerDoneAll: boolean
  selfTotalDone: number
  selfTotalSurveys: number
  isSelfDoneAll: boolean
}

export interface PartnerProgressResponse {
  success: boolean
  data: PartnerProgressData
  error: string | null
}

export type PersonTypeWithCategory = Omit<PersonType, "scores"> & {
  category: Category | null
}

export interface ResultDetail {
  id: string
  surveyId: string
  categoryId: string
  personTypeId: string
  personType2Id: string
  description: string | null
  detail: string | null
  compatibility: number
  image: string | null
  createAt: string
  status: number
  category: Category
  personType: PersonTypeWithCategory
  personType2: PersonTypeWithCategory
}
export interface CoupleResultResponse {
  success: boolean
  data: Couple
  error: string | null
}

export interface CoupleHistoryResponse {
  success: boolean;
  data: Couple[];
  error: string | null;
}