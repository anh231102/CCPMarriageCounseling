"use client"

import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Clock, HelpCircle, Award, ArrowRight, ArrowLeft, Heart } from "lucide-react-native"

import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"

const SurveyDetailScreen = () => {
  const navigation = useNavigation<any>()
 

  const surveyDetails = {
    title: "Bộ khảo sát tổng hợp tính cách & mối quan hệ",
    totalQuestions: 76,
    totalTime: "30-40 phút",
    sections: [
      {
        name: "MBTI - Myers-Briggs",
        questions: 20,
        time: "8-10 phút",
        description: "Xác định loại tính cách Myers-Briggs của bạn và đối tác",
      },
      {
        name: "DISC - Phong cách hành vi",
        questions: 16,
        time: "6-8 phút",
        description: "Phân tích phong cách làm việc và giao tiếp",
      },
      {
        name: "Love Languages - Ngôn ngữ tình yêu",
        questions: 15,
        time: "5-7 phút",
        description: "Khám phá cách thể hiện và cảm nhận tình yêu",
      },
      {
        name: "Big Five - Năm yếu tố tính cách",
        questions: 25,
        time: "10-12 phút",
        description: "Đánh giá 5 khía cạnh chính của tính cách",
      },
    ],
  }

  const handleStartSurvey = () => {
    navigation.navigate("SurveyOptions")
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-primary p-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="items-center">
            <View className="bg-white/20 rounded-full p-4 mb-3">
              <Heart size={32} color="#FFFFFF" />
            </View>
            <Text className="text-white text-2xl font-bold text-center">{surveyDetails.title}</Text>
            <Text className="text-white/90 text-center mt-2">
              Đánh giá toàn diện tính cách và mối quan hệ qua 4 bài test chuẩn quốc tế
            </Text>
          </View>
        </View>

        <View className="p-6 -mt-6 bg-gray-50 rounded-t-3xl">
          {/* Overview */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Tổng quan</Text>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Clock size={16} color="#6C757D" />
                <Text className="text-secondary ml-1">{surveyDetails.totalTime}</Text>
              </View>
              <View className="flex-row items-center">
                <HelpCircle size={16} color="#6C757D" />
                <Text className="text-secondary ml-1">{surveyDetails.totalQuestions} câu hỏi</Text>
              </View>
            </View>
            <Text className="text-secondary">
              Bộ khảo sát này sẽ đánh giá toàn diện mối quan hệ của bạn qua 4 khía cạnh quan trọng. Kết quả sẽ được tổng
              hợp thành một bản đồ tình yêu chi tiết với điểm tương thích tổng hợp.
            </Text>
          </View>

          {/* Sections */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Các phần đánh giá</Text>
            <View className="space-y-4">
              {surveyDetails.sections.map((section, index) => (
                <View key={index} className="border-l-4 border-primary pl-4">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-secondary-dark font-medium flex-1">{section.name}</Text>
                    <Text className="text-secondary text-sm">{section.time}</Text>
                  </View>
                  <Text className="text-secondary text-sm mb-1">{section.description}</Text>
                  <Text className="text-secondary text-xs">{section.questions} câu hỏi</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Benefits */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Kết quả bạn sẽ nhận được</Text>

            <View className="flex-row items-start mb-4">
              <View className="bg-success/10 rounded-full p-2 mt-0.5">
                <Award size={18} color="#28A745" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-secondary-dark font-medium">Bản đồ tình yêu tổng hợp</Text>
                <Text className="text-secondary text-sm">
                  Phân tích chi tiết về tính cách, ngôn ngữ tình yêu, tài chính và giao tiếp
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View className="bg-success/10 rounded-full p-2 mt-0.5">
                <Award size={18} color="#28A745" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-secondary-dark font-medium">Điểm tương thích tổng hợp</Text>
                <Text className="text-secondary text-sm">
                  Đánh giá mức độ phù hợp dựa trên tất cả 4 khía cạnh quan trọng
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="bg-success/10 rounded-full p-2 mt-0.5">
                <Award size={18} color="#28A745" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-secondary-dark font-medium">Lời khuyên cá nhân hóa</Text>
                <Text className="text-secondary text-sm">
                  Gợi ý cụ thể để cải thiện từng khía cạnh trong mối quan hệ
                </Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-3">Hướng dẫn</Text>
            <View className="space-y-2">
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">Bạn sẽ trả lời 4 phần khảo sát liên tiếp</Text>
              </View>
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">Hãy trả lời một cách trung thực và tự nhiên nhất</Text>
              </View>
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">Bạn có thể tạm dừng và tiếp tục sau</Text>
              </View>
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">
                  Chỉ khi hoàn thành cả 4 phần mới có bản đồ tình yêu cuối cùng
                </Text>
              </View>
            </View>
          </View>

          <CustomButton onPress={handleStartSurvey} variant="solid" className="rounded-xl mb-4">
            <Text className="text-white font-bold">Bắt đầu khảo sát tổng hợp</Text>
          </CustomButton>

          <TouchableOpacity
            onPress={() => navigation.navigate("LoveMap")}
            className="flex-row items-center justify-center"
          >
            <Text className="text-primary font-medium">Xem ví dụ bản đồ tình yêu</Text>
            <ArrowRight size={16} color="#E83E8C" className="ml-1" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default SurveyDetailScreen
