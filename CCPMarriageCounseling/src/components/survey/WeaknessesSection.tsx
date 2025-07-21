import { View, Text, TouchableOpacity } from "react-native"
import { ChevronUp, ChevronDown } from "lucide-react-native"

const WeaknessesSection = ({
  expanded,
  onToggle,
  title,
  icon,
  color,
  weaknesses,
  name,
  maxScore,
  suggestion,
}: {
  expanded: boolean
  onToggle: () => void
  title: string
  icon: React.ReactNode
  color?: string
  weaknesses: Record<string, number>
  name: string
  maxScore: number
  suggestion?: string
}) => (
  <View className="mb-3">
    <TouchableOpacity
      onPress={onToggle}
      className={`flex-row items-center justify-between p-4 bg-danger/10 rounded-lg`}
    >
      <View className="flex-row items-center flex-1">
        <View className="bg-danger/20 rounded-full p-2 mr-3">{icon}</View>
        <View className="flex-1">
          <Text className="text-danger font-medium">{title}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        {expanded ? (
          <ChevronUp size={20} color="#DC3545" />
        ) : (
          <ChevronDown size={20} color="#DC3545" />
        )}
      </View>
    </TouchableOpacity>
    {expanded && (
      <View className="mt-3 p-4 bg-danger/5 rounded-lg">
        <Text className="text-secondary-dark font-medium mb-3">Điểm yếu cần cải thiện:</Text>
        {Object.entries(weaknesses)
          .filter(([_, value]) => value <= maxScore * 0.33)
          .map(([key, value]) => (
            <View key={key} className="flex-row justify-between items-center mb-2">
              <Text className="text-secondary-dark text-sm">⚠ {key}</Text>
              <View className="flex-row items-center">
                <Text className="text-danger font-bold text-sm mr-2">{value}</Text>
                <View className="w-16 h-1 bg-gray-200 rounded-full">
                  <View
                    className="h-full bg-danger rounded-full"
                    style={{ width: `${(value / maxScore) * 100}%` }}
                  />
                </View>
              </View>
            </View>
          ))}
        {suggestion && (
          <View className="p-3 bg-danger/10 rounded-lg mt-2">
            <Text className="text-danger font-medium mb-1">Gợi ý cải thiện:</Text>
            <Text className="text-secondary-dark text-sm">{suggestion}</Text>
          </View>
        )}
      </View>
    )}
  </View>
)

export default WeaknessesSection