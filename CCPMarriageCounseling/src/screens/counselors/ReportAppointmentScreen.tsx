"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Flag } from "lucide-react-native"
import bookingApi from "@/src/config/api/booking.api"
import Loading from "@/src/components/share/Loading"

const ReportAppointmentScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { appointmentId, counselor } = route.params

  const [reportMessage, setReportMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
  if (reportMessage.trim() === "") {
    Alert.alert("Thông báo", "Vui lòng nhập nội dung báo cáo")
    return
  }

  // Hiển thị hộp thoại xác nhận với nội dung báo cáo
  Alert.alert(
    "Xác nhận gửi báo cáo",
    `Bạn có chắc chắn muốn gửi báo cáo với nội dung:\n\n"${reportMessage.trim()}"`,
    [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: async () => {
          setIsLoading(true)
          try {
            await bookingApi.reportBooking({
              bookingId: appointmentId,
              reportMessage: reportMessage.trim(),
            })
            setIsLoading(false)
            Alert.alert("Thành công", "Báo cáo đã được gửi!", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("AppointmentHistory")
                },
              },
            ])
          } catch (error: any) {
            setIsLoading(false)
            Alert.alert("Lỗi", error.message || "Không thể gửi báo cáo.")
          }
        },
      },
    ]
  )
}


  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4 items-center">
          <Image source={{ uri: counselor.avatar }} className="w-20 h-20 rounded-full mb-2" />
          <Text className="text-secondary-dark font-bold text-lg">{counselor.fullname}</Text>
          <Text className="text-secondary">{counselor.specialty}</Text>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Báo cáo buổi tư vấn</Text>

          <Text className="text-secondary mb-3">Vui lòng nhập nội dung báo cáo chi tiết:</Text>
          <TextInput
            className="border border-gray-200 rounded-lg p-3 min-h-[120px] text-secondary-dark"
            placeholder="Mô tả vấn đề bạn gặp phải trong buổi tư vấn..."
            multiline
            textAlignVertical="top"
            value={reportMessage}
            onChangeText={setReportMessage}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`rounded-lg p-4 items-center mb-6 ${isLoading ?  "bg-primary-light" : "bg-primary"}`}
        >
          {isLoading ? (
            <Loading size={30} color="#FFFFFF"/>
          ) : (
            <Text className="text-white font-bold text-lg">Gửi báo cáo</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default ReportAppointmentScreen
