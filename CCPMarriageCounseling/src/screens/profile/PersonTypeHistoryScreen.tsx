"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  Filter,
  ChevronDown,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react-native"
import personTypeApi from "@/src/config/api/persontype.api"
import type { PersonTypeHistoryItem, SurveyType } from "@/src/config/types/persontype.type"
import { surveyTypes, getSurveyMetaById } from "@/src/config/types/survey.type"
import Loading from "@/src/components/share/Loading"

const PersonTypeHistoryScreen = () => {
  const navigation = useNavigation<any>()
  const [selectedSurveyType, setSelectedSurveyType] = useState<SurveyType>("SV001")
  const [surveyHistory, setSurveyHistory] = useState<PersonTypeHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [showSortMenu, setShowSortMenu] = useState(false)

  const currentType = getSurveyMetaById(selectedSurveyType)!

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateStr: string) => {
    const now = new Date().getTime()
    const past = new Date(dateStr).getTime()
    const diffHours = Math.floor((now - past) / (1000 * 60 * 60))

    if (diffHours < 1) return "Vừa xong"
    if (diffHours < 24) return `${diffHours} giờ trước`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} ngày trước`
    const diffWeeks = Math.floor(diffDays / 7)
    if (diffWeeks < 4) return `${diffWeeks} tuần trước`
    return `${Math.floor(diffDays / 30)} tháng trước`
  }

  const fetchSurveyHistory = async () => {
    setLoading(true)
    try {
      const res = await personTypeApi.getPersonTypeHistoryBySurveyId(selectedSurveyType)
      const sorted = [...res].sort((a, b) => {
        const aTime = new Date(a.createAt).getTime()
        const bTime = new Date(b.createAt).getTime()
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime
      })
      setSurveyHistory(sorted)
    } catch (err) {
      setSurveyHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveyHistory()
  }, [selectedSurveyType, sortOrder])

  const renderSurveyItem = ({ item }: { item: PersonTypeHistoryItem }) => {
  // Nếu item có surveyId, lấy meta theo item.surveyId
  const typeMeta = getSurveyMetaById(item.surveyId as SurveyType) || currentType;
  const Icon = typeMeta.icon;

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => {
        navigation.navigate("PersonTypeHistoryDetail", { surveyResult: item })
      }}
    >
      <View className="flex-row items-start">
        <View className={`${typeMeta.bgColor} rounded-full p-3 mr-4`}>
          <Icon size={20} color={typeMeta.color} />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="text-secondary-dark font-bold text-base">
                {typeMeta.fullName}
              </Text>
              <Text className="text-secondary text-sm">
                {getTimeAgo(item.createAt)}
              </Text>
            </View>
            <View className={`${typeMeta.bgColor} rounded-lg px-3 py-1`}>
              <Text className="font-bold" style={{ color: typeMeta.color }}>
                {item.result}
              </Text>
            </View>
          </View>
          <Text className="text-secondary-dark text-sm mb-3" numberOfLines={2}>
            {item.description}
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Clock size={14} color="#6C757D" />
              <Text className="text-secondary text-xs ml-1">
                {formatDate(item.createAt)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigation.navigate("PersonTypeHistoryDetail", { surveyResult: item })
            }}>
              <Text className="text-primary text-sm font-medium">Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

  const renderSurveyTypeButtons = () => (
    <View className="bg-white py-4 px-4 border-b border-gray-200">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-secondary-dark font-medium">Chọn loại khảo sát:</Text>
        <View className="relative">
          <TouchableOpacity
            onPress={() => setShowSortMenu(!showSortMenu)}
            className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
          >
            <Filter size={16} color="#6C757D" />
            <Text className="text-secondary ml-2 text-sm">
              {sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
            </Text>
            <ChevronDown size={16} color="#6C757D" className="ml-1" />
          </TouchableOpacity>
          {showSortMenu && (
            <View className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[120px]">
              {["newest", "oldest"].map((key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    setSortOrder(key as "newest" | "oldest")
                    setShowSortMenu(false)
                  }}
                  className={`p-3 flex-row items-center ${sortOrder === key ? "bg-primary/5" : ""
                    }`}
                >
                  {key === "newest" ? (
                    <TrendingDown
                      size={16}
                      color={sortOrder === key ? "#E83E8C" : "#6C757D"}
                    />
                  ) : (
                    <TrendingUp
                      size={16}
                      color={sortOrder === key ? "#E83E8C" : "#6C757D"}
                    />
                  )}
                  <Text
                    className={`ml-2 text-sm ${sortOrder === key
                      ? "text-primary font-medium"
                      : "text-secondary-dark"
                      }`}
                  >
                    {key === "newest" ? "Mới nhất" : "Cũ nhất"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {surveyTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedSurveyType === type.id
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedSurveyType(type.id)}
              className={`items-center mr-4 px-3 py-2 rounded-xl border ${isSelected ? currentType.bgColor : "bg-gray-100 border-gray-300"
                }`}
              style={{
                minWidth: 100,
                borderColor: isSelected ? currentType.color : "#D1D5DB", // gray-300
              }}
            >

              <View
                className={`rounded-full p-2 mb-1 ${isSelected ? `${currentType.bgColor} ` : "bg-gray-200"
                  }`}
              >
                <Icon size={20} color={isSelected ? type.color : "#6C757D"} />
              </View>
              <Text
                className="text-sm font-medium text-center"
                style={{ color: isSelected ? currentType.color : "#343a40" }} // text-secondary-dark
              >
                {type.name}
              </Text>

            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )

  return (
    <View className="flex-1 bg-gray-50">
      {renderSurveyTypeButtons()}

      <View className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Loading size={60} />
            <Text className="text-secondary mt-2">Đang tải...</Text>
          </View>
        ) : surveyHistory.length > 0 ? (
          <FlatList
            data={surveyHistory}
            renderItem={renderSurveyItem}
            keyExtractor={(_, index) => `${selectedSurveyType}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <View className="bg-white rounded-xl p-8 items-center shadow-sm">
              <View className={`${currentType.bgColor} rounded-full p-4 mb-4`}>
                <currentType.icon size={32} color={currentType.color} />
              </View>
              <Text className="text-secondary-dark font-bold text-lg mb-2">
                Chưa có lịch sử {currentType.name}
              </Text>
              <Text className="text-secondary text-center mb-4">
                Bạn chưa thực hiện bài khảo sát {currentType.fullName}. Hãy bắt đầu ngay bây giờ.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SurveyTab", { screen: "SurveyList" })
                }
                className="bg-primary rounded-lg px-6 py-3"
              >
                <Text className="text-white font-medium">Bắt đầu khảo sát</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default PersonTypeHistoryScreen
