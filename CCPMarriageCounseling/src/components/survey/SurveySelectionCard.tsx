import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Heart, CheckCircle } from "lucide-react-native"

import CustomButton from "../CustomButton"
import Loading from "../share/Loading"
import surveyApi from "@/src/config/api/survey.api"
import { useAuth } from "@/src/hooks/useAuth"
import type { Survey } from "@/src/config/types/survey.type"
import { surveyTypes } from "@/src/config/types/survey.type"


type Props = {
  navigateTo: string
}

const SurveySelectionCard = ({ navigateTo }: Props) => {
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
      navigation.navigate(navigateTo, { selectedSurveyIds: selectedIds })
    } else {
      navigation.navigate("Auth", { screen: "Login" })
    }
  }

  return (
    <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <View className="items-center mb-6">
        <View className="bg-primary/10 rounded-full p-4 mb-3">
          <Heart size={32} color="#E83E8C" />
        </View>
        <Text className="text-2xl font-bold text-secondary-dark text-center">
          Bộ khảo sát tổng hợp
        </Text>
        <Text className="text-secondary text-center mt-2">
          Chọn các phần đánh giá phù hợp để bắt đầu khảo sát
        </Text>
      </View>

      {loading ? (
        <Loading size={30} />
      ) : (
        <View className="space-y-3">
          {surveys.map((survey) => (
            <TouchableOpacity
              key={survey.id}
              onPress={() => toggleSelect(survey.id)}
              className={`flex-row items-center p-3 rounded-lg ${selectedIds.includes(survey.id) ? "bg-primary/10" : "bg-gray-50"
                }`}
            >
              <View className="bg-white rounded-full p-2 mr-3">
                <Text className="text-lg">📋</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium text-secondary-dark">
                  {survey.name}
                  {surveyTypes.find(t => t.name === survey.name)?.fullNameVi
                    ? ` (${surveyTypes.find(t => t.name === survey.name)?.fullNameVi})`
                    : ""}
                </Text>
                <Text className="text-secondary text-sm">
                  {
                    surveyTypes.find(t => t.name === survey.name)?.shortTitle || survey.descriptione
                  }
                </Text>
              </View>
              {selectedIds.includes(survey.id) && (
                <CheckCircle size={20} color="#28A745" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <CustomButton onPress={handleStartAssessment} className="bg-primary mt-6">
        <Text className="text-white font-bold text-center">
          {selectedIds.length > 0 ? "Tiếp tục khảo sát" : "Chọn khảo sát để bắt đầu"}
        </Text>
      </CustomButton>
    </View>
  )
}

export default SurveySelectionCard
