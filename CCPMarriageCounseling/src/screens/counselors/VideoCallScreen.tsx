import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, Alert } from "react-native"
import { Camera } from "expo-camera"
import { Audio } from "expo-av"
import { WebView } from "react-native-webview"
import { useRoute } from "@react-navigation/native"
import bookingApi from "@/src/config/api/booking.api" 
import Loading from "@/src/components/share/Loading"

const VideoCallScreen = () => {
  const route = useRoute<any>()
  const { bookingid } = route.params

  const [permissionGranted, setPermissionGranted] = useState(false)
  const [joinUrl, setJoinUrl] = useState<string | null>(null)

  
  const requestPermissions = async () => {
    try {
      const cameraPerm = await Camera.requestCameraPermissionsAsync()
      const audioPerm = await Audio.requestPermissionsAsync()

      if (cameraPerm.status === "granted" && audioPerm.status === "granted") {
        setPermissionGranted(true)
      } else {
        Alert.alert("Cần quyền truy cập", "Vui lòng cấp quyền Camera và Micro.")
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Lỗi", "Không thể yêu cầu quyền truy cập thiết bị.")
    }
  }

  
  const fetchJoinUrl = async () => {
    try {
      const roomData = await bookingApi.getRoomUrl(bookingid)
      setJoinUrl(roomData.joinUrl)
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể vào phòng tư vấn.")
    }
  }

  useEffect(() => {
    requestPermissions()
  }, [])

  useEffect(() => {
    if (permissionGranted) {
      fetchJoinUrl()
    }
  }, [permissionGranted])

  
  if (!permissionGranted || !joinUrl) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Loading size={60} color="#007AFF" />
      </View>
    )
  }

  return (
    <WebView
      source={{ uri: joinUrl }}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      originWhitelist={["*"]}
      allowsFullscreenVideo
    />
  )
}

export default VideoCallScreen
