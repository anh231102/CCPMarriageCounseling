"use client"

import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Hash, AlertCircle } from "lucide-react-native"

import { useAuth } from "../../hooks/useAuth"
import coupleApi from "@/src/config/api/couple.api"
import ActiveCoupleRoomCard from "@/src/components/couple/ActiveCoupleRoomCard"

const JoinCoupleRoomScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [roomCode, setRoomCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasJoined, setHasJoined] = useState(false)

  const handleJoinRoom = async () => {
  const cleanCode = roomCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (cleanCode.length < 9) {
    setError("Mã phòng phải có ít nhất 9 ký tự")
    return
  }

  setIsLoading(true)
  setError("")



  try {
    const res = await coupleApi.joinCoupleRoom({ accessCode: cleanCode })

    setHasJoined(true)
  } catch (err: any) {
   

    const msg =
      err?.response?.data?.error ||
      err?.message ||
      "Đã có lỗi xảy ra, vui lòng thử lại sau"

    if (msg.includes("active room")) {
      Alert.alert(
        "Bạn đã có phòng",
        "Bạn đang có một phòng đang hoạt động. Bạn muốn làm gì?",
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
                const coupleRoom = await coupleApi.getLatestCoupleRoom()
                navigation.navigate("CoupleSurveyRoom", {
                  coupleId: coupleRoom.id,
                  isHost: coupleRoom.isOwned,
                })
              } catch (e) {
                Alert.alert("Lỗi", "Không thể lấy thông tin phòng.")
              }
            },
          },
          {
            text: "Xóa và tham gia mới",
            style: "destructive",
            onPress: async () => {
              try {
                await coupleApi.cancelCoupleRoom()
                await coupleApi.joinCoupleRoom({ accessCode: cleanCode })
                setHasJoined(true)
              } catch (e) {
                Alert.alert("Lỗi", "Không thể tham gia phòng mới.")
              }
            },
          },
        ]
      )
    } else {
      
      setError("❌ " + msg)
    }
  } finally {
    setIsLoading(false)
  }
}



  

  return (
  <View className="flex-1 bg-gray-50">
    {/* Header */}
    <View className="bg-info p-6">
      <View className="flex-row items-center mb-4">
        
        <View className="flex-1">
          <Text className="text-white text-xl font-bold">Tham gia phòng</Text>
          <Text className="text-white/90 text-sm">Nhập mã phòng để tham gia</Text>
        </View>
        <View className="bg-white/20 rounded-full p-2">
          <Hash size={20} color="#FFFFFF" />
        </View>
      </View>
    </View>

    <ScrollView className="flex-1 px-4 -mt-4">
      {/* Nhập mã phòng */}
      <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="bg-info/10 rounded-full p-3 mr-3">
            <Hash size={24} color="#17A2B8" />
          </View>
          <Text className="text-xl font-bold text-secondary-dark">Nhập mã phòng</Text>
        </View>

        <View className="mb-4">
          <Text className="text-secondary-dark font-medium mb-2">Mã phòng (9 ký tự)</Text>
          <View className="flex-row">
            <TextInput
              className={`flex-1 border rounded-xl p-4 text-center text-xl font-bold tracking-widest ${
                error ? "border-danger bg-danger/5" : "border-gray-200 bg-gray-50"
              }`}
              placeholder="LOVE2024"
              value={roomCode}
              onChangeText={(text) => {
                setRoomCode(text)
                setError("")
              }}
              maxLength={10}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={handleJoinRoom}
              disabled={roomCode.length < 6 || isLoading}
              className={`ml-3 rounded-xl px-6 py-4 items-center justify-center ${
                roomCode.length >= 6 && !isLoading ? "bg-info" : "bg-gray-300"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold">Vào phòng</Text>
              )}
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="flex-row items-center mt-2">
              <AlertCircle size={16} color="#DC3545" />
              <Text className="text-danger text-sm ml-2">{error}</Text>
            </View>
          ) : null}
        </View>

        <Text className="text-secondary text-sm text-center">
          Nhập mã phòng 9 ký tự do đối tác chia sẻ với bạn
        </Text>
      </View>

      {/* Nếu đã join thành công, hiển thị khung phòng */}
      {hasJoined && (
        <View className="mb-6">
          <ActiveCoupleRoomCard />
        </View>
      )}
    </ScrollView>
  </View>
)

}

export default JoinCoupleRoomScreen
