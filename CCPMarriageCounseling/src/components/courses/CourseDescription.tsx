import type React from "react"
import { View, Text } from "react-native"

interface CourseDescriptionProps {
  description: string | null
}

export const CourseDescription: React.FC<CourseDescriptionProps> = ({ description }) => {
  if (!description) return null

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4 mx-4">
      
      <Text className="text-lg font-bold text-secondary-dark mb-2">Mô tả khóa học</Text>
      <Text className="text-secondary">{description}</Text>
    </View>
  )
}
