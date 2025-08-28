"use client"

import { useEffect, useRef, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Clock, HelpCircle, Award, ArrowRight, ArrowLeft, Heart, ArrowDown, ChevronsDown } from "lucide-react-native"

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
  const scrollViewRef = useRef<ScrollView>(null)
  const [showScrollDown, setShowScrollDown] = useState(true)

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
  const handleScrollDown = () => {
    scrollViewRef.current?.scrollTo({ y: 700, animated: true })
    setShowScrollDown(false)
  }
  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y
    if (y <= 2) setShowScrollDown(true)
    if (y > 250) setShowScrollDown(false)
  }

  return (
    <View className="flex-1 bg-gray-50" >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="bg-primary p-6">

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
          <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <Text className="text-xl font-bold text-secondary-dark mb-5">📋 Tổng quan</Text>

            {/* Thông tin nhanh */}
            <View className="flex-col space-y-3 mb-5">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <Clock size={16} color="#6C757D" />
                </View>
                <Text className="text-secondary">
                  Thời gian ước tính: <Text className="font-semibold text-primary">{totalTimeEstimate}</Text>
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <HelpCircle size={16} color="#6C757D" />
                </View>
                <Text className="text-secondary">
                  <Text className="font-semibold text-primary">{selectedSurveys.length}</Text> bộ khảo sát •{" "}
                  <Text className="font-semibold text-primary">{totalQuestions}</Text> câu hỏi
                </Text>
              </View>
            </View>

            {/* Mô tả */}
            <Text className="text-secondary leading-relaxed">
              Bộ khảo sát này giúp bạn hiểu rõ tính cách và mối quan hệ của mình, tạo{" "}
              <Text className="font-semibold text-primary">bản đồ tình yêu</Text> kèm phân tích chi tiết, đồng thời mang đến{" "}
              <Text className="font-semibold text-primary">gợi ý tư vấn viên</Text> và{" "}
              <Text className="font-semibold text-primary">khóa học phù hợp</Text> để bạn phát triển bản thân và xây dựng tình yêu bền vững.
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
            <Text className="text-lg font-bold text-secondary-dark mb-4">
              Kết quả bạn sẽ nhận được
            </Text>

            <View className="flex-row items-start mb-4">
              <View className="bg-success/10 rounded-full p-2 mt-0.5">
                <Award size={18} color="#28A745" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-secondary-dark font-medium">Bản đồ tình yêu</Text>
                <Text className="text-secondary text-sm">
                  Phân tích chi tiết về điểm mạnh, điểm yếu, phong cách ứng xử và xu hướng tình cảm của bạn
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View className="bg-success/10 rounded-full p-2 mt-0.5">
                <Award size={18} color="#28A745" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-secondary-dark font-medium">Đánh giá mối quan hệ</Text>
                <Text className="text-secondary text-sm">
                  Xác định mức độ phù hợp giữa bạn và đối tác dựa trên các khía cạnh quan trọng
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View className="bg-success/10 rounded-full p-2 mt-0.5">
                <Award size={18} color="#28A745" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-secondary-dark font-medium">Gợi ý tư vấn viên phù hợp</Text>
                <Text className="text-secondary text-sm">
                  Đề xuất chuyên gia có thể đồng hành và đưa ra hướng dẫn riêng cho tình trạng của bạn
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="bg-success/10 rounded-full p-2 mt-0.5">
                <Award size={18} color="#28A745" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-secondary-dark font-medium">Khóa học cá nhân hóa</Text>
                <Text className="text-secondary text-sm">
                  Cung cấp chương trình học phù hợp giúp bạn phát triển bản thân và xây dựng mối quan hệ bền vững hơn
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
                <Text className="text-secondary ml-2">Bạn có thể tạm dừng và kết thúc </Text>
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



        </View>
      </ScrollView>
      {showScrollDown && (
        <TouchableOpacity
          onPress={handleScrollDown}
          className="absolute bottom-6 right-6 bg-primary/60 p-4 rounded-full shadow-lg"
        >
          <ChevronsDown size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SurveyDetailScreen
