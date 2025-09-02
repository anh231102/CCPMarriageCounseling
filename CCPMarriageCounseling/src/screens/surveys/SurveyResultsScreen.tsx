"use client"

import { useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  Share as RNShare,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Award } from "lucide-react-native"
import CustomButton from "../../components/CustomButton"
import SurveyDetailBlock from "@/src/components/survey/SurveyDetailBlock"
import CounselorRecommendList from "@/src/components/counselor/CounselorRecommendList"
import CourseRecommendList from "@/src/components/courses/CourseRecommendList "
import RecommendCategory from "@/src/components/recommend/RecommendCategory"

interface SurveyAnswer {
  user: string | number
  partner: string | number
}

interface SurveyResults {
  surveyType: string
  answers: Record<string, SurveyAnswer>
  userData: {
    name: string
    partnerName: string
  }
  surveyIds: string[]
}

const SurveyResultsScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { results, isAuthenticated } = route.params as {
    results: SurveyResults
    isAuthenticated: boolean
  }

  const handleShare = async () => {
    try {
      await RNShare.share({
        message:
          "Tôi vừa hoàn thành bộ khảo sát tổng hợp tính cách & mối quan hệ trên ứng dụng Tư vấn hôn nhân. Hãy thử ngay!",
      })
    } catch (error) {
      
    }
  }

  const renderAllSurveyDetails = () => (
    <>
      {results.surveyIds.map((id) => (
        <SurveyDetailBlock key={id} id={id} />
      ))}
    </>
  )

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <View className="items-center mb-4">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Award size={32} color="#E83E8C" />
            </View>
            <Text className="text-2xl font-bold text-secondary-dark text-center">
              Kết quả tổng hợp
            </Text>
            <Text className="text-secondary text-center">
              Phân tích toàn diện tính cách & mối quan hệ
            </Text>
          </View>
        </View>

        {renderAllSurveyDetails()}
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

        {!isAuthenticated && (
          <View className="bg-primary/10 rounded-xl p-5 mb-6">
            <Text className="text-primary font-bold text-lg mb-2">Lưu kết quả của bạn</Text>
            <Text className="text-secondary-dark mb-4">
              Đăng ký tài khoản để lưu lại kết quả và xem bản đồ tình yêu chi tiết.
            </Text>
            <CustomButton
              onPress={() => navigation.navigate("Auth", { screen: "Register" })}
              className="bg-primary"
            >
              <Text className="text-white font-medium text-center">Đăng ký ngay</Text>
            </CustomButton>
          </View>
        )}

        <View className="mb-6">
          <CustomButton
            onPress={() => navigation.navigate("SurveyList")}
            variant="outline"
            className="mb-4"
          >
            <Text className="text-primary font-medium text-center">Làm lại khảo sát</Text>
          </CustomButton>

          {isAuthenticated && (
            <CustomButton
              onPress={() => navigation.navigate("ProfileTab", { screen: "LoveMapHistory" })}
              variant="solid"
            >
              <Text className="text-white font-medium text-center">
                Xem bản đồ tình yêu chi tiết
              </Text>
            </CustomButton>

          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default SurveyResultsScreen
