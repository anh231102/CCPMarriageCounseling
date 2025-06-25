"use client"

import { useState } from "react"
import { View, Text, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Users, Clock, Heart, User } from "lucide-react-native"
import InputField from "../../components/InputField"
import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"

const SelfCheckScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    partnerName: "",
    partnerAge: "",
    partnerGender: "",
    relationshipDuration: "",
    relationshipStatus: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.partnerName.trim()) {
      newErrors.partnerName = "Vui lòng nhập tên đối tác"
    }

    if (formData.partnerAge && isNaN(Number(formData.partnerAge))) {
      newErrors.partnerAge = "Tuổi phải là số"
    }

    if (!formData.relationshipStatus.trim()) {
      newErrors.relationshipStatus = "Vui lòng chọn trạng thái mối quan hệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      navigation.navigate("SurveyQuestions", {
        userType: "self-check",
        userData: {
          name: user?.name || user?.email || "Bạn",
          ...formData,
        },
      })
    }
  }

  return (
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

          <InputField
            label="Tuổi đối tác"
            value={formData.partnerAge}
            onChangeText={(value) => handleInputChange("partnerAge", value)}
            placeholder="Nhập tuổi"
            keyboardType="numeric"
            error={errors.partnerAge}
          />

          <InputField
            label="Giới tính đối tác"
            value={formData.partnerGender}
            onChangeText={(value) => handleInputChange("partnerGender", value)}
            placeholder="Nam/Nữ/Khác"
          />

          <InputField
            label="Trạng thái mối quan hệ *"
            value={formData.relationshipStatus}
            onChangeText={(value) => handleInputChange("relationshipStatus", value)}
            placeholder="Vợ/chồng, Người yêu, Hẹn hò..."
            error={errors.relationshipStatus}
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
  )
}

export default SelfCheckScreen
