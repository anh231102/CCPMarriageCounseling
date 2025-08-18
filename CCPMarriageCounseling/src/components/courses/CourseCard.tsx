import { View, Text, Image, TouchableOpacity, Alert } from "react-native"
import { BookOpen, Gift, Star } from "lucide-react-native"
import type { Course } from "../../config/types/course.type"
import courseApi from "@/src/config/api/course.api"


interface CourseCardProps {
  course: Course
  onPress: (course: Course) => void
  onEnrollSuccess?: () => void
  ofMyCourses: string
  chapterCount?: number
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, onEnrollSuccess, ofMyCourses, chapterCount }) => {
  const showJoinButton = !course.isOpen
  const handleJoinCourse = async () => {
    try {
      await courseApi.putEnrollCourse(course.id)
      onEnrollSuccess?.()
      Alert.alert("Thành công", "Bạn đã ghi danh vào khóa học!")
      onPress(course) // chuyển trang hoặc cập nhật UI nếu cần

    } catch (err: any) {
      Alert.alert("Lỗi", err?.message || "Không thể ghi danh vào khóa học!")
    }
  }
  const getChapterCount = (course: Course) => {
    if (!course.chapters || course.chapters.length === 0) return 0
    // Chỉ lấy những chapter có status === 1
    const validChapters = course.chapters.filter(chap => chap.status === 1)
    const nums = validChapters.map(chap => chap.chapNum)
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0
    return maxNum
  }

  if (showJoinButton && course.isOpen != null) {
    // Trường hợp đã mua nhưng chưa enroll: chỉ hiện nút
    return (
      <View className="bg-white rounded-lg shadow-md overflow-hidden mb-4 mx-2">
        <Image
          source={{ uri: course.thumble || "/placeholder.svg?height=150&width=300&text=Course Image" }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-lg font-bold text-secondary-dark mb-1">{course.name}</Text>
          <View className="flex-row items-center mb-2">
            <Star size={16} color="#FFC107" fill="#FFC107" />
            <Text className="text-secondary-dark ml-1 text-sm">{course.rating?.toFixed(1) || 0}</Text>
            <Text className="text-gray-500 text-xs ml-1">({course.rank || 0} đánh giá)</Text>
          </View>
          <View className="flex-row items-center">
            <View className="bg-blue-50 p-1 rounded-lg mr-2">
              <BookOpen size={14} color="#3B82F6" />
            </View>
            <Text className="text-gray-600 text-sm flex-1">{getChapterCount(course)} chương học</Text>
          </View>
          <TouchableOpacity
            className="bg-primary rounded-lg py-2 mt-2 items-center"
            onPress={handleJoinCourse}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Tham gia khóa học</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (showJoinButton && ofMyCourses != "mycourses") {
    // Trường hợp chưa mua 
    return (
      <TouchableOpacity

        onPress={() => onPress(course)}

      >
        <View className="bg-white rounded-lg shadow-md overflow-hidden mb-4 mx-2">
          <Image
            source={{ uri: course.thumble || "/placeholder.svg?height=150&width=300&text=Course Image" }}
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="p-3">
            <Text className="text-lg font-bold text-secondary-dark mb-1">{course.name}</Text>
            <View className="flex-row items-center mb-2">
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text className="text-secondary-dark ml-1 text-sm">{course.rating?.toFixed(1) || 0}</Text>
              <Text className="text-gray-500 text-xs ml-1">({course.rank || 0} đánh giá)</Text>
            </View>
            <Text className="text-primary font-bold text-base">
              {course.price === 0 ? "Miễn phí" : `${course.price?.toLocaleString("vi-VN")}đ`}
            </Text>
            {course.freeByMembershipName && (
                  <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
                    <View className="flex-row items-center">
                      <View className="bg-green-100 p-2 rounded-xl mr-3">
                        <Gift size={18} color="#10B981" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-green-800 font-semibold text-sm">Ưu đãi thành viên</Text>
                        <Text className="text-green-700 text-sm">Miễn phí cho: {course.freeByMembershipName}</Text>
                      </View>
                    </View>
                  </View>
                )}
            <View className="flex-row items-center">
              <View className="bg-blue-50 p-1 rounded-lg mr-2">
                <BookOpen size={14} color="#3B82F6" />
              </View>
              <Text className="text-gray-600 text-sm flex-1">{getChapterCount(course)} chương học</Text>
            </View>
            <TouchableOpacity
              className="bg-primary rounded-lg py-2 mt-2 items-center"
              onPress={() => onPress(course)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">Tham gia khóa học</Text>
            </TouchableOpacity>
          </View>
        </View></TouchableOpacity>
    )
  }

  // Trường hợp đã enroll
  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4 mx-2"
      onPress={() => onPress(course)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: course.thumble || "/placeholder.svg?height=150&width=300&text=Course Image" }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-lg font-bold text-secondary-dark mb-1">{course.name}</Text>
        <View className="flex-row items-center mb-2">
          <Star size={16} color="#FFC107" fill="#FFC107" />
          <Text className="text-secondary-dark ml-1 text-sm">{course.rating?.toFixed(1) || 0}</Text>
          <Text className="text-gray-500 text-xs ml-1">({course.rank || 0} đánh giá)</Text>
        </View>

        <View className="flex-row items-center">
          <View className="bg-blue-50 p-1 rounded-lg mr-2">
            <BookOpen size={14} color="#3B82F6" />
          </View>
          <Text className="text-gray-600 text-sm flex-1">{getChapterCount(course)} chương học</Text>
        </View>

      </View>
    </TouchableOpacity>
  )
}