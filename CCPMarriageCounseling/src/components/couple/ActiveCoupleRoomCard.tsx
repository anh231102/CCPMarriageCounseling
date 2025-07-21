import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Users, Crown, Clock } from "lucide-react-native"

import { useAuth } from "@/src/hooks/useAuth"
import coupleApi from "@/src/config/api/couple.api"
import {
  Couple,
  CoupleRoomStatus,
  getCoupleRoomStatusLabel,
} from "@/src/config/types/couple.type"
import Loading from "../share/Loading"

type Props = {
  lengthwise?: boolean
}

const ActiveCoupleRoomCard = ({ lengthwise }: Props) => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [coupleRoom, setCoupleRoom] = useState<Couple | null>(null)

  useEffect(() => {
    fetchLatestRoom()
  }, [])

  const fetchLatestRoom = async () => {
    try {
      const data = await coupleApi.getLatestCoupleRoom()
      setCoupleRoom(data)
    } catch (error: any) {
      setCoupleRoom(null)
    } finally {
      setLoading(false)
    }
  }

  const handleEnterCurrentRoom = () => {
    if (!coupleRoom || coupleRoom.status === CoupleRoomStatus.Cancelled) return
    navigation.navigate("CoupleSurveyRoom", {
      roomId: coupleRoom.id,
      isHost: coupleRoom.isOwned,
    })
  }

  const handleLeaveRoom = async () => {
    try {
      await coupleApi.cancelCoupleRoom()
      Alert.alert("Thành công", "Bạn đã thoát khỏi phòng khảo sát")
      fetchLatestRoom()
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể thoát khỏi phòng")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isCancelled =
    coupleRoom?.status === CoupleRoomStatus.Cancelled ||
    coupleRoom?.status === CoupleRoomStatus.Completed

  const isInactive = !coupleRoom || isCancelled

  if (loading) {
    return (
      <View className="bg-white rounded-xl p-6 mb-6 shadow-sm items-center">
        <Loading size={30} />
        <Text className="mt-2 text-secondary text-sm">Đang kiểm tra phòng...</Text>
      </View>
    )
  }

  if (isInactive) {
    return (
      <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border-l-4 border-yellow-400">
        <View className="flex-row items-center mb-4">
          <View className="bg-yellow-100 rounded-full p-3 mr-3">
            <Users size={24} color="#FFC107" />
          </View>
          <View>
            <Text className="text-lg font-bold text-secondary-dark">Không có phòng hoạt động</Text>
            <Text className="text-yellow-600 text-sm font-medium mt-1">Hãy tạo hoặc tham gia một phòng mới</Text>
          </View>
        </View>
        <View className="bg-yellow-50 rounded-xl p-4">
          <Text className="text-secondary text-sm">
            • Tạo mã phòng để chia sẻ với đối tác{"\n"}
            • Quản lý tiến trình khảo sát{"\n"}
            • Tạo bản đồ tình yêu khi cả hai hoàn thành khảo sát
          </Text>
        </View>
      </View>
    )
  }

  // Nếu phòng đang hoạt động
  const host = coupleRoom.member
  const partner = coupleRoom.member1

  return (
    <View className="bg-white rounded-xl p-6 mb-6 shadow-sm w-full border-l-4 border-success">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <View className="bg-success/10 rounded-full p-3 mr-3">
          <Users size={24} color="#28A745" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-secondary-dark">Phòng đang tham gia</Text>
          <Text className="text-sm font-medium text-success">
            {getCoupleRoomStatusLabel(coupleRoom.status)}
          </Text>
          <View className="rounded-lg px-3 py-1 w-36 mt-2 bg-success/10">
            <Text className="font-bold text-success">#{coupleRoom.accessCode}</Text>
          </View>
        </View>
      </View>

      {/* Info Section */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <View className={`justify-between mb-3 ${lengthwise ? "space-y-3" : "flex-row"}`}>
          <View>
            <Text className="text-secondary text-sm">Chủ phòng</Text>
            <View className="flex-row items-center">
              <Crown size={16} color="#FFD700" />
              <Text className="text-secondary-dark font-medium ml-1">
                {host?.fullname ?? "Chưa có"}
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-secondary text-sm">Thành viên</Text>
            <Text className="text-secondary-dark font-medium">
              {partner?.fullname ?? "Chưa tham gia"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <Clock size={14} color="#6C757D" />
          <Text className="text-secondary text-sm ml-1">
            Tạo lúc {formatDate(coupleRoom.createAt)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className={lengthwise ? "space-y-3" : "flex-row space-x-3"}>
        <TouchableOpacity
          onPress={handleEnterCurrentRoom}
          className={`${
            lengthwise ? "w-full mb-3" : "flex-1 mr-3"
          } bg-success rounded-xl p-4 flex-row items-center justify-center`}
        >
          <Users size={20} color="#FFFFFF" />
          <Text className="text-white font-bold ml-2">Vào phòng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Thoát phòng", "Bạn có chắc muốn thoát khỏi phòng?", [
              { text: "Hủy", style: "cancel" },
              { text: "Thoát phòng", style: "destructive", onPress: handleLeaveRoom },
            ])
          }
          className={`${
            lengthwise ? "w-full" : ""
          } bg-danger/10 border border-danger rounded-xl px-4 py-4`}
        >
          <Text className="text-danger font-medium text-center">Thoát phòng</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


export default ActiveCoupleRoomCard
