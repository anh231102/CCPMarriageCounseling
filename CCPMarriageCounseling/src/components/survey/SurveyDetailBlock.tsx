import { useEffect, useState } from "react"
import { View, Text, useWindowDimensions } from "react-native"
import { Brain, Zap, Heart, Star, Settings, Target } from "lucide-react-native"
import personTypeApi from "@/src/config/api/persontype.api"
import type { PersonType } from "@/src/config/types/persontype.type"
import RenderHTML from "react-native-render-html"
import Loading from "../share/Loading"
import SurveyScores from "./SurveyScores" // Đường dẫn đến component bạn vừa tách

const SURVEY_META: Record<
  string,
  { title: string; icon: React.ReactElement; color: string }
> = {
  SV001: {
    title: "MBTI - Myers-Briggs",
    icon: <Brain size={24} color="#E83E8C" />,
    color: "#E83E8C",
  },
  SV002: {
    title: "DISC - Phong cách hành vi",
    icon: <Target size={24} color="#EF4444" />,
    color: "#EF4444",
  },
  SV003: {
    title: "Love Languages - Ngôn ngữ tình yêu",
    icon: <Heart size={24} color="#E83E8C" />,
    color: "#E83E8C",
  },
  SV004: {
    title: "Big Five - Năm yếu tố tính cách",
    icon: <Settings size={24} color="#28A745" />,
    color: "#28A745",
  },
}

const SurveyDetailBlock = ({ id }: { id: string }) => {
  const { width } = useWindowDimensions()
  const [data, setData] = useState<PersonType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const meta = SURVEY_META[id]
  if (!meta) return null

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await personTypeApi.getPersonTypeBySurveyId(id)
        setData(result)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm items-center justify-center">
        <Loading size={30} />
        <Text className="text-[#EC4899] mt-2">Đang tải kết quả...</Text>
      </View>
    )
  }

  if (!data) return null

  return (
    <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <View
          className="bg-primary/10 rounded-full p-3 mr-3"
          style={{ backgroundColor: `${meta.color}20` }}
        >
          {meta.icon}
        </View>
        <Text className="text-xl font-bold text-secondary-dark">{meta.title}</Text>
      </View>

      {/* Name + Description */}
      <View className="mb-3">
        <Text className="text-lg font-semibold text-primary">{data.name}</Text>
        <Text className="text-secondary-dark mb-2">{data.description}</Text>

        {/* Scores */}
        <View className="mt-4">
          <SurveyScores scores={data.scores} surveyId={id} />
        </View>

        {/* Detail HTML */}
        <RenderHTML
          contentWidth={width}
          source={{ html: `<div>${data.detail}</div>` }}
          baseStyle={{ color: "#343a40", fontSize: 14 }}
        />
      </View>
    </View>
  )
}

export default SurveyDetailBlock
