// src/config/api/membership.api.ts

import { MemberShipResponse, BuyMembershipResponse } from "../types/membership.type"
import axiosInstance from "./axiosInstance"

// Lấy danh sách gói thành viên của người dùng
const getMyMembershipStatus = async (): Promise<MemberShipResponse> => {
  const res = await axiosInstance.get("/MemberShip/my-membership-status")
  return res.data
}

// Mua gói thành viên
const postBuyMembership = async (memberShipId: string): Promise<BuyMembershipResponse> => {
  const res = await axiosInstance.post("/MemberShip/buy", { memberShipId })
  return res.data
}

const membershipApi = {
  getMyMembershipStatus,
  postBuyMembership,
}

export default membershipApi
