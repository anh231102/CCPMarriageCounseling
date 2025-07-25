"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  View, Text, ScrollView, TouchableOpacity, Image, Alert, Animated,
} from "react-native"
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native"
import { Heart, Crown, Clock, CheckCircle, RefreshCw, Sparkles } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import coupleApi from "@/src/config/api/couple.api"
import { Couple } from "@/src/config/types/couple.type"
import InviteCodeCard from "@/src/components/couple/InviteCodeCard"

const CoupleSurveyRoomScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const route = useRoute<any>()
  const { isSurvey } = route.params || {}

  const [roomData, setRoomData] = useState<Couple | null>(null)
  const [userSurveyStatus, setUserSurveyStatus] = useState<"none" | "existing" | "completed">("none")
  const [partnerSurveyStatus, setPartnerSurveyStatus] = useState<"waiting" | "completed">("waiting")
  const [isCreatingLoveMap, setIsCreatingLoveMap] = useState(false)

  const heartScale = useRef(new Animated.Value(1)).current
  const sparkleRotation = useRef(new Animated.Value(0)).current
  const loadingOpacity = useRef(new Animated.Value(0)).current
  const hasNavigatedRef = useRef(false)

  const host = roomData?.member
  const partner = roomData?.member1
  const isUserHost = user?.name === host?.fullname

  const mergedRoomData = roomData
    ? {
      id: roomData.accessCode,
      hostId: host?.accountId || "",
      hostName: host?.fullname || "Bạn",
      hostAvatar: host?.avatar || "",
      partnerName: partner?.fullname || "Đối tác",
      partnerAvatar: partner?.avatar || "",
      partnerId: partner?.accountId || "",
      createdAt: roomData.createAt,
    }
    : null

  useFocusEffect(
    useCallback(() => {
      const fetchRoomData = async () => {
        try {
          const data = await coupleApi.getLatestCoupleRoom()
          if (!data || data.status !== 1) {
            if (isSurvey) {
              navigation.reset({ index: 0, routes: [{ name: "HomeTab" }] })
              return
            }

            navigation.reset({ index: 0, routes: [{ name: "HomeTab" }] })
            return

          }
          setRoomData(data)
        } catch (error) {
          Alert.alert("Lỗi", "Không thể tải dữ liệu phòng.")
          navigation.reset({ index: 0, routes: [{ name: "HomeTab" }] })
        }
      }
      fetchRoomData()
    }, [isSurvey])
  )

  useEffect(() => {
    let interval: number

    const checkStatus = async () => {
      try {
        const latestRoom = await coupleApi.getLatestCoupleRoom()
        if (latestRoom.status === 2 && !hasNavigatedRef.current) {
          // Kiểm tra nếu userSurveyStatus và partnerSurveyStatus đã "completed" => tức là người dùng đã bấm tạo
          if (userSurveyStatus === "completed" && partnerSurveyStatus === "completed") {
            hasNavigatedRef.current = true
            setRoomData(latestRoom)
            setIsCreatingLoveMap(true)
            clearInterval(interval)

            setTimeout(() => {
              setIsCreatingLoveMap(false)
              navigation.navigate("LoveMap", { coupleId: latestRoom.id })
            }, 4000)
          }
        }
      } catch (error) {
      }
    }

    interval = setInterval(checkStatus, 1000)
    return () => clearInterval(interval)
  }, [userSurveyStatus, partnerSurveyStatus])


  useEffect(() => {
    const heartBeat = Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    )

    const sparkleRotate = Animated.loop(
      Animated.timing(sparkleRotation, { toValue: 1, duration: 3000, useNativeDriver: true })
    )

    if (isCreatingLoveMap) {
      heartBeat.start()
      sparkleRotate.start()
      Animated.timing(loadingOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start()
    } else {
      heartBeat.stop()
      sparkleRotate.stop()
      Animated.timing(loadingOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start()
    }

    return () => {
      heartBeat.stop()
      sparkleRotate.stop()
    }
  }, [isCreatingLoveMap])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    const fetchProgress = async () => {
      try {
        const progress = await coupleApi.getPartnerProgress()
        setUserSurveyStatus(progress.isSelfDoneAll ? "completed" : "none")
        setPartnerSurveyStatus(progress.isPartnerDoneAll ? "completed" : "waiting")
      } catch (error) {
      }
    }

    fetchProgress()
    interval = setInterval(fetchProgress, 3000)
    return () => clearInterval(interval)
  }, [isUserHost])

  const handleUseExistingSurvey = async () => {
    if (!roomData) return
    setIsCreatingLoveMap(true)

    try {
      const surveyIds: string[] = []
      if (roomData.mbti === "false") surveyIds.push("SV001")
      if (roomData.disc === "false") surveyIds.push("SV002")
      if (roomData.loveLanguage === "false") surveyIds.push("SV003")
      if (roomData.bigFive === "false") surveyIds.push("SV004")

      if (surveyIds.length === 0) {
        Alert.alert("Thông báo", "Bạn đã hoàn thành tất cả các bài khảo sát.")
        setIsCreatingLoveMap(false)
        return
      }

      for (const id of surveyIds) {
        await coupleApi.applyLatestResult(id)
      }

      const progress = await coupleApi.getPartnerProgress()
      setUserSurveyStatus(progress.isSelfDoneAll ? "completed" : "existing")
      setPartnerSurveyStatus(progress.isPartnerDoneAll ? "completed" : "waiting")

      Alert.alert("Thành công", "Đã sử dụng kết quả khảo sát có sẵn của bạn")
    } catch (error) {
      Alert.alert("Lỗi", "Không thể sử dụng kết quả có sẵn")
    } finally {
      setIsCreatingLoveMap(false)
    }
  }

  const handleTakeNewSurvey = () => {
    if (!roomData) return
    const surveyIds: string[] = []

    if (isUserHost) {
      // Host: kiểm tra các field không có số 1
      if (roomData.mbti === "false") surveyIds.push("SV001");
      if (roomData.disc === "false") surveyIds.push("SV002");
      if (roomData.loveLanguage === "false") surveyIds.push("SV003");
      if (roomData.bigFive === "false") surveyIds.push("SV004");
    } else {
      // Partner: kiểm tra các field có số 1
      if (roomData.mbti1 === "false") surveyIds.push("SV001");
      if (roomData.disc1 === "false") surveyIds.push("SV002");
      if (roomData.loveLanguage1 === "false") surveyIds.push("SV003");
      if (roomData.bigFive1 === "false") surveyIds.push("SV004");
    }

    if (surveyIds.length === 0) {
      Alert.alert("Thông báo", "Bạn đã hoàn thành tất cả các bài khảo sát.")
      return
    }

    navigation.navigate("CoupleSurveyQuestions", {
      selectedSurveyIds: surveyIds,
      currentSurveyIndex: 0,
      userData: {
        name: user?.name || "Bạn",
        partnerName: roomData.isVirtual ? roomData.virtualName : partner?.fullname || "Đối tác",
      },
      userType: isUserHost ? "host" : "partner",
      isAuth: true,
      roomId: roomData.accessCode,
      isHost: isUserHost,
    })
  }

  const handleTakeNewVirtualSurvey = () => {
    if (!roomData) return
    const surveyIds: string[] = []
    if (roomData.mbti1 === "false") surveyIds.push("SV001")
    if (roomData.disc1 === "false") surveyIds.push("SV002")
    if (roomData.loveLanguage1 === "false") surveyIds.push("SV003")
    if (roomData.bigFive1 === "false") surveyIds.push("SV004")

    if (surveyIds.length === 0) {
      Alert.alert("Thông báo", "Bạn đã hoàn thành tất cả các bài khảo sát.")
      return
    }

    navigation.navigate("VirtualSurveyQuestions", {
      selectedSurveyIds: surveyIds,
      currentSurveyIndex: 0,
      userData: {
        name: user?.name || "Bạn",
        partnerName: roomData.isVirtual ? roomData.virtualName : partner?.fullname || "Đối tác",
      },
      userType: isUserHost ? "host" : "partner",
      isAuth: true,
      roomId: roomData.accessCode,
      isHost: isUserHost,
      isSurvey,
    })
  }

  const handleCreateLoveMap = async () => {
    if (userSurveyStatus !== "completed") {
      Alert.alert("Thông báo", "Vui lòng hoàn thành khảo sát của bạn trước")
      return
    }

    if (partnerSurveyStatus !== "completed") {
      Alert.alert("Thông báo", "Vui lòng đợi đối tác hoàn thành khảo sát")
      return
    }

    setIsCreatingLoveMap(true)

    try {
      if (roomData?.id) {
        await coupleApi.completeCoupleRoom(roomData.id)
        const updated = await coupleApi.getLatestCoupleRoom()
        setRoomData(updated)
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể hoàn tất phòng.")
      setIsCreatingLoveMap(false)
    }
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
            <Animated.View style={{ transform: [{ rotate: sparkleRotateInterpolate }] }} className="absolute">
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
            <Animated.View style={{ transform: [{ scale: heartScale }] }} className="bg-primary/10 rounded-full p-6">
              <Heart size={48} color="#E83E8C" fill="#E83E8C" />
            </Animated.View>
          </View>

          <Text className="text-xl font-bold text-secondary-dark mb-2">Đang xử lý</Text>
          <Text className="text-secondary text-center">
            Chúng tôi đang áp dụng kết quả khảo sát{"\n"}và tạo bản đồ tình yêu cho cặp đôi...
          </Text>

          <View className="flex-row items-center mt-4">
            <View className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
            <View className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
            <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </View>
        </View>
      </Animated.View>
    )
  }

  if (!mergedRoomData) return null

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 -mt-4" showsVerticalScrollIndicator={false}>
        {/* Room Info */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-4">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Heart size={32} color="#E83E8C" />
            </View>
            <Text className="text-lg font-bold text-secondary-dark">Phòng khảo sát</Text>
            {!roomData?.isVirtual && <InviteCodeCard inviteCode={mergedRoomData.id} />}

            <Text className="text-secondary text-sm">
              Tạo lúc {new Date(mergedRoomData.createdAt).toLocaleTimeString("vi-VN")}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="bg-primary/10 rounded-xl p-4 mb-6">
          <Text className="text-primary font-medium mb-2">💡 Hướng dẫn</Text>
          <View className="space-y-1">
            {roomData?.isVirtual ? (
              <>
                <Text className="text-secondary-dark text-sm">
                  • Bạn cần hoàn thành khảo sát của cả bạn và nhân vật ảo
                </Text>
                <Text className="text-secondary-dark text-sm">
                  • Bạn có thể dùng kết quả cũ hoặc làm mới cho phần kết quả của bản thân, đối với đối tác ảo bạn cần làm mới kết quả
                </Text>
                <Text className="text-secondary-dark text-sm">
                  • Bản đồ tình yêu sẽ được tạo khi cả bạn và đối tác ảo hoàn thành
                </Text>
                <Text className="text-secondary-dark text-sm">
                  • Kết quả sẽ hiển thị độ tương thích chi tiết
                </Text>
              </>
            ) : (
              <>
                <Text className="text-secondary-dark text-sm">
                  • Cả hai người cần hoàn thành khảo sát
                </Text>
                <Text className="text-secondary-dark text-sm">
                  • Bạn có thể dùng kết quả cũ hoặc làm mới
                </Text>
                <Text className="text-secondary-dark text-sm">
                  • Bản đồ tình yêu sẽ được tạo khi cả hai hoàn thành
                </Text>
                <Text className="text-secondary-dark text-sm">
                  • Kết quả sẽ hiển thị độ tương thích chi tiết
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Host and Partner Cards */}
        {["host", "partner"].map((role) => {
          if (role === "partner" && roomData?.isVirtual || null) {
            return (
              <View
                key="virtual-partner"
                className="bg-white rounded-xl p-6 mb-4 shadow-sm border-l-4 border-secondary"
              >
                <View className="flex-row items-center mb-4">
                  <View className="relative">
                    <Image
                      source={require("../../../assets/images/avatar.png")}
                      className="w-16 h-16 rounded-full"
                    />
                  </View>
                  <View className="ml-4 flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-lg font-bold text-secondary-dark">{roomData?.virtualName}</Text>
                      <View className="bg-blue-100 rounded-full px-2 py-1 ml-2">
                        <Text className="text-blue-600 text-xs font-medium">Đối tác ảo</Text>
                      </View>
                    </View>
                    <Text className="text-secondary text-sm">
                      Ngày sinh:
                      {roomData?.virtualDob
                        ? new Date(roomData.virtualDob).toLocaleDateString("vi-VN")
                        : "Không rõ"}
                    </Text>

                  </View>
                </View>

                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                  {(partnerSurveyStatus === "waiting") && (
                    <View className="items-center">
                      <Clock size={24} color="#6C757D" />
                      <Text className="text-secondary-dark font-medium">Chưa hoàn thành khảo sát</Text>
                      <Text className="text-secondary text-sm text-center">
                        Đối tác ảo cần bạn làm khảo sát thay
                      </Text>
                    </View>
                  )}
                  {partnerSurveyStatus === "completed" && (
                    <View className="items-center">
                      <CheckCircle size={24} color="#28A745" />
                      <Text className="text-success font-medium">Khảo sát ảo đã hoàn thành</Text>
                      <Text className="text-secondary text-sm text-center">Bạn có thể tạo bản đồ</Text>
                    </View>
                  )}
                </View>

                {partnerSurveyStatus === "waiting" && (
                  <TouchableOpacity
                    onPress={handleTakeNewVirtualSurvey}
                    className="bg-primary rounded-xl p-4 flex-row items-center"
                  >
                    <RefreshCw size={20} color="#FFFFFF" />
                    <View className="ml-3 flex-1">
                      <Text className="text-white font-medium">Làm bài khảo sát mới cho đối tác ảo</Text>
                      <Text className="text-white/80 text-sm">Thực hiện bộ khảo sát tổng hợp</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )
          }

          const roleName = role === "host" ? mergedRoomData.hostName : mergedRoomData.partnerName
          const isSelf = roleName === user?.name
          const name = roleName
          const avatar = role === "host" ? mergedRoomData.hostAvatar : mergedRoomData.partnerAvatar
          const status = isSelf ? userSurveyStatus : partnerSurveyStatus
          const isHost = role === "host"

          return (
            <View
              key={role}
              className={`bg-white rounded-xl p-6 mb-4 shadow-sm border-l-4 ${isHost ? "border-primary" : "border-secondary"}`}
            >
              <View className="flex-row items-center mb-4">
                <View className="relative">
                  <Image
                    source={avatar ? { uri: avatar } : require("../../../assets/images/avatar.png")}
                    className="w-16 h-16 rounded-full"
                  />
                  {isHost && (
                    <View className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                      <Crown size={16} color="white" />
                    </View>
                  )}
                </View>
                <View className="ml-4 flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-bold text-secondary-dark">{name}</Text>
                    {isHost && (
                      <View className="bg-yellow-500/10 rounded-full px-2 py-1 ml-2">
                        <Text className="text-yellow-600 text-xs font-medium">Chủ phòng</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-secondary">
                    {isSelf ? "Trạng thái khảo sát của bạn" : "Trạng thái khảo sát của đối tác"}
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                {(status === "none" || status === "waiting") && (
                  <View className="items-center">
                    <Clock size={24} color="#6C757D" />
                    <Text className="text-secondary-dark font-medium">Chưa hoàn thành khảo sát</Text>
                    <Text className="text-secondary text-sm text-center">
                      {isSelf ? "Chọn một trong hai tùy chọn bên dưới" : "Đang chờ hoàn thành khảo sát"}
                    </Text>
                  </View>
                )}

                {status === "completed" && (
                  <View className="items-center">
                    <CheckCircle size={24} color="#28A745" />
                    <Text className="text-success font-medium">
                      {isSelf ? "Bài khảo sát của bạn đã cập nhật thành công" : "Bài khảo sát của đối tác đã cập nhật thành công"}
                    </Text>
                    <Text className="text-secondary text-sm text-center">Vừa cập nhật thành công</Text>
                  </View>
                )}
                {status === "existing" && (
                  <View className="items-center">
                    <CheckCircle size={24} color="#28A745" />
                    <Text className="text-success font-medium">Đã sử dụng kết quả có sẵn</Text>
                    <Text className="text-secondary text-sm text-center">Sử dụng kết quả khảo sát trước đó</Text>
                  </View>
                )}
              </View>

              {isSelf && status === "none" && (
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
                    className="bg-primary rounded-xl p-4 flex-row items-center mt-3"
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
          )
        })}

        {/* Nút tạo bản đồ */}
        <View className="mb-8">
          <TouchableOpacity
            onPress={handleCreateLoveMap}
            disabled={
              userSurveyStatus !== "completed" ||
              partnerSurveyStatus !== "completed" ||
              !isUserHost || isCreatingLoveMap
            }
            className={`rounded-xl p-6 items-center shadow-sm ${userSurveyStatus === "completed" &&
              partnerSurveyStatus === "completed" &&
              isUserHost && !isCreatingLoveMap
              ? "bg-primary "
              : "bg-gray-300"
              }`}
          >
            <View className="flex-row items-center mb-2 ">
              <Heart
                size={24}
                color={
                  userSurveyStatus === "completed" &&
                    partnerSurveyStatus === "completed" &&
                    isUserHost
                    ? "#FFFFFF"
                    : "#6C757D"
                }
              />
              <Sparkles
                size={20}
                color={
                  userSurveyStatus === "completed" &&
                    partnerSurveyStatus === "completed" &&
                    isUserHost
                    ? "#FFFFFF"
                    : "#6C757D"
                }
                className="ml-2"
              />
            </View>
            <Text className={`text-xl font-bold  ${userSurveyStatus === "completed" &&
              partnerSurveyStatus === "completed" &&
              isUserHost
              ? "text-white "
              : "text-gray-500"
              }`}>
              {isCreatingLoveMap ? "Đang tạo..." : "Tạo bản đồ tình yêu"}
            </Text>
            <Text className={`text-sm text-center mt-1 ${userSurveyStatus === "completed" &&
              partnerSurveyStatus === "completed" &&
              isUserHost
              ? "text-white/80 "
              : "text-gray-400"
              }`}>
              {userSurveyStatus !== "completed"
                ? "Vui lòng hoàn thành khảo sát của bạn"
                : partnerSurveyStatus !== "completed"
                  ? "Đang chờ đối tác hoàn thành khảo sát"
                  : "Phân tích tổng hợp kết quả cả hai người"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {renderLoadingOverlay()}
    </View>
  )
}

export default CoupleSurveyRoomScreen
