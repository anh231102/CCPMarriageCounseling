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
  Image,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Users, Clock, Heart, User, Camera, Shield, Calendar } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import InputField from "../../components/InputField"
import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"
import coupleApi from "@/src/config/api/couple.api"
import MyProfileComponent from "@/src/components/share/MyProfileComponent"
import * as ImagePicker from "expo-image-picker"
import { Picker } from "@react-native-picker/picker"
import uploadImageApi from "@/src/config/api/uploadImage.api"

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
  const [avatar, setAvatar] = useState("")
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

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Cần quyền truy cập ảnh");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      try {
        // Upload ảnh lên Cloudinary
        const imageUrl = await uploadImageApi.uploadImageToCloudinary(selectedImage.uri);
        setAvatar(imageUrl || ""); // Lưu URL ảnh đã upload
      } catch (err) {

        let errorMsg = "Không thể upload ảnh";
        if (typeof err === "string") errorMsg = err;
        else if (err instanceof Error && err.message) errorMsg = err.message;
        else if (typeof err === "object" && err !== null && "message" in err) errorMsg = (err as any).message;
        Alert.alert("Lỗi upload ảnh", errorMsg);

      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      const result = await coupleApi.createVirtualCouple({
        surveyIds: selectedSurveyIds,
        virtualName: formData.partnerName,
        virtualDob: formatDateLocal(dobDate || new Date()),
        virtualAvatar: avatar || "",
        virtualDescription: formData.relationshipDuration,
        virtualRelationship: formData.relationshipStatus,
        virtualGender: formData.partnerGender,
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
      if (message.includes("active room") || message.includes("phòng đang hoạt động")) {
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
                    virtualAvatar: avatar || "",
                    virtualDescription: formData.relationshipDuration,
                    virtualRelationship: formData.relationshipStatus,
                    virtualGender: formData.partnerGender,
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
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Header */}
          <View className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden">
            <LinearGradient
              colors={["#E83E8C", "#FF6B9D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 24,
              }}
            >

              <View className="items-center">
                <View className="bg-white/20 rounded-full p-4 mb-4">
                  <Heart size={32} color="#fff" />
                </View>
                <Text className="text-white text-2xl font-bold text-center mb-2">Bộ khảo sát tổng hợp</Text>
                <Text className="text-white/90 text-center leading-5">
                  Vui lòng điền thông tin của đối tác để bắt đầu khảo sát
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* User Info Display */}
          <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <View className="bg-green-50 p-4 border-b border-green-100">
              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-full p-3 mr-3">
                  <User size={24} color="#10B981" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-800">Thông tin của bạn</Text>
                  <Text className="text-green-600 text-sm font-medium">✓ Đã đăng nhập</Text>
                </View>
              </View>
            </View>
            <View className="p-4">
              <Text className="text-gray-800 font-semibold text-base">
                {user?.name || user?.email || "Người dùng"}
              </Text>
            </View>
          </View>

          {/* Partner Information */}
          <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <View className="bg-pink-50 p-4 border-b border-pink-100">
              <View className="flex-row items-center">
                <View className="bg-pink-100 rounded-full p-3 mr-3">
                  <Users size={24} color="#E83E8C" />
                </View>
                <Text className="text-lg font-bold text-gray-800">Thông tin đối tác</Text>
              </View>
            </View>

            <View className="p-6">
              {/* Avatar Section */}
              <View className="items-center mb-6">
                <View className="relative">
                  {/* Ảnh avatar chính */}
                  <Image
                    source={avatar ? { uri: avatar } : require("../../../assets/images/avatar.jpg")}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                  />

                  {/* Nút chọn ảnh */}
                  <TouchableOpacity
                    onPress={handlePickAvatar}
                    className="absolute bottom-0 right-0 rounded-full shadow-lg overflow-hidden"
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#E83E8C", "#FF6B9D"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        padding: 8,
                      }}
                    >

                      <Camera size={16} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-500 text-sm mt-2">Chọn ảnh đại diện cho đối tác</Text>
              </View>

              {/* Form Fields */}
              <InputField
                label="Tên đối tác *"
                value={formData.partnerName}
                onChangeText={(value) => handleInputChange("partnerName", value)}
                placeholder="Nhập tên đối tác"
                error={errors.partnerName}
                icon={<Heart size={18} color="#E83E8C" />}
              />

              {/* Date Picker */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-800">Ngày sinh đối tác *</Text>
                <TouchableOpacity
                  className="bg-gray-50 px-4 py-3 rounded-xl flex-row items-center justify-between border border-gray-200"
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Calendar size={18} color="#3B82F6" />
                    </View>
                    <Text
                      className={`text-base ${formData.partnerDob ? "text-gray-800 font-medium" : "text-gray-400"
                        }`}
                    >
                      {formData.partnerDob || "Chọn ngày sinh"}
                    </Text>
                  </View>
                </TouchableOpacity>
                {errors.partnerDob && <Text className="text-red-500 text-xs mt-2">{errors.partnerDob}</Text>}
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

              {/* Gender Picker */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-800">Giới tính đối tác</Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <Picker
                    selectedValue={formData.partnerGender}
                    onValueChange={(value) => handleInputChange("partnerGender", value)}
                    style={{ height: 54 }}
                    itemStyle={{ fontSize: 12 }}
                  >
                    <Picker.Item label="Chọn giới tính" value="" />
                    <Picker.Item label="Nam" value="Nam" />
                    <Picker.Item label="Nữ" value="Nữ" />
                    <Picker.Item label="Khác" value="Khác" />
                  </Picker>
                </View>
              </View>

              <InputField
                label="Trạng thái mối quan hệ *"
                value={formData.relationshipStatus}
                onChangeText={(value) => handleInputChange("relationshipStatus", value)}
                placeholder="Vợ/chồng, Người yêu, Hẹn hò..."
                error={errors.relationshipStatus}
              />
            </View>
          </View>

          {/* Relationship Information */}
          <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <View className="bg-purple-50 p-4 border-b border-purple-100">
              <View className="flex-row items-center">
                <View className="bg-purple-100 rounded-full p-3 mr-3">
                  <Clock size={24} color="#8B5CF6" />
                </View>
                <Text className="text-lg font-bold text-gray-800">Thông tin mối quan hệ</Text>
              </View>
            </View>
            <View className="p-6">
              <InputField
                label="Thời gian yêu nhau/kết hôn"
                value={formData.relationshipDuration}
                onChangeText={(value) => handleInputChange("relationshipDuration", value)}
                placeholder="Ví dụ: 2 năm, 6 tháng..."
                icon={<Clock size={18} color="#8B5CF6" />}
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity onPress={handleSubmit} className="mb-6 rounded-2xl overflow-hidden shadow-lg">
            <LinearGradient
              colors={["#E83E8C", "#FF6B9D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 16,
                alignItems: "center",
              }}
            >

              <Text className="text-white font-bold text-lg">Bắt đầu khảo sát</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Privacy Notice */}
          <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <View className="flex-row items-start">
              <View className="bg-blue-100 p-2 rounded-lg mr-3 mt-1">
                <Shield size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-blue-800 font-semibold text-sm mb-1">Bảo mật thông tin</Text>
                <Text className="text-blue-700 text-xs leading-5">
                  Thông tin của bạn được bảo mật tuyệt đối và chỉ được sử dụng để phân tích kết quả khảo sát. Chúng
                  tôi không chia sẻ thông tin với bất kỳ bên thứ ba nào.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SelfCheckScreen
