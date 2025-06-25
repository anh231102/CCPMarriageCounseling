import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { Star } from "lucide-react-native"
import bookingApi from "@/src/config/api/booking.api"
import type { FeedbackForCounselor } from "@/src/config/types/booking.type"

type Props = {
  counselorId: string
}

const CounselorFeedbackList = ({ counselorId }: Props) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackForCounselor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await bookingApi.getFeedbacksByCounselor(counselorId)
        setFeedbacks(data)
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [counselorId])

  if (loading) {
    return <Text className="text-secondary">Đang tải đánh giá...</Text>
  }

  if (feedbacks.length === 0) {
    return <Text className="text-secondary">Chưa có đánh giá</Text>
  }

  return (
    <>
      {feedbacks.map((item, index) => (
        <View key={index} className="bg-gray-50 rounded-lg p-3 mb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-medium text-secondary-dark">{item.memberFullName}</Text>
            <Text className="text-secondary text-xs">
              {new Date(item.timeEnd).toLocaleDateString("vi-VN")}
            </Text>
          </View>
          <View className="flex-row mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                color="#FFC107"
                fill={i < item.rating ? "#FFC107" : "transparent"}
              />
            ))}
          </View>
          <Text className="text-secondary">{item.feedback}</Text>
        </View>
      ))}
    </>
  )
}

export default CounselorFeedbackList
