import { View, Text, TouchableOpacity } from "react-native"
import RenderHTML from "react-native-render-html"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react-native"

const LoveMapSurveyDetail = ({
  title,
  description,
}: {
  title: string
  description: string | null
}) => {
  const [expanded, setExpanded] = useState(false)

  if (!description) return null

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center justify-between mb-2"
      >
        <Text className="text-secondary-dark font-medium">{title}</Text>
        {expanded ? (
          <ChevronUp size={18} color="#6C757D" />
        ) : (
          <ChevronDown size={18} color="#6C757D" />
        )}
      </TouchableOpacity>

      {expanded && (
        <RenderHTML
          contentWidth={320}
          source={{ html: `<div>${description}</div>` }}
        />
      )}
    </View>
  )
}

export default LoveMapSurveyDetail
