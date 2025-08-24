// components/profile/MyProfileComponent.tsx
"use client"

import { useEffect, useState } from "react"
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Edit } from "lucide-react-native"
import memberApi from "@/src/config/api/member.api"
import Loading from "./Loading"

type Props = {
  image?: boolean
  touchProfile?: boolean
  name?: boolean
}

const MyProfileComponent = (props: Props) => {
  const navigation = useNavigation<any>()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const data = await memberApi.getMyProfile()
      setProfile(data)
    } catch (err) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchProfile)
    fetchProfile()
    return unsubscribe
  }, [navigation])

  if (loading) return <Loading color="#FFFFFF" size={24} />
  if (!profile) return null

  // ✅ Xử lý props chính xác
  const hasNoProps =
    props.image === false &&
    props.touchProfile === false &&
    props.name === false

  const showImage = hasNoProps || props.image === true
  const showTouch = hasNoProps || props.touchProfile === true
  const showName = hasNoProps || props.name === true

  return (
    <View className="items-center">
      {(showImage || showTouch) && (
        <View className="relative">
          {showImage && (
            <Image
              source={
                profile.avatar
                  ? { uri: profile.avatar }
                  : require("../../../assets/images/avatar.jpg")
              }
              className="w-24 h-24 rounded-full"
            />
          )}
          {showTouch && (
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-sm"
            >
              <Edit size={16} color="#E83E8C" />
            </TouchableOpacity>
          )}
        </View>
      )}
      {showName && (
        <Text className="text-black text-xl font-bold mt-3">
          {profile.fullname || "Người dùng"}
        </Text>
      )}
    </View>
  )
}



export default MyProfileComponent
