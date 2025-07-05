"use client"

import { View, ScrollView, TouchableOpacity, Text } from "react-native"
import { ArrowLeft } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import SurveyDetailBlock from "@/src/components/survey/SurveyDetailBlock"
import CounselorRecommendList from "@/src/components/counselor/CounselorRecommendList"

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
         <CounselorRecommendList />
      </View>
      </View>
    </ScrollView>
  )
}

export default PersonTypeResultDetailScreen
