"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Camera } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"

const EditProfileScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState("0912345678") // Giả lập số điện thoại
  const [birthdate, setBirthdate] = useState("01/01/1990") // Giả lập ngày sinh
  const [gender, setGender] = useState("Nam") // Giả lập giới tính
  const [address, setAddress] = useState("123 Đường ABC, Quận 1, TP.HCM") // Giả lập địa chỉ
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập họ và tên")
      return
    }

    setIsLoading(true)

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack()
          },
        },
      ])
    }, 1500)
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="items-center mb-6">
          <View className="relative">
            <Image
              source={{ uri: user?.avatar || "https://placeholder.svg?height=100&width=100" }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-sm">
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Thông tin cá nhân</Text>

          <View className="mb-4">
            <Text className="text-secondary-dark font-medium mb-1">Họ và tên</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-secondary-dark"
              placeholder="Nhập họ và tên"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-secondary-dark font-medium mb-1">Email</Text>
            <View className="border border-gray-200 rounded-lg p-3 bg-gray-100">
              <Text className="text-secondary">{user?.email || "email@example.com"}</Text>
            </View>
            <Text className="text-secondary text-xs mt-1">Email không thể thay đổi</Text>
          </View>

          <View className="mb-4">
            <Text className="text-secondary-dark font-medium mb-1">Số điện thoại</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-secondary-dark"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View className="mb-4">
            <Text className="text-secondary-dark font-medium mb-1">Ngày sinh</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-secondary-dark"
              placeholder="DD/MM/YYYY"
              value={birthdate}
              onChangeText={setBirthdate}
            />
          </View>

          <View className="mb-4">
            <Text className="text-secondary-dark font-medium mb-1">Giới tính</Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setGender("Nam")}
                className={`flex-1 p-3 rounded-lg mr-2 ${
                  gender === "Nam" ? "bg-primary" : "bg-gray-100 border border-gray-200"
                }`}
              >
                <Text className={`text-center font-medium ${gender === "Nam" ? "text-white" : "text-secondary-dark"}`}>
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender("Nữ")}
                className={`flex-1 p-3 rounded-lg ml-2 ${
                  gender === "Nữ" ? "bg-primary" : "bg-gray-100 border border-gray-200"
                }`}
              >
                <Text className={`text-center font-medium ${gender === "Nữ" ? "text-white" : "text-secondary-dark"}`}>
                  Nữ
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-secondary-dark font-medium mb-1">Địa chỉ</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-secondary-dark"
              placeholder="Nhập địa chỉ"
              multiline
              numberOfLines={2}
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className={`rounded-lg p-4 items-center mb-6 ${isLoading ? "bg-primary-light" : "bg-primary"}`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default EditProfileScreen
