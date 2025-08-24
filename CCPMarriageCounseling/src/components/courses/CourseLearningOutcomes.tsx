import type React from "react"
import { View, Text } from "react-native"
import { CheckCircle } from "lucide-react-native"
import type { SubCategory } from "@/src/config/types/course.type"

interface CourseLearningOutcomesProps {
  subCategories?: SubCategory[]
}

export const CourseLearningOutcomes: React.FC<CourseLearningOutcomesProps> = ({
  subCategories = [],
}) => {
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4 mx-4">
      <Text className="text-lg font-bold text-secondary-dark mb-2">Bạn sẽ học được gì</Text>
      <Text className="text-secondary mb-2">Các kỹ năng bạn sẽ nhận được khi tham gia khóa học:</Text>
      {subCategories.length === 0 ? (
        <Text className="text-secondary">Chưa có thông tin chuyên mục chi tiết.</Text>
      ) : (
        subCategories.map((sub, index) => (
          <View key={sub.id || index} className="flex-row items-start mb-3">
            <CheckCircle size={18} color="#28A745" className="mt-0.5" />
            <View className="ml-3 flex-1">
              <Text className="text-secondary">{sub.name}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  )
}