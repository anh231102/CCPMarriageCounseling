"use client"

import { View, ScrollView, TouchableOpacity, Text } from "react-native"
import { ArrowLeft } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import SurveyDetailBlock from "@/src/components/survey/SurveyDetailBlock"
import CounselorRecommendList from "@/src/components/counselor/CounselorRecommendList"
import CourseRecommendList from "@/src/components/courses/CourseRecommendList "
import RecommendCategory from "@/src/components/recommend/RecommendCategory"

const PersonTypeResultDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { type: surveyId } = route.params as { type: string; memberId: string }

  return (
    <ScrollView className="flex-1 bg-gray-50">



      {/* Main Detail Block */}
      <View className="p-4">
        <SurveyDetailBlock id={surveyId} />
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-secondary-dark mb-3">
            Chuyên mục gợi ý
          </Text>
          <Text className="text-secondary mb-4 leading-relaxed">
            Dựa trên phân tích kết quả khảo sát cá nhân mới nhất, chúng tôi đã xác định các{" "}
            <Text className="font-semibold text-primary">chuyên mục cần ưu tiên cải thiện</Text> dành riêng cho bạn.
            Từ đó, hệ thống sẽ gợi ý {" "}
            <Text className="font-semibold text-primary">tư vấn viên phù hợp</Text> và{" "}
            <Text className="font-semibold text-primary">khóa học cá nhân hóa</Text> giúp bạn phát triển bản thân và xây dựng mối quan hệ bền vững hơn.
          </Text>
          <RecommendCategory />
        </View>

        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <CounselorRecommendList />

        </View>
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">

          <CourseRecommendList />
        </View>
      </View>
    </ScrollView>
  )
}

export default PersonTypeResultDetailScreen
