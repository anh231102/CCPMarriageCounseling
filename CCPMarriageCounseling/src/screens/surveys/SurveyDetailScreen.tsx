"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Clock, HelpCircle, Award, ArrowRight, ArrowLeft, Heart } from "lucide-react-native"

import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"
import surveyApi from "@/src/config/api/survey.api"
import type { Survey } from "@/src/config/types/survey.type"

const SurveyDetailScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const { isAuth } = useAuth()

  const { selectedSurveyIds } = route.params as { selectedSurveyIds: string[] }

  const [selectedSurveys, setSelectedSurveys] = useState<Survey[]>([])

  useEffect(() => {
    const fetchSelectedSurveys = async () => {
      try {
        const allSurveys = await surveyApi.getSurveys()
        const filtered = allSurveys.filter((s) => selectedSurveyIds.includes(s.id))
        setSelectedSurveys(filtered)
      } catch (error) {
        console.error("Không thể tải dữ liệu khảo sát", error)
      }
    }

    fetchSelectedSurveys()
  }, [selectedSurveyIds])

  const totalQuestions = selectedSurveys.length * 25 // hoặc s.questions nếu có từ API
  const totalTimeEstimate = "10 phút/ 1 bộ khảo sát" // bạn có thể tính động nếu cần

  const handleStartSurvey = () => {
    navigation.navigate("SurveyOptions", { selectedSurveyIds })
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
            <Text className="text-white text-2xl font-bold text-center">Bộ khảo sát tổng hợp</Text>
            <Text className="text-white/90 text-center mt-2">
              Đánh giá toàn diện tính cách và mối quan hệ qua {selectedSurveys.length} bài test
            </Text>
          </View>
        </View>

        <View className="p-6 -mt-6 bg-gray-50 rounded-t-3xl">
          {/* Tổng quan */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Tổng quan</Text>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Clock size={16} color="#6C757D" />
                <Text className="text-secondary ml-1">{totalTimeEstimate}</Text>
              </View>
              <View className="flex-row items-center">
                <HelpCircle size={16} color="#6C757D" />
                <Text className="text-secondary ml-1">{totalQuestions} câu hỏi</Text>
              </View>
            </View>
            <Text className="text-secondary">
              Bộ khảo sát này sẽ đánh giá toàn diện mối quan hệ của bạn. Kết quả sẽ tổng hợp thành một bản đồ tình yêu
              với phân tích và lời khuyên chi tiết.
            </Text>
          </View>

          {/* Các phần khảo sát */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Các phần đánh giá</Text>
            <View className="space-y-4">
              {selectedSurveys.map((section, index) => (
                <View key={section.id} className="border-l-4 border-primary pl-4">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-secondary-dark font-medium flex-1">{section.name}</Text>
                    <Text className="text-secondary text-sm">~10 phút</Text>
                  </View>
                  <Text className="text-secondary text-sm mb-1">{section.descriptione}</Text>
                  <Text className="text-secondary text-xs">25 câu hỏi</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Kết quả bạn sẽ nhận được */}
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

          {/* Hướng dẫn */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-3">Hướng dẫn</Text>
            <View className="space-y-2">
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">Bạn sẽ trả lời các phần khảo sát đã chọn</Text>
              </View>
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">Hãy trả lời một cách trung thực và tự nhiên</Text>
              </View>
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">Bạn có thể tạm dừng và tiếp tục sau</Text>
              </View>
              <View className="flex-row">
                <Text className="text-secondary">•</Text>
                <Text className="text-secondary ml-2">
                  Chỉ khi hoàn thành hết các phần mới có bản đồ tình yêu đầy đủ
                </Text>
              </View>
            </View>
          </View>

          {/* Bắt đầu khảo sát */}
          <CustomButton onPress={handleStartSurvey} variant="solid" className="rounded-xl mb-4">
            <Text className="text-white font-bold">Bắt đầu khảo sát tổng hợp</Text>
          </CustomButton>

          {/* Xem ví dụ */}
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
