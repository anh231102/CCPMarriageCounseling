"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Camera } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import memberApi from "@/src/config/api/member.api"
import { UpdateMemberProfileRequest } from "@/src/config/types/member.type"
import * as ImagePicker from "expo-image-picker"


const formatDateLocal = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const mi = String(date.getMinutes()).padStart(2, "0")
  const ss = String(date.getSeconds()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`
}

const convertInputToDate = (input: string): Date => {
  const [dd, mm, yyyy] = input.split("/")
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
}

const convertDateToInput = (isoDate: string): string => {
  const date = new Date(isoDate)
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const EditProfileScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [gender, setGender] = useState<"Nam" | "Nữ">("Nam")
  const [avatar, setAvatar] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        const profile = await memberApi.getMyProfile()
        setName(profile.fullname || "")
        setPhone(profile.phone || "")
        setBirthdate(profile.dob ? convertDateToInput(profile.dob) : "")
        setGender(profile.gender === "Nữ" ? "Nữ" : "Nam")
        setAvatar(profile.avatar || "")
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng.")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập họ và tên")
      return
    }

    try {
      setIsLoading(true)

      const payload: UpdateMemberProfileRequest = {
        fullname: name.trim(),
        phone,
        avatar: avatar || "",
        gender,
        dob: formatDateLocal(convertInputToDate(birthdate)),
      }

      const res = await memberApi.updateMyProfile(payload)

      Alert.alert("Thành công", res, [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Cập nhật thất bại")
    } finally {
      setIsLoading(false)
    }
  }
  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      Alert.alert("Cần quyền truy cập ảnh")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0]
      setAvatar(selectedImage.uri) // Hoặc upload ảnh và lấy URL nếu cần
    }
  }


  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="items-center mb-6">
          <View className="relative">
            <Image
              source={{
                uri: avatar || "https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-4.jpg",
              }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity
              onPress={handlePickAvatar}
              className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-sm"
            >
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
                className={`flex-1 p-3 rounded-lg mr-2 ${gender === "Nam" ? "bg-primary" : "bg-gray-100 border border-gray-200"
                  }`}
              >
                <Text className={`text-center font-medium ${gender === "Nam" ? "text-white" : "text-secondary-dark"}`}>
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender("Nữ")}
                className={`flex-1 p-3 rounded-lg ml-2 ${gender === "Nữ" ? "bg-primary" : "bg-gray-100 border border-gray-200"
                  }`}
              >
                <Text className={`text-center font-medium ${gender === "Nữ" ? "text-white" : "text-secondary-dark"}`}>
                  Nữ
                </Text>
              </TouchableOpacity>
            </View>
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
