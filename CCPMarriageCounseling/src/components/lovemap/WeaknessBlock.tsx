import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { ChevronDown, ChevronUp } from "lucide-react-native"
import HTMLViewer from "../share/HTMLViewer"

interface Props {
  title: string
  icon: React.ReactNode
  data1: Record<string, number>
  data2: Record<string, number>
  threshold: number
  name1: string
  name2: string
  type1: string
  type2: string
  suggestions: string
  expanded: boolean
  onToggle: () => void
  weaknesses?: string
}

const WeaknessBlock = ({
  title,
  icon,
  data1,
  data2,
  threshold,
  name1,
  name2,
  type1,
  type2,
  suggestions,
  expanded,
  onToggle,
  weaknesses,
}: Props) => {
  const filterWeakness = (data: Record<string, number>) =>
    Object.entries(data).filter(([_, val]) => val <= threshold)

  return (
    <View className="mb-3">
      <TouchableOpacity onPress={onToggle} className="flex-row items-center justify-between p-4 bg-danger/10 rounded-lg">
        <View className="flex-row items-center flex-1">
          <View className="mr-3">{icon}</View>
          <View className="flex-1">
            <Text className="text-danger font-medium">{title}</Text>
            <Text className="text-danger/80 text-sm">
              {type1} × {type2}
            </Text>
          </View>
        </View>
        {expanded ? <ChevronUp size={20} color="#DC3545" /> : <ChevronDown size={20} color="#DC3545" />}
      </TouchableOpacity>

      {expanded && (
        <View className="mt-3 p-4 bg-danger/5 rounded-lg">
          <Text className="text-secondary-dark font-medium mb-3">Điểm yếu {title} cần cải thiện:</Text>

          {[{ name: name1, code: type1, data: data1 }, { name: name2, code: type2, data: data2 }].map((person) => {
            const weaknessesArr = filterWeakness(person.data);
            if (weaknessesArr.length === 0) return null;
            return (
              <View key={person.name} className="mb-4">
                <Text className="text-danger font-medium mb-2">
                  {person.name} ({person.code}) - Cần phát triển:
                </Text>
                {weaknessesArr.map(([key, value]) => (
                  <View key={key} className="flex-row justify-between items-center mb-1">
                    <Text className="text-secondary-dark text-sm">⚠ {key}</Text>
                    <View className="flex-row items-center">
                      <Text className="text-danger font-bold text-sm mr-2">{value}</Text>
                      <View className="w-16 h-1 bg-gray-200 rounded-full">
                        <View className="h-full bg-danger rounded-full" style={{ width: `${(value / 30) * 100}%` }} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}

          {weaknesses && (
            <View className="p-3 bg-danger/10 rounded-lg mb-2">
              <Text className="text-danger font-medium mb-1">Tổng kết điểm yếu:</Text>
              <Text className="text-secondary-dark text-sm"><HTMLViewer htmlContent={weaknesses} /></Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default WeaknessBlock
