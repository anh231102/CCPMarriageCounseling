"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Animated } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Heart, Crown, Clock, CheckCircle, RefreshCw, Sparkles, ArrowLeft, Users } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"

const CoupleSurveyRoomScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { user } = useAuth()

  // Giả lập dữ liệu phòng khảo sát
  const [roomData] = useState({
    id: "room_123",
    hostId: user?.id,
    hostName: user?.name || "Bạn",
    partnerName: "Nguyễn Thị B",
    partnerId: "partner_123",
    createdAt: new Date().toISOString(),
  })

  const [userSurveyStatus, setUserSurveyStatus] = useState<"none" | "existing" | "completed">("none")
  const [partnerSurveyStatus, setPartnerSurveyStatus] = useState<"waiting" | "completed">("waiting")
  const [isCreatingLoveMap, setIsCreatingLoveMap] = useState(false)

  // Animation values
  const heartScale = useRef(new Animated.Value(1)).current
  const sparkleRotation = useRef(new Animated.Value(0)).current
  const loadingOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Heart beating animation
    const heartBeat = Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    )

    // Sparkle rotation animation
    const sparkleRotate = Animated.loop(
      Animated.timing(sparkleRotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    )

    if (isCreatingLoveMap) {
      heartBeat.start()
      sparkleRotate.start()
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      heartBeat.stop()
      sparkleRotate.stop()
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    return () => {
      heartBeat.stop()
      sparkleRotate.stop()
    }
  }, [isCreatingLoveMap])

  const handleUseExistingSurvey = () => {
    setUserSurveyStatus("existing")
    Alert.alert("Thành công", "Đã sử dụng kết quả khảo sát có sẵn của bạn")
  }

  const handleTakeNewSurvey = () => {
    navigation.navigate("SurveyTab", {
      screen: "SurveyOptions",
      params: { roomId: roomData.id },
    })
  }

  const handleCreateLoveMap = async () => {
    if (userSurveyStatus === "none") {
      Alert.alert("Thông báo", "Vui lòng hoàn thành khảo sát của bạn trước")
      return
    }

    if (partnerSurveyStatus === "waiting") {
      Alert.alert("Thông báo", "Vui lòng đợi đối tác hoàn thành khảo sát")
      return
    }

    setIsCreatingLoveMap(true)

    // Giả lập quá trình tạo love map
    setTimeout(() => {
      setIsCreatingLoveMap(false)
      navigation.navigate("SurveyTab", {
        screen: "LoveMap",
        params: { isCouple: true, roomId: roomData.id },
      })
    }, 4000)
  }

  const sparkleRotateInterpolate = sparkleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const renderLoadingOverlay = () => {
    if (!isCreatingLoveMap) return null

    return (
      <Animated.View
        style={{ opacity: loadingOpacity }}
        className="absolute inset-0 bg-black/50 items-center justify-center z-50"
      >
        <View className="bg-white rounded-3xl p-8 items-center shadow-2xl">
          <View className="relative items-center justify-center mb-6">
            {/* Sparkle ring */}
            <Animated.View
              style={{
                transform: [{ rotate: sparkleRotateInterpolate }],
              }}
              className="absolute"
            >
              <View className="w-32 h-32 rounded-full border-4 border-transparent">
                {[...Array(8)].map((_, index) => (
                  <View
                    key={index}
                    className="absolute w-3 h-3"
                    style={{
                      top: 16 * Math.sin((index * Math.PI * 2) / 8) + 58,
                      left: 16 * Math.cos((index * Math.PI * 2) / 8) + 58,
                    }}
                  >
                    <Sparkles size={12} color="#FFD700" />
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Beating heart */}
            <Animated.View
              style={{
                transform: [{ scale: heartScale }],
              }}
              className="bg-primary/10 rounded-full p-6"
            >
              <Heart size={48} color="#E83E8C" fill="#E83E8C" />
            </Animated.View>
          </View>

          <Text className="text-xl font-bold text-secondary-dark mb-2">Đang tạo bản đồ tình yêu</Text>
          <Text className="text-secondary text-center">
            Chúng tôi đang phân tích kết quả khảo sát{"\n"}và tạo bản đồ tình yêu cho cặp đôi...
          </Text>

          <View className="flex-row items-center mt-4">
            <View className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
            <View className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <View className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </View>
        </View>
      </Animated.View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary p-6">
        <View className="flex-row items-center mb-4">
          
        </View>
      </View>

      <ScrollView className="flex-1 px-4 -mt-4" showsVerticalScrollIndicator={false}>
        {/* Room Info */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-4">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Heart size={32} color="#E83E8C" />
            </View>
            <Text className="text-lg font-bold text-secondary-dark">Phòng khảo sát #{roomData.id.slice(-3)}</Text>
            <Text className="text-secondary text-sm">
              Tạo lúc {new Date(roomData.createdAt).toLocaleTimeString("vi-VN")}
            </Text>
          </View>
        </View>

        {/* User Survey Card */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border-l-4 border-primary">
          <View className="flex-row items-center mb-4">
            <View className="relative">
              <Image
                source={{ uri: user?.avatar || "https://placeholder.svg?height=60&width=60" }}
                className="w-16 h-16 rounded-full"
              />
              {/* Host Crown */}
              <View className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                <Crown size={16} color="white" />
              </View>
            </View>
            <View className="ml-4 flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-lg font-bold text-secondary-dark">{roomData.hostName}</Text>
                <View className="bg-yellow-500/10 rounded-full px-2 py-1 ml-2">
                  <Text className="text-yellow-600 text-xs font-medium">Chủ phòng</Text>
                </View>
              </View>
              <Text className="text-secondary">Trạng thái khảo sát của bạn</Text>
            </View>
          </View>

          {/* Survey Status */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            {userSurveyStatus === "none" && (
              <View className="items-center">
                <Clock size={24} color="#6C757D" className="mb-2" />
                <Text className="text-secondary-dark font-medium">Chưa hoàn thành khảo sát</Text>
                <Text className="text-secondary text-sm text-center">Chọn một trong hai tùy chọn bên dưới</Text>
              </View>
            )}

            {userSurveyStatus === "existing" && (
              <View className="items-center">
                <CheckCircle size={24} color="#28A745" className="mb-2" />
                <Text className="text-success font-medium">Đã sử dụng kết quả có sẵn</Text>
                <Text className="text-secondary text-sm text-center">Sử dụng kết quả khảo sát trước đó</Text>
              </View>
            )}

            {userSurveyStatus === "completed" && (
              <View className="items-center">
                <CheckCircle size={24} color="#28A745" className="mb-2" />
                <Text className="text-success font-medium">Đã hoàn thành khảo sát mới</Text>
                <Text className="text-secondary text-sm text-center">Vừa hoàn thành bài khảo sát</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {userSurveyStatus === "none" && (
            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleUseExistingSurvey}
                className="bg-success/10 border border-success rounded-xl p-4 flex-row items-center"
              >
                <CheckCircle size={20} color="#28A745" />
                <View className="ml-3 flex-1">
                  <Text className="text-success font-medium">Dùng kết quả có sẵn</Text>
                  <Text className="text-secondary text-sm">Sử dụng kết quả khảo sát trước đó</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTakeNewSurvey}
                className="bg-primary rounded-xl p-4 flex-row items-center"
              >
                <RefreshCw size={20} color="#FFFFFF" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-medium">Làm bài khảo sát mới</Text>
                  <Text className="text-white/80 text-sm">Thực hiện bộ khảo sát tổng hợp</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Partner Survey Card */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border-l-4 border-secondary">
          <View className="flex-row items-center mb-4">
            <Image source={{ uri: "https://placeholder.svg?height=60&width=60" }} className="w-16 h-16 rounded-full" />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-secondary-dark">{roomData.partnerName}</Text>
              <Text className="text-secondary">Trạng thái khảo sát của đối tác</Text>
            </View>
          </View>

          {/* Partner Status */}
          <View className="bg-gray-50 rounded-xl p-4">
            {partnerSurveyStatus === "waiting" && (
              <View className="items-center">
                <View className="relative">
                  <Clock size={24} color="#FFC107" className="mb-2" />
                  <View className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full animate-pulse" />
                </View>
                <Text className="text-warning font-medium">Đang chờ kết quả khảo sát</Text>
                <Text className="text-secondary text-sm text-center">Đối tác chưa hoàn thành bài khảo sát</Text>
              </View>
            )}

            {partnerSurveyStatus === "completed" && (
              <View className="items-center">
                <CheckCircle size={24} color="#28A745" className="mb-2" />
                <Text className="text-success font-medium">Đã hoàn thành khảo sát</Text>
                <Text className="text-secondary text-sm text-center">Đối tác đã hoàn thành bài khảo sát</Text>
              </View>
            )}
          </View>
        </View>

        {/* Create Love Map Button */}
        <View className="mb-8">
          <TouchableOpacity
            onPress={handleCreateLoveMap}
            disabled={userSurveyStatus === "none" || partnerSurveyStatus === "waiting" || isCreatingLoveMap}
            className={`rounded-xl p-6 items-center shadow-sm ${
              userSurveyStatus !== "none" && partnerSurveyStatus === "completed" && !isCreatingLoveMap
                ? "bg-gradient-to-r from-primary to-pink-500"
                : "bg-gray-300"
            }`}
          >
            <View className="flex-row items-center mb-2">
              <Heart
                size={24}
                color={userSurveyStatus !== "none" && partnerSurveyStatus === "completed" ? "#FFFFFF" : "#6C757D"}
              />
              <Sparkles
                size={20}
                color={userSurveyStatus !== "none" && partnerSurveyStatus === "completed" ? "#FFFFFF" : "#6C757D"}
                className="ml-2"
              />
            </View>
            <Text
              className={`text-xl font-bold ${
                userSurveyStatus !== "none" && partnerSurveyStatus === "completed" && !isCreatingLoveMap
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              {isCreatingLoveMap ? "Đang tạo..." : "Tạo bản đồ tình yêu"}
            </Text>
            <Text
              className={`text-sm text-center mt-1 ${
                userSurveyStatus !== "none" && partnerSurveyStatus === "completed" && !isCreatingLoveMap
                  ? "text-white/80"
                  : "text-gray-400"
              }`}
            >
              {userSurveyStatus === "none"
                ? "Vui lòng hoàn thành khảo sát của bạn"
                : partnerSurveyStatus === "waiting"
                  ? "Đang chờ đối tác hoàn thành khảo sát"
                  : "Phân tích tổng hợp kết quả cả hai người"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="bg-info/5 rounded-xl p-4 mb-6">
          <Text className="text-info font-medium mb-2">💡 Hướng dẫn</Text>
          <View className="space-y-1">
            <Text className="text-secondary-dark text-sm">• Cả hai người cần hoàn thành khảo sát</Text>
            <Text className="text-secondary-dark text-sm">• Bạn có thể dùng kết quả cũ hoặc làm mới</Text>
            <Text className="text-secondary-dark text-sm">• Bản đồ tình yêu sẽ được tạo khi cả hai hoàn thành</Text>
            <Text className="text-secondary-dark text-sm">• Kết quả sẽ hiển thị độ tương thích chi tiết</Text>
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {renderLoadingOverlay()}
    </View>
  )
}

export default CoupleSurveyRoomScreen
