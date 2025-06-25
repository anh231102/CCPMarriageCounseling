import { View, Text } from "react-native"
import { Heart, TrendingUp, TrendingDown, Minus } from "lucide-react-native"

interface ComparisonChartProps {
  title: string
  userScore: number
  partnerScore: number
  userName: string
  partnerName: string
  maxScore?: number
  description?: string
}

const ComparisonChart = ({
  title,
  userScore,
  partnerScore,
  userName,
  partnerName,
  maxScore = 5,
  description,
}: ComparisonChartProps) => {
  const userPercentage = (userScore / maxScore) * 100
  const partnerPercentage = (partnerScore / maxScore) * 100
  const difference = Math.abs(userScore - partnerScore)
  const compatibility = Math.max(0, 100 - (difference / maxScore) * 100)

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-primary"
    if (score >= 40) return "text-warning"
    return "text-danger"
  }

  const getCompatibilityIcon = () => {
    if (compatibility >= 80) return <TrendingUp size={16} color="#28A745" />
    if (compatibility >= 40) return <Minus size={16} color="#FFC107" />
    return <TrendingDown size={16} color="#DC3545" />
  }

  return (
    <View className="bg-white rounded-xl p-5 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-secondary-dark">{title}</Text>
        <View className="flex-row items-center">
          {getCompatibilityIcon()}
          <Text className={`ml-1 font-bold ${getCompatibilityColor(compatibility)}`}>
            {Math.round(compatibility)}%
          </Text>
        </View>
      </View>

      {description && (
        <Text className="text-secondary text-sm mb-4">{description}</Text>
      )}

      {/* User Score */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary-dark font-medium">{userName}</Text>
          <Text className="text-secondary-dark font-bold">{userScore}/{maxScore}</Text>
        </View>
        <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${userPercentage}%` }}
          />
        </View>
      </View>

      {/* Partner Score */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary-dark font-medium">{partnerName}</Text>
          <Text className="text-secondary-dark font-bold">{partnerScore}/{maxScore}</Text>
        </View>
        <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-secondary rounded-full"
            style={{ width: `${partnerPercentage}%` }}
          />
        </View>
      </View>

      {/* Compatibility Analysis */}
      <View className="bg-gray-50 rounded-lg p-3">
        <View className="flex-row items-center mb-2">
          <Heart size={16} color="#E83E8C" />
          <Text className="text-secondary-dark font-medium ml-2">Phân tích tương thích</Text>
        </View>
        <Text className="text-secondary text-sm">
          {compatibility >= 80
            ? "Rất tương thích! Cả hai có quan điểm tương đồng về vấn đề này."
            : compatibility >= 60
              ? "Tương thích tốt. Có một số khác biệt nhỏ nhưng có thể dễ dàng hòa hợp."
              : compatibility >= 40
                ? "Tương thích trung bình. Cần thảo luận và hiểu nhau hơn về vấn đề này."
                : "Có sự khác biệt lớn. Đây có thể là điểm cần chú ý và cải thiện trong mối quan hệ."}
        </Text>
      </View>
    </View>
  )
}

export default ComparisonChart
