"use client"

import { View, Text, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { UserPlus, Heart, CheckCircle } from "lucide-react-native"

import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"

const SurveyListScreen = () => {
  const navigation = useNavigation<any>()
  const { isAuth } = useAuth()

  // Giả lập tiến trình khảo sát của người dùng
  const userProgress = {
    isCompleted: false, // Đã hoàn thành cả 4 phần chưa
    completedSections: 0, // Số phần đã hoàn thành (0-4)
    lastCompletedDate: null,
  }

  const surveySections = [
    {
      id: "mbti",
      title: "MBTI - Myers-Briggs",
      description: "Khám phá 16 loại tính cách và cách bạn tương tác với thế giới",
      icon: "🧠",
      questions: 20,
      time: "8-10 phút",
    },
    {
      id: "disc",
      title: "DISC - Phong cách hành vi",
      description: "Phân tích phong cách làm việc và giao tiếp của bạn",
      icon: "⚡",
      questions: 16,
      time: "6-8 phút",
    },
    {
      id: "love-language",
      title: "Love Languages - Ngôn ngữ tình yêu",
      description: "Hiểu cách bạn và đối tác thể hiện và cảm nhận tình yêu",
      icon: "💕",
      questions: 15,
      time: "5-7 phút",
    },
    {
      id: "big-five",
      title: "Big Five - Năm yếu tố tính cách",
      description: "Đánh giá 5 khía cạnh chính của tính cách con người",
      icon: "🌟",
      questions: 25,
      time: "10-12 phút",
    },
  ]

  const handleStartAssessment = () => {
    if (isAuth) {
      navigation.navigate("SurveyDetail")
    } else {
      navigation.navigate("Auth", { screen: "Login" })
    }
  }

  const handleViewLoveMap = () => {
    navigation.navigate("LoveMap")
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary p-6">
        <Text className="text-white text-2xl font-bold mb-1">Khảo sát tổng hợp</Text>
        <Text className="text-white/90">Đánh giá toàn diện mối quan hệ của bạn</Text>
      </View>

      <ScrollView className="flex-1 px-4 -mt-4" showsVerticalScrollIndicator={false}>
        {!isAuth && (
          <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <UserPlus size={24} color="#E83E8C" />
              <Text className="text-primary font-bold text-lg ml-2">Đăng nhập để bắt đầu</Text>
            </View>
            <Text className="text-secondary-dark mb-4">
              Đăng nhập để thực hiện bộ khảo sát tổng hợp và nhận phân tích chi tiết về mối quan hệ của bạn.
            </Text>
            <CustomButton onPress={() => navigation.navigate("Auth", { screen: "Login" })} className="bg-primary">
              <Text className="text-white font-medium">Đăng nhập ngay</Text>
            </CustomButton>
          </View>
        )}

        {/* Main Assessment Card */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <View className="items-center mb-6">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Heart size={32} color="#E83E8C" />
            </View>
            <Text className="text-2xl font-bold text-secondary-dark text-center">Bộ khảo sát tổng hợp</Text>
            <Text className="text-secondary text-center mt-2">
              Hoàn thành 4 phần đánh giá để nhận bản đồ tình yêu chi tiết
            </Text>
          </View>

          {/* Progress */}
          {isAuth && (
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-secondary-dark font-medium">Tiến trình</Text>
                <Text className="text-secondary">{userProgress.completedSections}/4 phần hoàn thành</Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(userProgress.completedSections / 4) * 100}%` }}
                />
              </View>
            </View>
          )}

          {/* Survey Sections */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Các phần đánh giá</Text>
            <View className="space-y-3">
              {surveySections.map((section, index) => (
                <View key={section.id} className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                  <View className="bg-white rounded-full p-2 mr-3">
                    <Text className="text-lg">{section.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-secondary-dark">{section.title}</Text>
                    <Text className="text-secondary text-sm">{section.description}</Text>
                    <Text className="text-secondary text-xs">
                      {section.questions} câu hỏi • {section.time}
                    </Text>
                  </View>
                  {userProgress.completedSections > index && <CheckCircle size={20} color="#28A745" />}
                </View>
              ))}
            </View>
          </View>

          {/* Total Time */}
          <View className="bg-primary/5 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-secondary-dark font-medium">Tổng thời gian</Text>
                <Text className="text-secondary text-sm">Ước tính hoàn thành</Text>
              </View>
              <Text className="text-primary font-bold text-lg">30-40 phút</Text>
            </View>
          </View>

          {/* Action Button */}
          {userProgress.isCompleted ? (
            <CustomButton onPress={handleViewLoveMap} className="bg-success">
              <Text className="text-white font-bold text-center">Xem bản đồ tình yêu</Text>
            </CustomButton>
          ) : (
            <CustomButton onPress={handleStartAssessment} className="bg-primary">
              <Text className="text-white font-bold text-center">
                {userProgress.completedSections > 0 ? "Tiếp tục khảo sát" : "Bắt đầu khảo sát"}
              </Text>
            </CustomButton>
          )}
        </View>

        {/* Benefits */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Lợi ích khi hoàn thành</Text>
          <View className="space-y-3">
            <View className="flex-row items-start">
              <View className="bg-success/10 rounded-full p-2 mt-0.5 mr-3">
                <CheckCircle size={16} color="#28A745" />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark font-medium">Bản đồ tình yêu chi tiết</Text>
                <Text className="text-secondary text-sm">
                  Phân tích tổng hợp về tính cách, ngôn ngữ tình yêu, tài chính và giao tiếp
                </Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <View className="bg-success/10 rounded-full p-2 mt-0.5 mr-3">
                <CheckCircle size={16} color="#28A745" />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark font-medium">Điểm tương thích tổng hợp</Text>
                <Text className="text-secondary text-sm">Đánh giá mức độ phù hợp dựa trên 4 khía cạnh quan trọng</Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <View className="bg-success/10 rounded-full p-2 mt-0.5 mr-3">
                <CheckCircle size={16} color="#28A745" />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark font-medium">Lời khuyên cá nhân hóa</Text>
                <Text className="text-secondary text-sm">Gợi ý cụ thể để cải thiện và phát triển mối quan hệ</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default SurveyListScreen
