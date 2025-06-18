// src/config/types/membership.type.ts

export interface MemberShip {
  id: string
  memberShipName: string
  rank: number
  discountCourse: number
  discountBooking: number
  price: number
  expiryDate: number
  status: number
}
export interface MemberShipResponse {
  success: boolean ,
    data: MembershipStatus[],
    error: string | null
}

export interface MembershipStatus {
  memberShip: MemberShip
  expiredDate: string | null
  isActive: boolean
}

export interface BuyMembership {
  memberShipId: string
  memberId: string
  price: number
  remaining: number
  transactionId: string
  message: string
}
export interface BuyMembershipResponse {
  success: boolean
  data: BuyMembership
  error: string | null
}
