"use client"

import { View, Text, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Users } from "lucide-react-native"

import SurveySelectionCard from "@/src/components/survey/SurveySelectionCard"

const CoupleSurveySelectionScreen = () => {
  const navigation = useNavigation<any>()

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-pink-500 p-6">
        <Text className="text-white text-2xl font-bold mb-1">Tạo phòng cặp đôi</Text>
        <Text className="text-white/90">Chọn khảo sát để cùng làm với đối tác</Text>
      </View>

      <ScrollView className="flex-1 px-4 -mt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6 flex-row items-center">
          <Users size={24} color="#E83E8C" />
          <Text className="ml-2 text-primary font-semibold text-base">
            Chọn các bài đánh giá phù hợp để bắt đầu tạo phòng khảo sát đôi
          </Text>
        </View>

        <SurveySelectionCard navigateTo="CoupleConnection" />
      </ScrollView>
    </View>
  )
}

export default CoupleSurveySelectionScreen
