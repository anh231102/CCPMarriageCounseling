"use client"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { UserPlus, CheckCircle, ChevronDown, ChevronUp } from "lucide-react-native"
import { surveyTypes } from "@/src/config/types/survey.type"
import CustomButton from "@/src/components/CustomButton"
import SurveySelectionCard from "@/src/components/survey/SurveySelectionCard"
import { useAuth } from "@/src/hooks/useAuth"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const SurveyListScreen = () => {
  const navigation = useNavigation<any>()
  const { isAuth } = useAuth()
  const [showAllDetails, setShowAllDetails] = useState(false)

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowAllDetails(!showAllDetails)
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

        {/* ✅ Component đã tách */}
        <SurveySelectionCard navigateTo="SurveyDetail" />

       {/* Khung bao toàn bộ phần "Xem chi tiết" */}
<View className="bg-white rounded-xl shadow-sm p-4 mb-6">
  {/* Nút toggle danh sách khảo sát */}
  <TouchableOpacity
    className="flex-row items-center justify-between py-3"
    onPress={handleToggle}
    activeOpacity={0.7}
  >
    <Text className="text-primary font-semibold text-base">Xem chi tiết thông tin các bài khảo sát</Text>
    {showAllDetails ? (
      <ChevronUp size={18} color="#E83E8C" />
    ) : (
      <ChevronDown size={18} color="#E83E8C" />
    )}
  </TouchableOpacity>

  {/* Khi mở thì hiển thị toàn bộ danh sách */}
  {showAllDetails && (
    <View className="mt-3">
      {surveyTypes.map(type => (
        <View
          key={type.id}
          className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200"
        >
          <Text className="text-primary font-semibold text-base">
            {type.name} ({type.fullNameVi})
          </Text>
          <Text className="text-secondary-dark font-medium mt-1">{type.shortTitle}</Text>
          <Text className="text-secondary text-sm mt-0.5">{type.description}</Text>
        </View>
      ))}
    </View>
  )}
</View>


        {/* Lợi ích khi hoàn thành */}
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
                <Text className="text-secondary text-sm">
                  Đánh giá mức độ phù hợp dựa trên 4 khía cạnh quan trọng
                </Text>
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
