"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Heart, X, Users } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import coupleApi from "@/src/config/api/couple.api"
import { Couple } from "@/src/config/types/couple.type"
import Loading from "@/src/components/share/Loading"
import InviteCodeCard from "@/src/components/couple/InviteCodeCard"
import ActiveCoupleRoomCard from "@/src/components/couple/ActiveCoupleRoomCard"

const CoupleConnectionScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { user } = useAuth()

  const { selectedSurveyIds } = route.params as { selectedSurveyIds: string[] }
  const { isSurvey } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(!!user?.partnerId)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [coupleId, setCoupleId] = useState<string | null>(null)
  const [polling, setPolling] = useState<boolean>(false)
  const [pollingData, setPollingData] = useState<Couple | null>(null)
  const [showActiveRoomCard, setShowActiveRoomCard] = useState<boolean>(false)

  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null)

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
    const setupCoupleRoom = async () => {
      if (user?.partnerId) return

      try {
        const result = await coupleApi.createCouple(selectedSurveyIds)

        if (!result.success) {
          const msg = result.error || ""
          console.warn("Create couple failed:", msg)

          if (msg.includes("active room") || msg.includes("sẵn phòng")) {
            Alert.alert(
              "Bạn đã có sẵn phòng",
              "Bạn đã tạo một phòng trước đó. Bạn muốn làm gì?",
              [
                {
                  text: "Hủy",
                  style: "cancel",
                  onPress: () => navigation.goBack(),
                },
                {
                  text: "Vào phòng của tôi",
                  onPress: async () => {
                    try {
                      const existingRoom = await coupleApi.getLatestCoupleRoom()
                      setShowActiveRoomCard(true)
                      navigation.navigate("CoupleSurveyRoom", {
                        coupleId: existingRoom.id,
                        isSurvey: isSurvey ?? false,
                      })
                    } catch (err) {
                      Alert.alert("Lỗi", "Không thể lấy thông tin phòng hiện tại.")
                    }
                  },
                },
                {
                  text: "Xóa và tạo phòng mới",
                  onPress: async () => {
                    try {
                      await coupleApi.cancelCoupleRoom()
                      const newResult = await coupleApi.createCouple(selectedSurveyIds)

                      if (!newResult.success) {
                        Alert.alert("Lỗi", newResult.error || "Tạo phòng mới thất bại")
                        return
                      }

                      setCoupleId(newResult.data)
                      const newRoom = await coupleApi.getLatestCoupleRoom()
                      setInviteCode(newRoom.accessCode)

                      setPolling(true)
                    } catch (err) {
                      Alert.alert("Lỗi", "Không thể tạo lại phòng.")
                    }
                  },
                  style: "destructive",
                },
              ]
            )
            return
          }

          Alert.alert("Lỗi", msg || "Không thể tạo phòng.")
          return
        }

        setCoupleId(result.data)
        const createdRoom = await coupleApi.getLatestCoupleRoom()
        setInviteCode(createdRoom.accessCode)

        if (createdRoom.member1?.id && createdRoom.member1?.fullname) {
          setPolling(false)
        } else {
          setPolling(true)
        }
      } catch (e) {
        console.error("Lỗi setupCoupleRoom:", e)
      }
    }

    setupCoupleRoom()
  }, [user?.partnerId])

  useEffect(() => {
    if (!polling) return

    pollingInterval.current = setInterval(async () => {
      try {
        const updated = await coupleApi.getLatestCoupleRoom()
        setPollingData(updated)
        setInviteCode(updated.accessCode)

        if (updated.member1?.id && updated.member1?.fullname) {
          if (pollingInterval.current) clearInterval(pollingInterval.current)
          setPolling(false)

          Alert.alert("Thành công", "Đối tác đã vào phòng!")
          navigation.navigate("CoupleSurveyRoom", {
            coupleId: updated.id,
          })
        }
      } catch (e) {
        console.error("Polling lỗi:", e)
      }
    }, 3000)

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
    }
  }, [polling])

  const handleDisconnect = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn hủy kết nối với đối tác?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xác nhận",
        onPress: () => {
          setIsLoading(true)
          setTimeout(() => {
            setIsLoading(false)
            setIsConnected(false)
            Alert.alert("Thành công", "Đã hủy kết nối với đối tác")
          }, 1500)
        },
      },
    ])
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

        </View>

        {isConnected && partnerData ? (
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Đối tác của bạn</Text>

            <View className="items-center mb-4">
              <Image source={{ uri: partnerData.avatar }} className="w-20 h-20 rounded-full mb-2" />
              <Text className="text-secondary-dark font-bold text-lg">{partnerData.name}</Text>
              <Text className="text-secondary">{partnerData.email}</Text>
              <View className="bg-success/10 px-3 py-1 rounded-full mt-2">
                <Text className="text-success text-sm">
                  Đã kết nối từ {partnerData.connectionDate}
                </Text>
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

            <InviteCodeCard inviteCode={inviteCode} />

            <View className="items-center mb-3">
              {polling ? (
                <>
                  <Loading size={30} />
                  <Text className="text-secondary text-center">
                    Đang chờ đối tác chấp nhận lời mời kết nối của bạn...
                  </Text>
                </>
              ) : showActiveRoomCard ? (
                <ActiveCoupleRoomCard />
              ) : null}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default CoupleConnectionScreen
