"use client"

import { View, Text, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import membershipApi from "../../config/api/membership.api"
import { MembershipStatus } from "../../config/types/membership.type"
import MembershipPlanList from "../../components/membership/MembershipPlanList"

const MembershipScreen = () => {
  const [membershipList, setMembershipList] = useState<MembershipStatus[]>([])
  const [currentMembership, setCurrentMembership] = useState<MembershipStatus | null>(null)

  const fetchMembershipStatus = async () => {
    try {
      const response = await membershipApi.getMyMembershipStatus()
      if (response.success && response.data.length > 0) {
        setMembershipList(response.data)
        const activePlan = response.data.find(item => item.isActive)
        setCurrentMembership(activePlan || null)
      } else {
        setMembershipList([])
        setCurrentMembership(null)
      }
    } catch (error) {
      console.error("Error fetching membership status", error)
    }
  }

  useEffect(() => {
    fetchMembershipStatus()
  }, [])

  const getRemainingDays = (expiredDate: string | null) => {
    if (!expiredDate) return 0
    const now = new Date()
    const end = new Date(expiredDate)
    const diffMs = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-2">Các gói bạn đã đăng ký</Text>

          {membershipList.filter(item => item.isActive).length === 0 ? (
            <Text className="text-secondary italic">
              👉 Bạn chưa có gói thành viên nào đang hoạt động.
            </Text>
          ) : (
            membershipList
              .filter(item => item.isActive)
              .map((item, index) => {
                const plan = item.memberShip
                const expiredDate = item.expiredDate
                const remainingDays = getRemainingDays(expiredDate)

                return (
                  <View key={index} className="mb-3 border-b border-gray-200 pb-3">
                    <View className="flex-row items-center mb-1">
                      <View className="w-3 h-3 rounded-full mr-2 bg-green-500" />
                      <Text className="text-secondary-dark font-medium">{plan.memberShipName}</Text>
                    </View>
                    <Text className="text-secondary">
                      Hạn sử dụng: {expiredDate ? new Date(expiredDate).toLocaleDateString("vi-VN") : "Không rõ"}
                    </Text>
                    <Text className="text-secondary">Còn lại: {remainingDays} ngày</Text>
                  </View>
                )
              })
          )}
        </View>

        <MembershipPlanList onBought={fetchMembershipStatus} />
      </View>
    </ScrollView>
  )
}

export default MembershipScreen
