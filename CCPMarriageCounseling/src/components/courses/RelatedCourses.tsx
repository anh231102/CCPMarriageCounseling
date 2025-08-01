import type React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { Star } from "lucide-react-native"
import type { Course } from "../../config/types/course.type"

interface RelatedCoursesProps {
  currentCourseId: string
  onPressCourse: (course: Course) => void
}

// Dummy data for related courses
const dummyRelatedCourses: Course[] = [
  {
    id: "course-002",
    name: "Kỹ năng lắng nghe chủ động",
    thumble: "/placeholder.svg?height=100&width=150&text=Related Course 1",
    description: "Học cách lắng nghe sâu sắc để thấu hiểu đối tác.",
    price: 199000,
    rating: 4.8,
    rank: 120,
    isEnrolled: false,
    freeByMembershipName: "null",
    chapters: [],
    subCategories: [],
  },
  {
    id: "course-003",
    name: "Quản lý cảm xúc trong hôn nhân",
    thumble: "/placeholder.svg?height=100&width=150&text=Related Course 2",
    description: "Kiểm soát cảm xúc để xây dựng mối quan hệ bền vững.",
    price: 249000,
    rating: 4.7,
    rank: 95,
    isEnrolled: false,
    freeByMembershipName: "null",
    chapters: [],
    subCategories: [],
  },
  {
    id: "course-004",
    name: "Xây dựng lòng tin và sự gắn kết",
    thumble: "/placeholder.svg?height=100&width=150&text=Related Course 3",
    description: "Các bước để củng cố lòng tin và sự gắn kết vợ chồng.",
    price: 0,
    rating: 4.9,
    rank: 150,
    isEnrolled: false,
    freeByMembershipName: "Premium",
    chapters: [],
    subCategories: [],
  },
]

export const RelatedCourses: React.FC<RelatedCoursesProps> = ({ currentCourseId, onPressCourse }) => {
  const filteredRelatedCourses = dummyRelatedCourses.filter((course) => course.id !== currentCourseId)

  if (filteredRelatedCourses.length === 0) return null

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4 mx-4">
      <Text className="text-lg font-bold text-secondary-dark mb-4">Các khóa học liên quan</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {filteredRelatedCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            onPress={() => onPressCourse(course)}
            className="w-40 mr-4 bg-gray-50 rounded-lg overflow-hidden shadow-sm"
          >
            <Image
              source={{ uri: course.thumble || "/placeholder.svg?height=80&width=120" }}
              className="w-full h-24"
              resizeMode="cover"
            />
            <View className="p-2">
              <Text className="font-bold text-sm text-secondary-dark mb-1" numberOfLines={2}>
                {course.name}
              </Text>
              <View className="flex-row items-center">
                <Star size={12} color="#FFC107" fill="#FFC107" />
                <Text className="text-secondary-dark ml-1 text-xs">{course.rating?.toFixed(1) || "N/A"}</Text>
              </View>
              <Text className="text-primary font-bold text-xs mt-1">
                {course.price === 0 ? "Miễn phí" : `${course.price?.toLocaleString("vi-VN")}đ`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}
