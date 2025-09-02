"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Calendar, Clock, User, CheckCircle, Timer, Video, Mic, Phone } from "lucide-react-native"
import bookingApi from "@/src/config/api/booking.api"
import Loading from "@/src/components/share/Loading"

type SubCategory = {
  id: string
  name: string
}

const typeIcons: Record<string, any> = {
  video: Video,
  audio: Mic,
  phone: Phone,
}

const AppointmentConfirmationScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { counselor, appointmentInfo } = route.params

  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [selectedSubCategories, setSelectedSubCategories] = useState<SubCategory[]>([])
  const [discountPercent, setDiscountPercent] = useState<number>(0)

  const toggleSubCategory = (sub: SubCategory) => {
    setSelectedSubCategories((prev) => {
      const exists = prev.find((s) => s.id === sub.id)
      if (exists) {
        return prev.filter((s) => s.id !== sub.id)
      } else {
        return [...prev, sub]
      }
    })
  }



  const isSelected = (sub: SubCategory) =>
    selectedSubCategories.some((s) => s.id === sub.id)

  const buildDateTime = (rawDate: string, hour: string): Date => {
    const baseDate = new Date(rawDate)
    const [hourNum, minuteNum] = hour.split(":").map(Number)
    baseDate.setHours(hourNum)
    baseDate.setMinutes(minuteNum)
    baseDate.setSeconds(0)
    baseDate.setMilliseconds(0)
    return baseDate
  }

  const formatDateLocal = (date: Date): string => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    const hh = String(date.getHours()).padStart(2, "0")
    const mi = String(date.getMinutes()).padStart(2, "0")
    const ss = String(date.getSeconds()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`
  }

  const originalPrice = appointmentInfo.totalPrice
  const discountAmount = Math.round((originalPrice * discountPercent) / 100)
  const finalPrice = originalPrice - discountAmount

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const percent = await bookingApi.getMyBookingDiscount()
        setDiscountPercent(percent)
      } catch (error) {
        
      }
    }

    fetchDiscount()
  }, [])

  const onConfirmBooking = async () => {
    setIsLoading(true)
    try {
      const { date, time } = appointmentInfo
      const timeStartDate = buildDateTime(date.raw, time.startTime)
      const timeEndDate = new Date(timeStartDate.getTime() + time.duration * 60000)

      const timeStart = formatDateLocal(timeStartDate)
      const timeEnd = formatDateLocal(timeEndDate)

      const bookingData = {
        counselorId: counselor.id,
        timeStart,
        timeEnd,
        note: note || "",
        subCategoryIds: selectedSubCategories.map((s) => s.id),
      }
      
      const result = await bookingApi.postBooking(bookingData)

      setIsLoading(false)
      setConfirmModalVisible(false)
      Alert.alert(
        "Đặt lịch thành công",
        result.message || "Lịch hẹn của bạn đã được xác nhận.",
        [{
          text: "OK", onPress: () =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "CounselorsTab",
                  state: {
                    routes: [{ name: "AppointmentHistory" }]
                  }
                }
              ]
            })
        }]
      )
    } catch (error: any) {
      setIsLoading(false)
      setConfirmModalVisible(false)

      Alert.alert("Thông báo", error.response?.data?.error || error.message || "Không thể đặt lịch hẹn")
    }
  }

  const handleConfirm = () => {
    setConfirmModalVisible(true)
  }

  const TypeIcon = typeIcons[appointmentInfo.type.id] || Video

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Thông tin buổi tư vấn */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Thông tin buổi tư vấn</Text>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <User size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Chuyên gia</Text>
              <Text className="text-secondary-dark font-medium">{counselor.fullname}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Calendar size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Ngày</Text>
              <Text className="text-secondary-dark font-medium">
                {appointmentInfo.date.formatted}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Clock size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Thời gian bắt đầu</Text>
              <Text className="text-secondary-dark font-medium">
                {appointmentInfo.time.startTime}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Timer size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Thời lượng buổi tư vấn</Text>
              <Text className="text-secondary-dark font-medium">
                {appointmentInfo.time.duration} phút
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <TypeIcon size={18} color="#E83E8C" />
            </View>
            <View>
              <Text className="text-secondary">Hình thức</Text>
              <Text className="text-secondary-dark font-medium">
                {appointmentInfo.type.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Ghi chú */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Ghi chú cho chuyên gia</Text>
          <TextInput
            className="border border-gray-200 rounded-lg p-3 min-h-[100px] text-secondary-dark"
            placeholder="Nhập thông tin về vấn đề bạn muốn tư vấn..."
            placeholderTextColor="#6C757D"
            multiline
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Chọn lĩnh vực */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-2">Lĩnh vực bạn muốn chuyên gia chú ý</Text>
          <TouchableOpacity
            className="bg-primary/10 p-3 rounded-lg mb-3"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-primary font-medium">+ Chọn lĩnh vực quan tâm</Text>
          </TouchableOpacity>

          <View className="flex-row flex-wrap">
            {[...new Map(selectedSubCategories.map(sub => [sub.id, sub])).values()].map((sub) => (
              <View key={sub.id} className="bg-primary/10 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-primary">{sub.name}</Text>
              </View>
            ))}


          </View>

          {/* Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 bg-black/30 justify-center items-center">
              <View className="bg-white p-5 rounded-lg w-[90%] max-h-[70%]">
                <Text className="text-lg font-bold text-secondary-dark mb-4">Chọn lĩnh vực</Text>
                <ScrollView className="mb-4">
                  {counselor.subCategories.map((sub: SubCategory) => (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => toggleSubCategory(sub)}
                      className={`flex-row items-center mb-2 p-2 rounded ${isSelected(sub) ? "bg-primary/20" : ""}`}
                    >
                      <View
                        className={`w-5 h-5 mr-2 border rounded ${isSelected(sub) ? "bg-primary border-primary" : "border-gray-300"}`}
                      />
                      <Text className="text-secondary-dark">{sub.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View className="flex-row justify-end">
                  <TouchableOpacity className="px-4 py-2 mr-2" onPress={() => setModalVisible(false)}>
                    <Text className="text-gray-600">Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-primary px-4 py-2 rounded" onPress={() => setModalVisible(false)}>
                    <Text className="text-white">OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* Tổng thanh toán */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <View className="mb-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-secondary-dark">Giá gốc</Text>
              <Text className="text-secondary-dark">
                {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(originalPrice)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-secondary-dark">Giảm giá ({discountPercent}%)</Text>
              <Text className="text-green-600">
                -{Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discountAmount)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-lg font-bold text-secondary-dark">Tổng thanh toán</Text>
              <Text className="text-primary font-bold text-lg">
                {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
              </Text>
            </View>
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

        {/* Nút xác nhận */}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={isLoading}
          className={`rounded-lg p-4 items-center mb-6 ${isLoading ? "bg-primary-light" : "bg-primary"}`}
        >

          <Text className="text-white font-bold text-lg">Đặt lịch</Text>

        </TouchableOpacity>
      </View>

      {/* Modal xác nhận */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-[90%] rounded-2xl p-6 shadow-2xl border border-white">
            <Text className="text-2xl font-bold text-center text-pink-700 mb-4">Xác nhận đặt lịch</Text>

            <View className="border-t border-pink-200 mb-4" />

            <View className="mb-3">
              <Text className="text-sm text-pink-500"> Chuyên gia</Text>
              <Text className="text-base text-pink-700">{counselor.fullname}</Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-pink-500">📅 Ngày</Text>
              <Text className="text-base text-pink-700">{appointmentInfo.date.formatted}</Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-pink-500">⏰ Giờ bắt đầu</Text>
              <Text className="text-base text-pink-700">{appointmentInfo.time.startTime}</Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-pink-500">⏳ Thời lượng</Text>
              <Text className="text-base text-pink-700">{appointmentInfo.time.duration} phút</Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-pink-500">📞 Hình thức</Text>
              <Text className="text-base text-pink-700">{appointmentInfo.type.name}</Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-pink-500">📝 Ghi chú</Text>
              <Text className="text-base text-pink-700">{note || "Không có"}</Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-pink-500 mb-1">💡 Lĩnh vực quan tâm</Text>
              {selectedSubCategories.length > 0 ? (
                <View className="flex-row flex-wrap">
                  {[...new Map(selectedSubCategories.map(sub => [sub.id, sub])).values()].map((sub) => (
                    <View key={sub.id} className="bg-primary/10 rounded-full px-3 py-1 mr-2 mb-2">
                      <Text className="text-primary">{sub.name}</Text>
                    </View>
                  ))}


                </View>
              ) : (
                <Text className="ml-2 text-base text-gray-400">Không chọn</Text>
              )}
            </View>

            <View className="border-t border-pink-200 mb-4" />

            {/* ... Giữ các phần chuyên gia, ngày, giờ, ghi chú như cũ ... */}

            <View className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-pink-500">Giá gốc</Text>
                <Text className="text-sm text-pink-700">
                  {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(originalPrice)}
                </Text>
              </View>

              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-pink-500">Giảm giá ({discountPercent}%)</Text>
                <Text className="text-sm text-green-600">
                  -{Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discountAmount)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-lg font-bold text-pink-700">Tổng thanh toán</Text>
                <Text className="text-lg font-bold text-pink-600">
                  {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="px-4 py-2 mr-2"
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text className="text-pink-600 font-medium">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-500 px-5 py-2 w-28 rounded-full items-center justify-center"
                onPress={onConfirmBooking}
              >
                {isLoading ? (
                  <Loading size={20} color="#fff" style={null} />
                ) : (
                  <Text className="text-white font-semibold">Xác nhận</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>



    </ScrollView>
  )
}

export default AppointmentConfirmationScreen
