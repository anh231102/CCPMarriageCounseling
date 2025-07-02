"use client"

import { View, ScrollView, TouchableOpacity, Text } from "react-native"
import { ArrowLeft } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import SurveyDetailBlock from "@/src/components/survey/SurveyDetailBlock"

const PersonTypeResultDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { type: surveyId } = route.params as { type: string; memberId: string }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      
      

      {/* Main Detail Block */}
      <View className="p-4">
        <SurveyDetailBlock id={surveyId} />
      </View>
    </ScrollView>
  )
}

export default PersonTypeResultDetailScreen
