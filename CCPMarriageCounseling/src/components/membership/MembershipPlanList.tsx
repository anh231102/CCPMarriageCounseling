import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native"
import membershipApi from "@/src/config/api/membership.api"
import { MembershipStatus } from "@/src/config/types/membership.type"
import { useNavigation } from "@react-navigation/native"
import { CheckCircle, AlertCircle, Info, DollarSign } from "lucide-react-native"
import Loading from "@/src/components/share/Loading"
import OverlayLoading from "@/src/components/share/OverlayLoading"

interface Props {
  onBought?: () => void
}

const MembershipPlanList = ({ onBought }: Props) => {
  const [membershipList, setMembershipList] = useState<MembershipStatus[]>([])
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<any>()

  const fetchMembershipList = async () => {
    try {
      setLoading(true)
      const response = await membershipApi.getMyMembershipStatus()
      if (response.success) {
        setMembershipList(response.data)
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembershipList()
  }, [])

  const getRemainingDays = (expiredDate: string | null) => {
    if (!expiredDate) return 0
    const now = new Date()
    const end = new Date(expiredDate)
    const diffMs = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleBuyPlan = async (plan: any) => {
    Alert.alert(
      "🛒 Mua gói thành viên",
      `Bạn muốn mua gói ${plan.memberShipName} với giá ${plan.price.toLocaleString("vi-VN")}đ?`,
      [
        { text: "❌ Hủy", style: "cancel" },
        {
          text: "✅ Đồng ý",
          onPress: async () => {
            try {
              setLoading(true)
              const response = await membershipApi.postBuyMembership(plan.id)
              Alert.alert(
                "🎉 Thành công",
                `Bạn đã mua gói ${plan.memberShipName} thành công!`
              )
              onBought?.()
              fetchMembershipList()
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.error || "Đã xảy ra lỗi khi mua gói."
              Alert.alert(
                "⚠️ Lỗi",
                errorMessage,
                [
                  {
                    text: "💳 Nạp tiền vào ví",
                    onPress: () => navigation.navigate("Wallet"),
                  },
                  { text: "Đóng", style: "cancel" },
                ]
              )
            } finally {
              setLoading(false)
            }
          },
        },
      ]
    )
  }

  if (loading && membershipList.length === 0) {
    return <Loading size={50} />
  }

  return (
    <View>
      <Text className="text-lg font-bold text-secondary-dark mb-3">✨ Các gói thành viên</Text>
      {membershipList.map((item) => {
        const plan = item.memberShip
        const isCurrentPlan = item.isActive

        return (
          <View
            key={plan.id}
            className={`bg-white rounded-lg shadow-sm mb-4 overflow-hidden ${isCurrentPlan ? "border-2 border-primary" : ""}`}
          >
            {isCurrentPlan && (
              <View className="bg-primary py-1 px-3">
                <Text className="text-white text-center font-medium">🌟 Gói hiện tại</Text>
              </View>
            )}

            <View className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-bold text-secondary-dark">{plan.memberShipName}</Text>
                <Text className="text-primary font-bold">
                  {plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString("vi-VN")}đ/tháng`}
                </Text>
              </View>

              <View className="mb-4 space-y-2">
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#28A745" className="mr-2" />
                  <Text className="text-secondary ml-2">Giảm {plan.discountCourse}% học phí</Text>
                </View>
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#28A745" className="mr-2" />
                  <Text className="text-secondary ml-2">Giảm {plan.discountBooking}% phí tư vấn</Text>
                </View>
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#28A745" className="mr-2" />
                  <Text className="text-secondary ml-2">Miễn phí cho các khóa học dành riêng cho gói thành viên </Text>
                </View>
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#28A745" className="mr-2" />
                  <Text className="text-secondary ml-2">Thời hạn: {plan.expiryDate} ngày</Text>
                </View>
              </View>

              <TouchableOpacity
                disabled={isCurrentPlan}
                onPress={() => handleBuyPlan(plan)}
                className={`rounded-lg p-3 items-center ${isCurrentPlan ? "bg-gray-400" : plan.price === 0 ? "bg-secondary" : "bg-primary"}`}
              >
                <Text className="text-white font-medium">
                  {isCurrentPlan ? " Gói đã mua" : plan.price === 0 ? "Gói miễn phí" : "Mua gói"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
      {loading && membershipList.length > 0 && <OverlayLoading />}
    </View>
  )
}

export default MembershipPlanList
