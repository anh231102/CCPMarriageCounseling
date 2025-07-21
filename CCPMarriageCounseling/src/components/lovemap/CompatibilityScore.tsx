import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { Award, Heart, ChevronRight } from "lucide-react-native"

interface Props {
  score: number
  member1: { fullname: string; avatar?: string }
  member2: { fullname: string; avatar?: string }
  mbti1?: string
  mbti2?: string
  onPressPerson: (key: "member" | "member1") => void
}

const getColor = (score: number) => {
  if (score >= 80) return "text-success"
  if (score >= 60) return "text-primary"
  if (score >= 40) return "text-warning"
  return "text-danger"
}

const getBg = (score: number) => {
  if (score >= 80) return "bg-success"
  if (score >= 60) return "bg-primary"
  if (score >= 40) return "bg-warning"
  return "bg-danger"
}

const getLabel = (score: number) => {
  if (score >= 80) return "Rất tương thích"
  if (score >= 60) return "Tương thích tốt"
  if (score >= 40) return "Tương thích trung bình"
  return "Cần cải thiện"
}

const CompatibilityScore = ({ score, member1, member2, mbti1, mbti2, onPressPerson }: Props) => {
  return (
    <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
      <View className="items-center mb-6">
        <View className="bg-primary/10 rounded-full p-4 mb-3">
          <Award size={32} color="#E83E8C" />
        </View>
        <Text className="text-2xl font-bold text-secondary-dark text-center">Điểm tương thích tổng hợp</Text>
        <Text className="text-secondary text-center">Dựa trên các bài đánh giá tính cách</Text>
      </View>

      {/* <View className="items-center mb-6">
        <View className="relative w-32 h-32 items-center justify-center">
          <View className="absolute w-full h-full rounded-full border-8 border-gray-200" />
          <View
            className={`absolute w-full h-full rounded-full border-8 ${getBg(score)}`}
            style={{ transform: [{ rotate: `${(score / 100) * 360}deg` }] }}
          />
          <Text className={`text-3xl font-bold ${getColor(score)}`}>{score}%</Text>
        </View>
        <Text className="text-secondary-dark font-medium mt-2">{getLabel(score)}</Text>
      </View> */}

      <View className="flex-row justify-between">
        <TouchableOpacity onPress={() => onPressPerson("member")} className="items-center flex-1">
          <Text className="text-secondary text-sm">{member1.fullname}</Text>
          <Image
            source={{ uri: member1.avatar || "https://placeholder.svg?height=50&width=50" }}
            className="w-12 h-12 rounded-full my-2"
          />
          <View className="bg-primary/10 rounded-lg px-3 py-2">
            <Text className="text-primary font-bold">{mbti1 || "N/A"}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-primary text-xs">Xem chi tiết</Text>
            <ChevronRight size={12} color="#E83E8C" />
          </View>
        </TouchableOpacity>

        <View className="items-center mx-4 justify-center">
          <Heart size={24} color="#E83E8C" />
        </View>

        <TouchableOpacity onPress={() => onPressPerson("member1")} className="items-center flex-1">
          <Text className="text-secondary text-sm">{member2.fullname}</Text>
          <Image
            source={{ uri: member2.avatar || "https://placeholder.svg?height=50&width=50" }}
            className="w-12 h-12 rounded-full my-2"
          />
          <View className="bg-secondary/10 rounded-lg px-3 py-2">
            <Text className="text-secondary font-bold">{mbti2 || "N/A"}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-secondary text-xs">Xem chi tiết</Text>
            <ChevronRight size={12} color="#6C757D" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CompatibilityScore
