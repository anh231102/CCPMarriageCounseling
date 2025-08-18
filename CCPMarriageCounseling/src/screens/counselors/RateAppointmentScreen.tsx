"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Star } from "lucide-react-native"
import bookingApi from "@/src/config/api/booking.api"
import Loading from "@/src/components/share/Loading"


const RateAppointmentScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { appointmentId, counselor } = route.params

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
  if (rating === 0) {
    Alert.alert("Thông báo", "Vui lòng chọn số sao đánh giá")
    return
  }

  Alert.alert(
    "Xác nhận gửi đánh giá",
    `Bạn đánh giá ${rating} sao với nhận xét:\n\n"${comment}"`,
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
            await bookingApi.rateBooking({
              bookingId: appointmentId,
              rating: rating,
              feedback: comment.trim(),
            })

            setIsLoading(false)
            Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá buổi tư vấn!", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("AppointmentHistory")
                },
              },
            ])
          } catch (error: any) {
            setIsLoading(false)
            Alert.alert("Lỗi", error.message || "Không thể gửi đánh giá.")
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
          <Text className="text-lg font-bold text-secondary-dark mb-4">Đánh giá buổi tư vấn</Text>

          <View className="items-center mb-6">
            <Text className="text-secondary mb-3">Bạn đánh giá buổi tư vấn này như thế nào?</Text>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} className="mx-2">
                  <Star size={32} color="#FFC107" fill={rating >= star ? "#FFC107" : "transparent"} />
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-primary mt-2 font-medium">
              {rating === 1
                ? "Không hài lòng"
                : rating === 2
                  ? "Tạm được"
                  : rating === 3
                    ? "Bình thường"
                    : rating === 4
                      ? "Hài lòng"
                      : rating === 5
                        ? "Rất hài lòng"
                        : ""}
            </Text>
          </View>

          <Text className="text-secondary-dark font-medium mb-2">Nhận xét của bạn</Text>
          <TextInput
            className="border border-gray-200 rounded-lg p-3 min-h-[120px] text-secondary-dark"
            placeholder="Chia sẻ trải nghiệm của bạn về buổi tư vấn này..."
            placeholderTextColor="#6C757D"
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`rounded-lg p-4 items-center mb-6 ${isLoading ? "bg-primary-light" : "bg-primary"}`}
        >
          {isLoading ? (
            <Loading size={30} color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Gửi đánh giá</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default RateAppointmentScreen
