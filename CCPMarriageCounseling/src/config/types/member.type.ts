export interface Member {
  id: string
  accountId: string
  fullname: string
  avatar: string | null
  phone: string | null
  dob: string | null
  mbti: string | null
  disc: string | null
  loveLanguage: string | null
  bigFive: string | null
  gender: string | null
  rec1: string | null
  rec2: string | null
  status: number
}

export interface MemberProfileResponse {
  success: boolean
  data: Partial<Member>
  error: string | null
}

export interface UpdateMemberProfileRequest {
  fullname?: string
  avatar?: string
  phone?: string
  dob?: string
  gender?: string
}

export interface UpdateMemberProfileResponse {
  success: boolean
  data: string
  error: string | null
}

export interface MemberSubcategoriesResponse {
  success: boolean
  data: string[]
  error: string | null
}
