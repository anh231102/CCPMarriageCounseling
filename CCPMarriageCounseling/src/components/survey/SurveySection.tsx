import { View, Text, TouchableOpacity } from "react-native"
import { ChevronUp, ChevronDown } from "lucide-react-native"
import LoveMapSurveyScores from "../lovemap/LoveMapSurveyScores"
import LoveMapSurveyDetail from "../lovemap/LoveMapSurveyDetail"

const SurveySection = ({
  expanded,
  onToggle,
  icon,
  title,
  subtitle,
  percent,
  color,
  scores1,
  scores2,
  name1,
  name2,
  detail,
  result,
  resultLabel,
  bgColor,
}: {
  expanded: boolean
  onToggle: () => void
  icon: React.ReactNode
  title: string
  subtitle?: string
  percent?: string
  color?: string
  scores1: Record<string, number>
  scores2: Record<string, number>
  name1: string
  name2: string
  detail?: string | null
  result?: string | null
  resultLabel?: string
  bgColor?: string
}) => (
  <View className="mb-3">
    <TouchableOpacity
      onPress={onToggle}
      className={`flex-row items-center justify-between p-4 rounded-lg ${bgColor || "bg-gray-50"}`}
    >
      <View className="flex-row items-center flex-1">
        <View className="rounded-full p-2 mr-3" style={color ? { backgroundColor: color + "20" } : {}}>
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-medium" style={color ? { color } : {}}>{title}</Text>
          {subtitle && <Text className="text-secondary text-sm">{subtitle}</Text>}
        </View>
      </View>
      <View className="flex-row items-center">
        {percent && <Text className="font-bold mr-2" style={color ? { color } : {}}>{percent}</Text>}
        {expanded ? <ChevronUp size={20} color={color || "#333"} /> : <ChevronDown size={20} color={color || "#333"} />}
      </View>
    </TouchableOpacity>
    {expanded && (
      <View className="mt-3 p-4 rounded-lg" style={bgColor ? { backgroundColor: bgColor } : {}}>
        <LoveMapSurveyScores surveyId={title} scores={scores1} name={name1} />
        <LoveMapSurveyScores surveyId={title} scores={scores2} name={name2} />
        <LoveMapSurveyDetail title={`Chi tiết ${title}`} description={detail || null} />
        {result && (
          <View className="p-3 bg-white rounded-lg">
            <Text className="font-medium mb-1" style={color ? { color } : {}}>{resultLabel || "Kết luận"}:</Text>
            <Text className="text-secondary text-sm">{result}</Text>
          </View>
        )}
      </View>
    )}
  </View>
)

export default SurveySection