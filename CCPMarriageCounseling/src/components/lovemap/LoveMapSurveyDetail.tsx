import { View, Text, TouchableOpacity } from "react-native"
import RenderHTML from "react-native-render-html"
import { useState } from "react"
import { ChevronDown, ChevronUp, BookHeart } from "lucide-react-native"

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
        <BookHeart size={24} color="#E83E8C" />
        <Text className="text-primary font-medium">{title}</Text>
        {expanded ? (
          <ChevronUp size={18} color="#E83E8C" />
        ) : (
          <ChevronDown size={18} color="#E83E8C" />
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
