import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Star, ArrowRight } from "lucide-react-native"

const CourseRecommendationScreen = () => {
  const navigation = useNavigation<any>()

  // Giả lập dữ liệu khóa học đề xuất
  const recommendedCourses = [
    {
      id: "1",
      title: "Giao tiếp hiệu quả trong hôn nhân",
      instructor: "TS. Nguyễn Thị A",
      level: "Cơ bản",
      duration: "4 tuần",
      rating: 4.8,
      students: 1245,
      image: "https://placeholder.svg?height=200&width=300",
      price: "Miễn phí",
      reason: "Dựa trên kết quả MBTI của bạn (ENFJ)",
    },
    {
      id: "3",
      title: "Xây dựng sự tin tưởng và thân mật",
      instructor: "TS. Lê Thị C",
      level: "Nâng cao",
      duration: "5 tuần",
      rating: 4.9,
      students: 1532,
      image: "https://placeholder.svg?height=200&width=300",
      price: "399.000đ",
      reason: "Phù hợp với ngôn ngữ tình yêu của bạn",
    },
    {
      id: "2",
      title: "Quản lý xung đột trong mối quan hệ",
      instructor: "ThS. Trần Văn B",
      level: "Trung cấp",
      duration: "6 tuần",
      rating: 4.7,
      students: 987,
      image: "https://placeholder.svg?height=200&width=300",
      price: "299.000đ",
      reason: "Đề xuất dựa trên lĩnh vực cần cải thiện",
    },
  ]

  const handleCoursePress = (course: any) => {
    navigation.navigate("CourseDetail", {
      id: course.id,
      title: course.title,
      course: course,
    })
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-secondary-dark text-base mb-6">
        Dựa trên kết quả khảo sát và sở thích của bạn, chúng tôi đề xuất các khóa học sau:
      </Text>

      {recommendedCourses.map((course) => (
        <View key={course.id} className="bg-black rounded-lg shadow-sm mb-6 overflow-hidden">
          <Image source={{ uri: course.image }} className="w-full h-40" />
          <View className="p-4">
            <Text className="text-secondary-dark font-bold text-base mb-1">{course.title}</Text>
            <Text className="text-secondary mb-2">{course.instructor}</Text>

            <View className="flex-row items-center mb-2">
              <View className="flex-row items-center">
                <Star size={14} color="#FFC107" fill="#FFC107" />
                <Text className="text-secondary-dark ml-1 mr-2">{course.rating}</Text>
              </View>
              <Text className="text-secondary text-xs">({course.students} học viên)</Text>
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row">
                <Text className="text-secondary mr-3">{course.level}</Text>
                <Text className="text-secondary">{course.duration}</Text>
              </View>
              <Text className="text-primary font-bold">{course.price}</Text>
            </View>

            <View className="bg-primary/10 p-3 rounded-lg mb-3">
              <Text className="text-primary">
                <Text className="font-bold">Lý do đề xuất: </Text>
                {course.reason}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleCoursePress(course)}
              className="flex-row items-center justify-center"
            >
              <Text className="text-primary font-medium mr-1">Xem chi tiết</Text>
              <ArrowRight size={16} color="#E83E8C" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => navigation.navigate("CourseList")}
        className="bg-secondary/10 rounded-lg p-4 items-center mb-6"
      >
        <Text className="text-secondary-dark font-medium">Xem tất cả khóa học</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default CourseRecommendationScreen
