"use client"

import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Users, Clock, Heart, User } from "lucide-react-native"
import InputField from "../../components/InputField"
import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"
import coupleApi from "@/src/config/api/couple.api"

const formatDateLocal = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const mi = String(date.getMinutes()).padStart(2, "0")
  const ss = String(date.getSeconds()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`
}

const SelfCheckScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { isSurvey } = route.params
  const { user } = useAuth()

  const { selectedSurveyIds } = route.params || { selectedSurveyIds: [] }

  const [formData, setFormData] = useState({
    partnerName: "",
    partnerDob: "",
    partnerGender: "",
    relationshipDuration: "",
    relationshipStatus: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dobDate, setDobDate] = useState<Date | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDobDate(selectedDate)
      setFormData((prev) => ({
        ...prev,
        partnerDob: selectedDate.toISOString().split("T")[0], // Hiển thị đơn giản YYYY-MM-DD
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.partnerName.trim()) {
      newErrors.partnerName = "Vui lòng nhập tên đối tác"
    }

    if (!formData.partnerDob) {
      newErrors.partnerDob = "Vui lòng chọn ngày sinh"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return


    try {
      const result = await coupleApi.createVirtualCouple({
        surveyIds: selectedSurveyIds,
        virtualName: formData.partnerName,
        virtualDob: formatDateLocal(dobDate || new Date()),

      })




      if (typeof result !== "string" && result.success === false) {
        const message = result.error || "Không thể tạo phòng ảo"
        throw new Error(message)
      }


      const coupleId = typeof result === "string" ? result : result?.data


      navigation.navigate("CoupleSurveyRoom", {
        coupleId,
        isSurvey: isSurvey ?? false,
      })
    } catch (error: any) {


      const message = error?.message || "Không thể tạo phòng ảo"

      if (message.includes("active room") || message.includes("sẵn phòng")) {
        Alert.alert(
          "Bạn đã có phòng",
          "Bạn đã tạo một phòng ảo trước đó. Bạn muốn làm gì?",
          [
            {
              text: "Hủy",
              onPress: () => navigation.goBack(),
              style: "cancel",
            },
            {
              text: "Vào phòng hiện tại",
              onPress: async () => {
                try {
                  const existingRoom = await coupleApi.getLatestCoupleRoom()
                  console.log("🔵 Đã lấy được phòng hiện tại:", existingRoom)

                  navigation.navigate("CoupleSurveyRoom", {
                    coupleId: existingRoom.id,
                    isSurvey: isSurvey ?? false,
                  })
                } catch (getRoomError) {

                  Alert.alert("Lỗi", "Không thể lấy thông tin phòng hiện tại.")
                }
              },
            },
            {
              text: "Xóa phòng cũ & tạo mới",
              onPress: async () => {
                try {

                  await coupleApi.cancelCoupleRoom()


                  const newResult = await coupleApi.createVirtualCouple({
                    surveyIds: selectedSurveyIds,
                    virtualName: formData.partnerName,
                    virtualDob: formatDateLocal(dobDate || new Date()),
                  })



                  if (typeof newResult !== "string" && newResult.success === false) {
                    throw new Error(newResult.error || "Không thể tạo lại phòng ảo")
                  }

                  const coupleId = typeof newResult === "string" ? newResult : newResult?.data


                  navigation.navigate("CoupleSurveyRoom", {
                    coupleId,
                    isSurvey: isSurvey ?? false,
                  })
                } catch (err: any) {

                  Alert.alert("Lỗi", err?.message || "Không thể tạo lại phòng ảo")
                }
              },
              style: "destructive",
            },
          ]
        )
      } else {
        Alert.alert("Lỗi", message)
      }
    }
  }



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }} // Sử dụng style thay vì className
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Có thể điều chỉnh offset nếu cần
    >
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          {/* Header */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <View className="items-center mb-4">
              <View className="bg-primary/10 rounded-full p-4 mb-3">
                <Heart size={32} color="#E83E8C" />
              </View>
              <Text className="text-xl font-bold text-secondary-dark text-center">Bộ khảo sát tổng hợp</Text>
              <Text className="text-secondary text-center mt-2">
                Vui lòng điền thông tin của đối tác để bắt đầu khảo sát
              </Text>
            </View>
          </View>

          {/* User Info Display */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-l-4 border-success">
            <View className="flex-row items-center mb-3">
              <View className="bg-success/10 rounded-full p-3 mr-3">
                <User size={24} color="#28A745" />
              </View>
              <Text className="text-lg font-bold text-secondary-dark">Thông tin của bạn</Text>
            </View>
            <View className="bg-success/5 rounded-xl p-4">
              <Text className="text-secondary-dark font-medium">{user?.name || user?.email || "Người dùng"}</Text>
              <Text className="text-secondary text-sm">Đã đăng nhập</Text>
            </View>
          </View>

          {/* Partner Information */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center mb-6">
              <View className="bg-primary/10 rounded-full p-3 mr-3">
                <Users size={24} color="#E83E8C" />
              </View>
              <Text className="text-lg font-bold text-secondary-dark">Thông tin đối tác</Text>
            </View>

            <InputField
              label="Tên đối tác *"
              value={formData.partnerName}
              onChangeText={(value) => handleInputChange("partnerName", value)}
              placeholder="Nhập tên đối tác"
              error={errors.partnerName}
              icon={<Heart size={18} color="#E83E8C" />}
            />

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-secondary-dark">
                Ngày sinh đối tác *
              </Text>

              <TouchableOpacity
                className="bg-gray-100 px-4 py-3 rounded-xl flex-row items-center justify-between"
                onPress={() => setShowDatePicker(true)}
              >
                <View className="flex-row items-center space-x-2">
                  <Clock size={20} color="#E83E8C" />
                  <Text
                    className={`text-sm ml-2 ${formData.partnerDob ? "text-secondary-dark" : "text-gray-400"
                      }`}
                  >
                    {formData.partnerDob || "Chọn ngày sinh"}
                  </Text>
                </View>
              </TouchableOpacity>

              {errors.partnerDob && (
                <Text className="text-red-500 text-xs mt-2">{errors.partnerDob}</Text>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={dobDate || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>


            <InputField
              label="Giới tính đối tác"
              value={formData.partnerGender}
              onChangeText={(value) => handleInputChange("partnerGender", value)}
              placeholder="Nam/Nữ/Khác"
            />
          </View>

          {/* Relationship Information */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center mb-6">
              <View className="bg-primary/10 rounded-full p-3 mr-3">
                <Clock size={24} color="#E83E8C" />
              </View>
              <Text className="text-lg font-bold text-secondary-dark">Thông tin mối quan hệ</Text>
            </View>

            <InputField
              label="Thời gian yêu nhau/kết hôn"
              value={formData.relationshipDuration}
              onChangeText={(value) => handleInputChange("relationshipDuration", value)}
              placeholder="Ví dụ: 2 năm, 6 tháng..."
              icon={<Clock size={18} color="#E83E8C" />}
            />
          </View>

          {/* Action Button */}
          <CustomButton onPress={handleSubmit} className="mb-6">
            <Text className="text-white font-bold text-center">Bắt đầu khảo sát</Text>
          </CustomButton>

          {/* Privacy Notice */}
          <View className="bg-info/5 rounded-xl p-4">
            <Text className="text-xs text-secondary-dark text-center">
              🔒 Thông tin của bạn được bảo mật tuyệt đối và chỉ được sử dụng để phân tích kết quả khảo sát. Chúng tôi
              không chia sẻ thông tin với bất kỳ bên thứ ba nào.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SelfCheckScreen
