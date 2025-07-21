import { View, Text } from "react-native"

const StrengthsSection = ({
  expanded,
  onToggle,
  title,
  icon,
  color,
  strengths,
  name,
  maxScore,
}: {
  expanded: boolean
  onToggle: () => void
  title: string
  icon: React.ReactNode
  color?: string
  strengths: Record<string, number>
  name: string
  maxScore: number
}) => (
  <View className="mb-3">
    {/* ...render header giống SurveySection... */}
    {expanded && (
      <View className="mt-3 p-4 rounded-lg" style={color ? { backgroundColor: color + "10" } : {}}>
        {/* ...render strengths... */}
        {Object.entries(strengths)
          .filter(([_, value]) => value >= maxScore * 0.6)
          .map(([key, value]) => (
            <View key={key} className="flex-row justify-between items-center">
              <Text className="text-secondary-dark text-sm">✓ {key}</Text>
              <Text className="text-success font-bold text-sm">{value}</Text>
            </View>
          ))}
      </View>
    )}
  </View>
)

export default StrengthsSection