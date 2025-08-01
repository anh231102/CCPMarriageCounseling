import type React from "react"
import { View, Text } from "react-native"
import { CheckCircle } from "lucide-react-native"

// Dummy data for learning outcomes as it's not in the CourseDetail type
const defaultLearningOutcomes = [
  "Các kỹ thuật giao tiếp hiệu quả với đối tác",
  "Cách lắng nghe chủ động và thấu hiểu",
  "Phương pháp giải quyết xung đột một cách xây dựng",
  "Cách thể hiện tình cảm và sự trân trọng",
]

interface CourseLearningOutcomesProps {
  outcomes?: string[]
}

export const CourseLearningOutcomes: React.FC<CourseLearningOutcomesProps> = ({
  outcomes = defaultLearningOutcomes,
}) => {
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4 mx-4">
      <Text className="text-lg font-bold text-secondary-dark mb-2">Bạn sẽ học được gì</Text>
      {outcomes.map((outcome, index) => (
        <View key={index} className="flex-row items-start mb-3">
          <CheckCircle size={18} color="#28A745" className="mt-0.5" />
          <View className="ml-3 flex-1">
            <Text className="text-secondary">{outcome}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}
