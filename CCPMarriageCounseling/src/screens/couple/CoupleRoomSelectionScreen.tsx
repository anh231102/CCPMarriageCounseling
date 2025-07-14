"use client"

import { useNavigation } from "@react-navigation/native"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import {
  Plus,
  Hash,
  Users,
  ArrowRight,
  Heart,
  Crown,
} from "lucide-react-native"

import { useAuth } from "@/src/hooks/useAuth"
import ActiveCoupleRoomCard from "@/src/components/couple/ActiveCoupleRoomCard"

const CoupleRoomSelectionScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const handleCreateNewRoom = () => {
    navigation.navigate("CoupleSurveySelection")
  }

  const handleJoinWithCode = () => {
    navigation.navigate("JoinCoupleRoom")
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary p-6">
        <Text className="text-white text-2xl font-bold mb-1">Phòng khảo sát cặp đôi</Text>
        <Text className="text-white/90">Chọn cách thức tham gia khảo sát</Text>
      </View>

      <ScrollView className="flex-1 px-4 -mt-4" showsVerticalScrollIndicator={false}>
        {/* Phòng đang tham gia */}
        <ActiveCoupleRoomCard />

        {/* Tạo phòng mới */}
        <TouchableOpacity
          onPress={handleCreateNewRoom}
          className="bg-white rounded-xl p-6 mb-4 shadow-sm border-l-4 border-primary"
        >
          <View className="flex-row items-center mb-4">
            <View className="bg-primary/10 rounded-full p-4 mr-4">
              <Plus size={28} color="#E83E8C" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-secondary-dark">Tạo phòng mới</Text>
              <Text className="text-secondary">Tạo phòng khảo sát và mời đối tác tham gia</Text>
            </View>
            <ArrowRight size={20} color="#E83E8C" />
          </View>

          <View className="bg-primary/5 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Crown size={16} color="#E83E8C" />
              <Text className="text-primary font-medium ml-2">Bạn sẽ là chủ phòng</Text>
            </View>
            <Text className="text-secondary text-sm">
              • Tạo mã phòng để chia sẻ với đối tác{"\n"}
              • Quản lý tiến trình khảo sát{"\n"}
              • Tạo bản đồ tình yêu khi cả hai hoàn thành
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tham gia bằng mã */}
        <TouchableOpacity
          onPress={handleJoinWithCode}
          className="bg-white rounded-xl p-6 mb-6 shadow-sm border-l-4 border-info"
        >
          <View className="flex-row items-center mb-4">
            <View className="bg-info/10 rounded-full p-4 mr-4">
              <Hash size={28} color="#17A2B8" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-secondary-dark">Tham gia bằng mã</Text>
              <Text className="text-secondary">Nhập mã phòng do đối tác chia sẻ</Text>
            </View>
            <ArrowRight size={20} color="#17A2B8" />
          </View>

          <View className="bg-info/5 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Users size={16} color="#17A2B8" />
              <Text className="text-info font-medium ml-2">Tham gia với tư cách thành viên</Text>
            </View>
            <Text className="text-secondary text-sm">
              • Nhập mã phòng 8 ký tự{"\n"}
              • Tham gia phòng do đối tác tạo{"\n"}
              • Cùng làm khảo sát và xem kết quả
            </Text>
          </View>
        </TouchableOpacity>

        {/* Info Section */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-primary/10 rounded-full p-3 mr-3">
              <Heart size={24} color="#E83E8C" />
            </View>
            <Text className="text-lg font-bold text-secondary-dark">Về phòng khảo sát cặp đôi</Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
              <Text className="text-secondary-dark flex-1">
                <Text className="font-medium">Khảo sát đồng bộ:</Text> Cả hai cùng làm bài và xem kết quả thời gian thực
              </Text>
            </View>

            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
              <Text className="text-secondary-dark flex-1">
                <Text className="font-medium">Bản đồ tình yêu chi tiết:</Text> Phân tích tương thích dựa trên cả hai kết quả
              </Text>
            </View>

            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
              <Text className="text-secondary-dark flex-1">
                <Text className="font-medium">Bảo mật cao:</Text> Chỉ hai người trong phòng có thể xem kết quả
              </Text>
            </View>
          </View>
        </View>

        {/* Requirements */}
        <View className="bg-warning/5 rounded-xl p-4 mb-6">
          <Text className="text-warning font-medium mb-2">⚠️ Lưu ý</Text>
          <Text className="text-secondary-dark text-sm">
            • Cần gói Premium hoặc Cặp đôi để sử dụng tính năng này{"\n"}
            • Mỗi người chỉ có thể tham gia một phòng tại một thời điểm{"\n"}
            • Phòng sẽ tự động đóng sau 24 giờ không hoạt động
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default CoupleRoomSelectionScreen
