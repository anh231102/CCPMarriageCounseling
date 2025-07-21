import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { User } from "lucide-react-native"

interface Props {
  rec1: string | null
  rec2: string | null
  onRegister: () => void
}

const CounselorRecommendation = ({ rec1, rec2, onRegister }: Props) => {
  if (!rec1 && !rec2) {
    return (
      <View className="items-center p-6 bg-gray-50 rounded-lg">
        <View className="bg-primary/10 rounded-full p-4 mb-4">
          <User size={32} color="#E83E8C" />
        </View>
        <Text className="text-secondary-dark font-bold text-lg mb-2 text-center">
          Chưa có lời khuyên từ tư vấn viên
        </Text>
        <Text className="text-secondary text-center mb-4">
          Hãy đăng ký tư vấn ngay để có thể nhận được lời khuyên và chia sẻ từ tư vấn viên chuyên nghiệp
        </Text>
        <TouchableOpacity onPress={onRegister} className="bg-primary rounded-lg px-6 py-3">
          <Text className="text-white font-medium">Đăng ký tư vấn ngay</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      {rec1 && (
        <View className="mb-4 p-4 bg-primary/5 rounded-lg">
          <Text className="text-primary font-medium mb-2">Khuyến nghị 1</Text>
          <Text className="text-secondary-dark">{rec1}</Text>
        </View>
      )}
      {rec2 && (
        <View className="mb-4 p-4 bg-primary/5 rounded-lg">
          <Text className="text-primary font-medium mb-2">Khuyến nghị 2</Text>
          <Text className="text-secondary-dark">{rec2}</Text>
        </View>
      )}
    </View>
  )
}

export default CounselorRecommendation
