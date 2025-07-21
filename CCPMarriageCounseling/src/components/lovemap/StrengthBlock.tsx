import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { ChevronDown, ChevronUp } from "lucide-react-native"

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
  result: string
  expanded: boolean
  onToggle: () => void
}

const StrengthBlock = ({
  title,
  icon,
  data1,
  data2,
  threshold,
  name1,
  name2,
  type1,
  type2,
  result,
  expanded,
  onToggle,
}: Props) => {
  const filterStrength = (data: Record<string, number>) =>
    Object.entries(data).filter(([_, val]) => val >= threshold)

  return (
    <View className="mb-3">
      <TouchableOpacity onPress={onToggle} className="flex-row items-center justify-between p-4 bg-success/10 rounded-lg">
        <View className="flex-row items-center flex-1">
          <View className="mr-3">{icon}</View>
          <View className="flex-1">
            <Text className="text-success font-medium">{title}</Text>
            <Text className="text-success/80 text-sm">
              {type1} × {type2}
            </Text>
          </View>
        </View>
        {expanded ? <ChevronUp size={20} color="#28A745" /> : <ChevronDown size={20} color="#28A745" />}
      </TouchableOpacity>

      {expanded && (
        <View className="mt-3 p-4 bg-success/5 rounded-lg">
          <Text className="text-secondary-dark font-medium mb-3">Điểm mạnh {title}:</Text>

          {[{ name: name1, code: type1, data: data1 }, { name: name2, code: type2, data: data2 }].map((person) => (
            <View key={person.name} className="mb-4">
              <Text className="text-success font-medium mb-2">
                {person.name} ({person.code}) - Điểm mạnh:
              </Text>
              {filterStrength(person.data).map(([key, value]) => (
                <View key={key} className="flex-row justify-between items-center mb-1">
                  <Text className="text-secondary-dark text-sm">✓ {key}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-success font-bold text-sm mr-2">{value}</Text>
                    <View className="w-16 h-1 bg-gray-200 rounded-full">
                      <View className="h-full bg-success rounded-full" style={{ width: `${(value / 15) * 100}%` }} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}

          {/* {result && (
            <View className="p-3 bg-success/10 rounded-lg">
              <Text className="text-success font-medium mb-1">Tổng kết:</Text>
              <Text className="text-secondary-dark text-sm">{result}</Text>
            </View>
          )} */}
        </View>
      )}
    </View>
  )
}

export default StrengthBlock
