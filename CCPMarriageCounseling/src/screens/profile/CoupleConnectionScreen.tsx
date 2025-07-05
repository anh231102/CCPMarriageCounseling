"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Heart, Mail, Copy, RefreshCw, X, Users } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import coupleApi from "@/src/config/api/couple.api"

const CoupleConnectionScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [partnerEmail, setPartnerEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(!!user?.partnerId)
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  // Giả lập dữ liệu đối tác
  const partnerData = user?.partnerId
    ? {
        id: "partner123",
        name: "Nguyễn Thị B",
        email: "partner@example.com",
        avatar: "https://placeholder.svg?height=100&width=100",
        connectionDate: "15/05/2023",
      }
    : null

  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const result = await coupleApi.createCouple()
        setInviteCode(result)
      } catch (error) {
        console.error("Lỗi khi tạo couple:", error)
      }
    }

    if (!user?.partnerId) {
      fetchInviteCode()
    }
  }, [user?.partnerId])

  const handleConnect = () => {
    if (!partnerEmail.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập email của đối tác")
      return
    }

    setIsLoading(true)

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false)
      setIsConnected(true)
      Alert.alert("Thành công", "Đã kết nối với đối tác thành công!")
    }, 1500)
  }

  const handleDisconnect = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn hủy kết nối với đối tác?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: () => {
          setIsLoading(true)
          // Giả lập API call
          setTimeout(() => {
            setIsLoading(false)
            setIsConnected(false)
            Alert.alert("Thành công", "Đã hủy kết nối với đối tác")
          }, 1500)
        },
      },
    ])
  }

  const copyInviteCode = () => {
    Alert.alert("Thành công", "Đã sao chép mã mời vào bộ nhớ tạm")
  }

  const handleCreateSurveyRoom = () => {
    navigation.navigate("CoupleSurveyRoom", {
      partnerId: partnerData?.id,
      partnerName: partnerData?.name,
    })
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-primary/10 rounded-lg p-4 mb-6">
          <Text className="text-primary font-bold text-lg mb-2">Kết nối cặp đôi</Text>
          <Text className="text-secondary-dark mb-2">
            Kết nối với đối tác của bạn để chia sẻ kết quả khảo sát và xem bản đồ tình yêu đôi chi tiết.
          </Text>
          {!isConnected && !user?.membershipType?.includes("Premium") && (
            <View className="flex-row items-center mt-2">
              <Heart size={16} color="#E83E8C" className="mr-2" />
              <Text className="text-primary font-medium">Yêu cầu gói Premium hoặc Cặp đôi</Text>
            </View>
          )}
        </View>

        {isConnected && partnerData ? (
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Đối tác của bạn</Text>

            <View className="items-center mb-4">
              <Image source={{ uri: partnerData.avatar }} className="w-20 h-20 rounded-full mb-2" />
              <Text className="text-secondary-dark font-bold text-lg">{partnerData.name}</Text>
              <Text className="text-secondary">{partnerData.email}</Text>
              <View className="bg-success/10 px-3 py-1 rounded-full mt-2">
                <Text className="text-success text-sm">Đã kết nối từ {partnerData.connectionDate}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("SurveyTab", { screen: "LoveMap" })}
              className="bg-primary rounded-lg p-3 items-center mb-3"
            >
              <Text className="text-white font-medium">Xem bản đồ tình yêu đôi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreateSurveyRoom}
              className="bg-gradient-to-r from-primary to-pink-500 rounded-lg p-4 items-center mb-3"
            >
              <View className="flex-row items-center mb-1">
                <Users size={20} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Tạo phòng khảo sát cặp đôi</Text>
              </View>
              <Text className="text-white/80 text-sm text-center">
                Cùng nhau làm khảo sát và tạo bản đồ tình yêu chi tiết
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDisconnect}
              disabled={isLoading}
              className="flex-row items-center justify-center p-3"
            >
              {isLoading ? (
                <ActivityIndicator color="#DC3545" size="small" />
              ) : (
                <>
                  <X size={16} color="#DC3545" className="mr-2" />
                  <Text className="text-danger font-medium">Hủy kết nối</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Kết nối với đối tác</Text>

            <View className="mb-4">
              <Text className="text-secondary-dark font-medium mb-1">Email đối tác</Text>
              <View className="flex-row">
                <TextInput
                  className="flex-1 border border-gray-200 rounded-lg p-3 text-secondary-dark"
                  placeholder="Nhập email của đối tác"
                  keyboardType="email-address"
                  value={partnerEmail}
                  onChangeText={setPartnerEmail}
                />
                <TouchableOpacity
                  onPress={handleConnect}
                  disabled={isLoading || !user?.membershipType?.includes("Premium")}
                  className={`ml-2 rounded-lg p-3 items-center justify-center ${
                    isLoading || !user?.membershipType?.includes("Premium")
                      ? "bg-primary-light"
                      : "bg-primary"
                  }`}
                  style={{ width: 50 }}
                >
                  {isLoading ? <ActivityIndicator color="white" size="small" /> : <Mail size={20} color="white" />}
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-gray-50 rounded-lg p-4 mb-4">
              <Text className="text-secondary-dark font-medium mb-2">Hoặc chia sẻ mã mời</Text>
              <View className="flex-row items-center">
                <View className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                  <Text className="text-secondary-dark text-center">{inviteCode ?? "Đang tạo mã..."}</Text>
                </View>
                <TouchableOpacity
                  onPress={copyInviteCode}
                  className="ml-2 bg-secondary/10 rounded-lg p-3"
                  style={{ width: 50 }}
                >
                  <Copy size={20} color="#6C757D" />
                </TouchableOpacity>
              </View>
              <Text className="text-secondary text-xs mt-2">
                Chia sẻ mã này với đối tác của bạn để họ có thể nhập vào ứng dụng và kết nối với bạn.
              </Text>
            </View>

            <View className="items-center mb-3">
              <RefreshCw size={24} color="#6C757D" className="mb-2" />
              <Text className="text-secondary text-center">Đang chờ đối tác chấp nhận lời mời kết nối của bạn...</Text>
            </View>

            {!user?.membershipType?.includes("Premium") && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Membership")}
                className="bg-primary rounded-lg p-3 items-center"
              >
                <Text className="text-white font-medium">Nâng cấp lên gói Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default CoupleConnectionScreen
