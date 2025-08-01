import type React from "react"
import { View, Text } from "react-native"
import { Star } from "lucide-react-native"

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

// Dummy data for reviews
const dummyReviews: Review[] = [
  {
    id: "1",
    userName: "Nguyễn Văn A",
    rating: 5,
    comment: "Khóa học rất hay và bổ ích, giúp tôi cải thiện giao tiếp rất nhiều!",
    date: "2023-10-26",
  },
  {
    id: "2",
    userName: "Trần Thị B",
    rating: 4,
    comment: "Nội dung dễ hiểu, giảng viên nhiệt tình. Rất đáng tiền!",
    date: "2023-11-15",
  },
  {
    id: "3",
    userName: "Lê Văn C",
    rating: 5,
    comment: "Tuyệt vời! Tôi đã áp dụng được nhiều điều vào cuộc sống hôn nhân.",
    date: "2023-12-01",
  },
]

export const CourseReviews: React.FC = () => {
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i <= rating ? "#FFC107" : "#E0E0E0"}
          fill={i <= rating ? "#FFC107" : "#E0E0E0"}
          className="mr-0.5"
        />,
      )
    }
    return <View className="flex-row">{stars}</View>
  }

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4 mx-4">
      <Text className="text-lg font-bold text-secondary-dark mb-4">Đánh giá khóa học</Text>
      {dummyReviews.length === 0 ? (
        <Text className="text-secondary text-center">Chưa có đánh giá nào cho khóa học này.</Text>
      ) : (
        dummyReviews.map((review) => (
          <View key={review.id} className="border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-bold text-secondary-dark">{review.userName}</Text>
              <Text className="text-gray-500 text-xs">{review.date}</Text>
            </View>
            <View className="mb-1">{renderStars(review.rating)}</View>
            <Text className="text-secondary">{review.comment}</Text>
          </View>
        ))
      )}
    </View>
  )
}
