import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Clock, BookOpen, Award, Star, CheckCircle, Play } from "lucide-react-native"

const CourseDetailScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { course } = route.params

  const lessons = [
    { id: "1", title: "Giới thiệu về khóa học", duration: "10 phút", free: true },
    { id: "2", title: "Nguyên tắc giao tiếp cơ bản", duration: "25 phút", free: false },
    { id: "3", title: "Lắng nghe chủ động", duration: "30 phút", free: false },
    { id: "4", title: "Giao tiếp phi ngôn ngữ", duration: "20 phút", free: false },
    { id: "5", title: "Giải quyết xung đột", duration: "35 phút", free: false },
  ]

  const handleEnrollCourse = () => {
    // Xử lý đăng ký khóa học
    navigation.navigate("CourseContent", {
      id: course.id,
      title: course.title,
      course: course,
      lessons: lessons,
    })
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Image source={{ uri: course.image }} className="w-full h-48" />

      <View className="p-4">
        <Text className="text-2xl font-bold text-secondary-dark mb-2">{course.title}</Text>

        <View className="flex-row items-center mb-4">
          <Text className="text-secondary mr-4">{course.instructor}</Text>
          <View className="flex-row items-center">
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text className="text-secondary-dark ml-1 mr-1">{course.rating}</Text>
            <Text className="text-secondary text-xs">({course.students} học viên)</Text>
          </View>
        </View>

        <View className="flex-row mb-6">
          <View className="flex-row items-center mr-4">
            <Clock size={16} color="#6C757D" />
            <Text className="text-secondary ml-1">{course.duration}</Text>
          </View>
          <View className="flex-row items-center mr-4">
            <BookOpen size={16} color="#6C757D" />
            <Text className="text-secondary ml-1">{lessons.length} bài học</Text>
          </View>
          <View className="flex-row items-center">
            <Award size={16} color="#6C757D" />
            <Text className="text-secondary ml-1">{course.level}</Text>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-2">Mô tả khóa học</Text>
          <Text className="text-secondary">
            Khóa học này sẽ giúp bạn hiểu và áp dụng các nguyên tắc giao tiếp hiệu quả trong hôn nhân. Bạn sẽ học cách
            lắng nghe chủ động, thể hiện cảm xúc một cách lành mạnh, và giải quyết xung đột một cách xây dựng.
          </Text>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-2">Bạn sẽ học được gì</Text>

          <View className="flex-row items-start mb-3">
            <CheckCircle size={18} color="#28A745" className="mt-0.5" />
            <View className="ml-3 flex-1">
              <Text className="text-secondary">Các kỹ thuật giao tiếp hiệu quả với đối tác</Text>
            </View>
          </View>

          <View className="flex-row items-start mb-3">
            <CheckCircle size={18} color="#28A745" className="mt-0.5" />
            <View className="ml-3 flex-1">
              <Text className="text-secondary">Cách lắng nghe chủ động và thấu hiểu</Text>
            </View>
          </View>

          <View className="flex-row items-start mb-3">
            <CheckCircle size={18} color="#28A745" className="mt-0.5" />
            <View className="ml-3 flex-1">
              <Text className="text-secondary">Phương pháp giải quyết xung đột một cách xây dựng</Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <CheckCircle size={18} color="#28A745" className="mt-0.5" />
            <View className="ml-3 flex-1">
              <Text className="text-secondary">Cách thể hiện tình cảm và sự trân trọng</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Nội dung khóa học</Text>

          {lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => {
                if (lesson.free) {
                  navigation.navigate("CourseContent", {
                    id: course.id,
                    title: course.title,
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                  })
                } else {
                  // Hiển thị thông báo cần đăng ký khóa học
                }
              }}
              className="flex-row items-center mb-3 last:mb-0"
            >
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Play size={16} color={lesson.free ? "#E83E8C" : "#6C757D"} />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark">
                  {index + 1}. {lesson.title}
                </Text>
                <Text className="text-secondary text-xs">{lesson.duration}</Text>
              </View>
              {lesson.free && <Text className="text-success text-xs font-medium">Xem thử</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleEnrollCourse} className="bg-primary rounded-lg p-4 items-center mb-4">
          <Text className="text-white font-bold text-lg">
            {course.price === "Miễn phí" ? "Tham gia khóa học" : `Đăng ký - ${course.price}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default CourseDetailScreen
