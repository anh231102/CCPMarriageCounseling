import type React from "react"
import { View, Text } from "react-native"

interface CourseDescriptionProps {
  description: string | null
}

export const CourseDescription: React.FC<CourseDescriptionProps> = ({ description }) => {
  if (!description) return null

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4 mx-4">
      <Text className="text-lg font-bold text-secondary-dark mb-2">
        Mô tả khóa học
      </Text>
      <Text className="text-secondary mb-2">
        Chào mừng bạn đến với khóa học! Đây là chương trình được xây dựng bởi các
        chuyên gia, hướng tới việc nâng cao hiểu biết, kỹ năng giao tiếp và khả năng
        giải quyết vấn đề trong các mối quan hệ. Không chỉ cung cấp nền tảng kiến thức,
        khóa học còn tạo cơ hội để bạn thực hành và phát triển bản thân qua từng bài học.
      </Text>
      <Text className="text-secondary mb-2">
        Mục tiêu của khóa học là đồng hành cùng bạn trong việc xây dựng tư duy, kỹ năng
        và nền tảng vững chắc để kiến tạo những mối quan hệ bền chặt, hạnh phúc và thành công.
      </Text>
      <Text className="text-secondary">
        {description}
      </Text>
    </View>

  )
}
