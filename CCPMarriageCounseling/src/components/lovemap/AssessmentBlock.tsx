import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { ChevronDown, ChevronUp } from "lucide-react-native"
import LoveMapSurveyScores from "./LoveMapSurveyScores"
import LoveMapSurveyDetail from "./LoveMapSurveyDetail"

interface Props {
  surveyId: string
  title: string
  icon: React.ReactNode
  scoreLabel: string
  partner1Name: string
  partner2Name: string
  partner1Code: string
  partner2Code: string
  partner1Scores: Record<string, number>
  partner2Scores: Record<string, number>
  detail: string | null
  expanded: boolean
  onToggle: () => void
}

const AssessmentBlock = ({
  surveyId,
  title,
  icon,
  scoreLabel,
  partner1Name,
  partner2Name,
  partner1Code,
  partner2Code,
  partner1Scores,
  partner2Scores,
  detail,
  expanded,
  onToggle,
}: Props) => {
  return (
    <View className="mb-3">
      <TouchableOpacity onPress={onToggle} className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
        <View className="flex-row items-center flex-1">
          <View className="mr-3">{icon}</View>
          <View className="flex-1">
            <Text className="text-secondary-dark font-medium">{title}</Text>
            <Text className="text-secondary text-sm">
              {partner1Code} × {partner2Code}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          {/* <Text className="text-primary font-bold mr-2">{scoreLabel}</Text> */}
          {expanded ? <ChevronUp size={20} color="#E83E8C" /> : <ChevronDown size={20} color="#E83E8C" />}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="mt-3 p-4 bg-primary/5 rounded-lg">
          <Text className="text-secondary-dark font-medium mb-3">Phân tích chi tiết {title}:</Text>
          <LoveMapSurveyScores
            surveyId={surveyId}
            scores={partner1Scores}
            name={`${partner1Name} (${partner1Code})`}
          />
          <LoveMapSurveyScores
            surveyId={surveyId}
            scores={partner2Scores}
            name={`${partner2Name} (${partner2Code})`}
          />
          <LoveMapSurveyDetail title={`Chi tiết ${title}`} description={detail || ""} />
        </View>
      )}
    </View>
  )
}

export default AssessmentBlock