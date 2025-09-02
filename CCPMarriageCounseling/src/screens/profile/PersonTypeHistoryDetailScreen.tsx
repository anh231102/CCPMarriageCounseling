"use client"

import { useEffect, useState } from "react"
import { useRoute, useNavigation } from "@react-navigation/native"
import { View, Text, ScrollView, TouchableOpacity, Share as RNShare, Alert } from "react-native"
import {
  ArrowLeft,
  Share2,
  Download,
  RefreshCw,
  Award,
  BarChart3,
} from "lucide-react-native"
import SurveyScores from "@/src/components/survey/SurveyScores"
import { getSurveyMetaById } from "@/src/config/types/survey.type"
import type { SurveyType } from "@/src/config/types/persontype.type"
import personTypeApi from "@/src/config/api/persontype.api"
import LoveMapSurveyDetail from "@/src/components/lovemap/LoveMapSurveyDetail"

interface SurveyResult {
  surveyId: SurveyType
  result: string
  description: string
  rawScores: string
  createAt: string
}

const SurveyHistoryDetailScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { surveyResult } = route.params as { surveyResult: SurveyResult }

  const meta = getSurveyMetaById(surveyResult.surveyId)!
  const IconComponent = meta.icon

  const [personTypeDetail, setPersonTypeDetail] = useState<string | null>(null)

  useEffect(() => {
    const fetchPersonTypeDetail = async () => {
      try {
        const personType = await personTypeApi.getPersonTypeByName(surveyResult.result, surveyResult.surveyId)
        setPersonTypeDetail(personType.detail)
      } catch (error) {
       
      }
    }

    fetchPersonTypeDetail()
  }, [])

  const parseRawScores = (rawScores: string) => {
    const scores: Record<string, number> = {}
    rawScores.split(",").forEach((pair) => {
      const [key, value] = pair.split(":")
      if (key && value) scores[key.trim()] = parseFloat(value.trim())
    })
    return scores
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Vừa xong"
    if (diffInHours < 24) return `${diffInHours} giờ trước`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`

    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} tháng trước`
  }

  const handleShare = async () => {
    try {
      const message = `Tôi vừa hoàn thành bài khảo sát ${meta.fullName} và nhận được kết quả: ${surveyResult.result}. ${surveyResult.description}`
      await RNShare.share({ message, title: `Kết quả khảo sát ${meta.name}` })
    } catch (error) {
    
    }
  }

  const handleDownload = () => {
    Alert.alert("Tải xuống báo cáo", "Tính năng sẽ sớm được cập nhật.", [{ text: "OK" }])
  }

  const handleRetakeTest = () => {
    Alert.alert("Làm lại khảo sát", `Bạn có muốn làm lại bài khảo sát ${meta.name}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Làm lại",
        onPress: () => {
          navigation.navigate("SurveyTab", { screen: "SurveyList" })
        },
      },
    ])
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <View className="flex-row space-x-3"></View>

          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={handleShare} className="bg-primary/10 rounded-full p-2 mr-2">
              <Share2 size={20} color={meta.color} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownload} className="bg-primary/10 rounded-full p-2">
              <Download size={20} color={meta.color} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {/* Summary */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <View className="items-center mb-6">
            <View className={`${meta.bgColor} rounded-full p-4 mb-3`}>
              <IconComponent size={32} color={meta.color} />
            </View>
            <Text className="text-2xl font-bold text-secondary-dark text-center">{meta.fullName}</Text>
            <Text className="text-secondary text-center mt-1">{meta.description}</Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="items-center">
              <Text className="text-secondary text-sm mb-2">Kết quả của bạn</Text>
              <View className={`${meta.bgColor} rounded-xl px-6 py-3 mb-3`}>
                <Text className="text-3xl font-bold text-center" style={{ color: meta.color }}>
                  {surveyResult.result}
                </Text>
              </View>
              <Text className="text-secondary-dark text-center font-medium">
                {surveyResult.description}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-secondary text-sm">Thời gian thực hiện</Text>
              <Text className="text-secondary-dark font-medium">{getTimeAgo(surveyResult.createAt)}</Text>
            </View>
            <View>
              <Text className="text-secondary text-sm">Ngày hoàn thành</Text>
              <Text className="text-secondary-dark font-medium">
                {new Date(surveyResult.createAt).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          </View>
        </View>

        {/* Score Chart */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className={`${meta.bgColor} rounded-full p-3 mr-3`}>
              <BarChart3 size={24} color={meta.color} />
            </View>
            <Text className="text-xl font-bold text-secondary-dark">Biểu đồ điểm số</Text>
          </View>
          <SurveyScores scores={parseRawScores(surveyResult.rawScores)} surveyId={surveyResult.surveyId} />
        </View>

        {/* Chi tiết tính cách */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <LoveMapSurveyDetail title="Chi tiết tính cách" description={personTypeDetail} />
        </View>

        {/* Actions */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={handleRetakeTest}
            className="bg-primary rounded-xl p-4 mb-3 flex-row items-center justify-center"
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">Làm lại bài khảo sát</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("SurveyTab", { screen: "LoveMap" })}
            className="bg-white border border-primary rounded-xl p-4 flex-row items-center justify-center"
          >
            <Award size={20} color={meta.color} />
            <Text className="text-primary font-bold ml-2">Xem bản đồ tình yêu tổng hợp</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View className="bg-info/5 rounded-xl p-4 mb-6">
          <Text className="text-info font-medium mb-2">💡 Gợi ý</Text>
          <Text className="text-secondary-dark text-sm">
            Kết quả này phản ánh tính cách tại thời điểm khảo sát. Hãy thực hiện lại sau 6–12 tháng để có góc nhìn cập nhật.
          </Text>
        </View>

        <Text className="text-secondary text-center text-xs mb-4">
          Hoàn thành lúc: {formatDate(surveyResult.createAt)}
        </Text>
      </ScrollView>
    </View>
  )
}

export default SurveyHistoryDetailScreen
