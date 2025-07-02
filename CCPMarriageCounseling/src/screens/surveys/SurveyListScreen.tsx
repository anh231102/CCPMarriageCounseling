"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { UserPlus, Heart, CheckCircle } from "lucide-react-native"

import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"
import surveyApi from "@/src/config/api/survey.api"
import type { Survey } from "@/src/config/types/survey.type"
import Loading from "@/src/components/share/Loading"

const SurveyListScreen = () => {
  const navigation = useNavigation<any>()
  const { isAuth } = useAuth()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const data = await surveyApi.getSurveys()
      setSurveys(data)
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách khảo sát")
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleStartAssessment = () => {
    if (isAuth) {
      if (selectedIds.length === 0) {
        Alert.alert("Thông báo", "Vui lòng chọn ít nhất một khảo sát để bắt đầu")
        return
      }
      navigation.navigate("SurveyDetail", { selectedSurveyIds: selectedIds })
    } else {
      navigation.navigate("Auth", { screen: "Login" })
    }
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

        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <View className="items-center mb-6">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Heart size={32} color="#E83E8C" />
            </View>
            <Text className="text-2xl font-bold text-secondary-dark text-center">Bộ khảo sát tổng hợp</Text>
            <Text className="text-secondary text-center mt-2">
              Chọn các phần đánh giá phù hợp để bắt đầu khảo sát
            </Text>
          </View>

          {/* Section list từ API */}
          {loading ? (
            <Loading size={30} />
          ) : (
            <View className="space-y-3">
              {surveys.map((survey) => (
                <TouchableOpacity
                  key={survey.id}
                  onPress={() => toggleSelect(survey.id)}
                  className={`flex-row items-center p-3 rounded-lg ${
                    selectedIds.includes(survey.id) ? "bg-primary/10" : "bg-gray-50"
                  }`}
                >
                  <View className="bg-white rounded-full p-2 mr-3">
                    <Text className="text-lg">📋</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-secondary-dark">{survey.name}</Text>
                    <Text className="text-secondary text-sm">{survey.descriptione}</Text>
                  </View>
                  {selectedIds.includes(survey.id) && <CheckCircle size={20} color="#28A745" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Start button */}
          <CustomButton onPress={handleStartAssessment} className="bg-primary mt-6">
            <Text className="text-white font-bold text-center">
              {selectedIds.length > 0 ? "Tiếp tục khảo sát" : "Chọn khảo sát để bắt đầu"}
            </Text>
          </CustomButton>
        </View>
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
