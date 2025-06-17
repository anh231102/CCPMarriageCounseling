"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Calendar, Clock, User, CheckCircle } from "lucide-react-native"

const AppointmentConfirmationScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { counselor, appointmentInfo } = route.params

  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = () => {
    setIsLoading(true)

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert(
        "Đặt lịch thành công",
        "Lịch hẹn của bạn đã được xác nhận. Chúng tôi sẽ gửi thông báo nhắc nhở trước buổi tư vấn.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("AppointmentHistory")
            },
          },
        ],
      )
    }, 1500)
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Thông tin buổi tư vấn</Text>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <User size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Chuyên gia</Text>
              <Text className="text-secondary-dark font-medium">{counselor.name}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Calendar size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Ngày</Text>
              <Text className="text-secondary-dark font-medium">
                {appointmentInfo.date.day}, {appointmentInfo.date.formatted}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Clock size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Thời gian</Text>
              <Text className="text-secondary-dark font-medium">{appointmentInfo.time.time}</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <appointmentInfo.type.icon size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Hình thức</Text>
              <Text className="text-secondary-dark font-medium">{appointmentInfo.type.name}</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Ghi chú cho chuyên gia</Text>
          <TextInput
            className="border border-gray-200 rounded-lg p-3 min-h-[100px] text-secondary-dark"
            placeholder="Nhập thông tin về vấn đề bạn muốn tư vấn..."
            multiline
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-secondary-dark">Tổng thanh toán</Text>
            <Text className="text-primary font-bold text-lg">{counselor.price}</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <CheckCircle size={18} color="#28A745" className="mr-2" />
            <Text className="text-secondary">Thanh toán khi tư vấn</Text>
          </View>

          <View className="flex-row items-center">
            <CheckCircle size={18} color="#28A745" className="mr-2" />
            <Text className="text-secondary">Miễn phí hủy trước 24 giờ</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={isLoading}
          className={`rounded-lg p-4 items-center mb-6 ${isLoading ? "bg-primary-light" : "bg-primary"}`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Xác nhận đặt lịch</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default AppointmentConfirmationScreen
