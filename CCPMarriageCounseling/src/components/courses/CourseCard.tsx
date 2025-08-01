import { View, Text, Image, TouchableOpacity, Alert } from "react-native"
import { Star } from "lucide-react-native"
import type { Course } from "../../config/types/course.type"
import courseApi from "@/src/config/api/course.api"


interface CourseCardProps {
  course: Course
  onPress: (course: Course) => void
  onEnrollSuccess?: () => void
  ofMyCourses: string
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, onEnrollSuccess, ofMyCourses }) => {
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
            <Text className="text-secondary-dark ml-1 text-sm">{course.rating?.toFixed(1) || "N/A"}</Text>
            <Text className="text-gray-500 text-xs ml-1">({course.rank || 0} đánh giá)</Text>
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
            <Text className="text-secondary-dark ml-1 text-sm">{course.rating?.toFixed(1) || "N/A"}</Text>
            <Text className="text-gray-500 text-xs ml-1">({course.rank || 0} đánh giá)</Text>
          </View>
          <TouchableOpacity
            className="bg-primary rounded-lg py-2 mt-2 items-center"
            onPress={() => onPress(course)}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Tham gia khóa học</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Các trường hợp còn lại: cả card là TouchableOpacity
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
          <Text className="text-secondary-dark ml-1 text-sm">{course.rating?.toFixed(1) || "N/A"}</Text>
          <Text className="text-gray-500 text-xs ml-1">({course.rank || 0} đánh giá)</Text>
        </View>
        {(course.isEnrolled || course.isBuy) && (
          <>
            <Text className="text-primary font-bold text-base">
              {course.price === 0 ? "Miễn phí" : `${course.price?.toLocaleString("vi-VN")}đ`}
            </Text>
            <Text className="text-primary text-base">
              Miễn phí cho người đã đăng ký: {course.freeByMembershipName}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}