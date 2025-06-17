"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Globe, Moon, Lock, Shield, HelpCircle, Info, ChevronRight } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"

const SettingsScreen = () => {
  const navigation = useNavigation<any>()
  const { logout } = useAuth()

  // Cài đặt ứng dụng
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    biometricLogin: false,
    autoPlay: true,
    dataUsage: true,
  })

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key as keyof typeof settings]: !prev[key as keyof typeof settings],
    }))
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      "Xóa tài khoản",
      "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa tài khoản",
          style: "destructive",
          onPress: () => {
            // Xử lý xóa tài khoản
            Alert.alert("Thành công", "Tài khoản của bạn đã được xóa", [
              {
                text: "OK",
                onPress: () => {
                  logout()
                },
              },
            ])
          },
        },
      ],
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-black rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Cài đặt chung</Text>

          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Globe size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Ngôn ngữ</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-secondary mr-2">Tiếng Việt</Text>
              <ChevronRight size={16} color="#6C757D" />
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Moon size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Chế độ tối</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting("darkMode")}
              trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Info size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Tự động phát video</Text>
            </View>
            <Switch
              value={settings.autoPlay}
              onValueChange={() => toggleSetting("autoPlay")}
              trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View className="bg-black rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Bảo mật</Text>

          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Lock size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Đổi mật khẩu</Text>
            </View>
            <ChevronRight size={16} color="#6C757D" />
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Shield size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Đăng nhập sinh trắc học</Text>
            </View>
            <Switch
              value={settings.biometricLogin}
              onValueChange={() => toggleSetting("biometricLogin")}
              trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Shield size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Tiết kiệm dữ liệu</Text>
            </View>
            <Switch
              value={settings.dataUsage}
              onValueChange={() => toggleSetting("dataUsage")}
              trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View className="bg-black rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Hỗ trợ</Text>

          <TouchableOpacity className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <HelpCircle size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Trung tâm trợ giúp</Text>
            </View>
            <ChevronRight size={16} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Info size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Điều khoản sử dụng</Text>
            </View>
            <ChevronRight size={16} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Shield size={20} color="#6C757D" className="mr-3" />
              <Text className="text-secondary-dark">Chính sách bảo mật</Text>
            </View>
            <ChevronRight size={16} color="#6C757D" />
          </TouchableOpacity>
        </View>

        <View className="bg-black rounded-lg p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Tài khoản</Text>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="flex-row items-center justify-center p-3 bg-danger/10 rounded-lg"
          >
            <Text className="text-danger font-medium">Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-secondary text-center mb-6">
          CCP - Nền tảng tư vấn hôn nhân
          {"\n"}
          Phiên bản 1.0.0
        </Text>
      </View>
    </ScrollView>
  )
}

export default SettingsScreen
