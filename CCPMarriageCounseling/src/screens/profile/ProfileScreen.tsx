"use client"

import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  User,
  Edit,
  CreditCard,
  Heart,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Calendar,
  BookOpen,
  HeartHandshakeIcon,
  HeartPulseIcon,
  BookUserIcon
} from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import MyProfileComponent from "@/src/components/share/MyProfileComponent"

const ProfileScreen = () => {
  const navigation = useNavigation<any>()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error)
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-6">
  <MyProfileComponent image name touchProfile />
</View>


      {/* Menu */}
      <View className="p-4">
        <View className="bg-white rounded-lg shadow-sm mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("ViewProfile")}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <User size={20} color="#E83E8C" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Thông tin cá nhân</Text>
              <Text className="text-secondary text-sm">Cập nhật thông tin cá nhân của bạn</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Wallet")}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 bg-info/10 rounded-full items-center justify-center mr-3">
              <CreditCard size={20} color="#17A2B8" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Ví của tôi</Text>
              <Text className="text-secondary text-sm">Quản lý ví của bạn</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Membership")}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 bg-warning/10 rounded-full items-center justify-center mr-3">
              <HeartHandshakeIcon size={20} color="#FFC107" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Gói thành viên</Text>
              <Text className="text-secondary text-sm">Quản lý gói thành viên của bạn</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CoupleRoomSelection")}
            className="flex-row items-center p-4"
          >
            <View className="w-10 h-10 bg-success/10 rounded-full items-center justify-center mr-3">
              <Heart size={20} color="#28A745" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Kết nối cặp đôi</Text>
              <Text className="text-secondary text-sm">Kết nối với đối tác của bạn</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-lg shadow-sm mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("LoveMap")}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <HeartPulseIcon size={20} color="#E83E8C" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Bản đồ tình yêu</Text>
              <Text className="text-secondary text-sm">Xem kết quả khảo sát của bạn</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AppointmentHistory")}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 bg-info/10 rounded-full items-center justify-center mr-3">
              <Calendar size={20} color="#17A2B8" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Lịch sử tư vấn</Text>
              <Text className="text-secondary text-sm">Xem lịch sử các buổi tư vấn</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("PersonTypeHistory" )}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 bg-warning/10 rounded-full items-center justify-center mr-3">
              <BookUserIcon size={20} color="#FFC107" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Lịch sử khảo sát</Text>
              <Text className="text-secondary text-sm">Xem lịch sử các bài khảo sát</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("CoursesTab")} className="flex-row items-center p-4">
            <View className="w-10 h-10 bg-success/10 rounded-full items-center justify-center mr-3">
              <BookOpen size={20} color="#28A745" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Khóa học của tôi</Text>
              <Text className="text-secondary text-sm">Xem các khóa học đã đăng ký</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-lg shadow-sm mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 bg-warning/10 rounded-full items-center justify-center mr-3">
              <Bell size={20} color="#FFC107" />
            </View>
            <View className="flex-1">
              <Text className="text-secondary-dark font-medium">Thông báo</Text>
              <Text className="text-secondary text-sm">Quản lý thông báo của bạn</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Settings")} className="flex-row items-center p-4">
            <View className="w-10 h-10 bg-secondary/10 rounded-full items-center justify-center mr-3">
              <Settings size={20} color="#6C757D" />
            </View>
            <View className="flex-1">                                                                                             
              <Text className="text-secondary-dark font-medium">Cài đặt</Text>
              <Text className="text-secondary text-sm">Quản lý cài đặt ứng dụng</Text>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white rounded-lg shadow-sm p-4 flex-row items-center mb-6"
        >
          <View className="w-10 h-10 bg-danger/10 rounded-full items-center justify-center mr-3">
            <LogOut size={20} color="#DC3545" />
          </View>
          <Text className="text-danger font-medium">Đăng xuất</Text>
        </TouchableOpacity>

        <Text className="text-secondary text-center mb-6">Phiên bản 1.0.0</Text>
      </View>
    </ScrollView>
  )
}

export default ProfileScreen
