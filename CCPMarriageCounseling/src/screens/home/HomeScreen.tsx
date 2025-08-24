"use client"

import { View, Text, ScrollView, Image, TouchableOpacity, Button, ActivityIndicator, RefreshControl } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Bell, Heart, BookOpen, Calendar, ArrowRight, LayoutList } from "lucide-react-native"
import { useAuth } from "@/src/hooks/useAuth"
import CounselorListMini from "@/src/components/counselor/CounselorListMini"
import { useEffect, useState } from "react"
import counselorApi from "@/src/config/api/counselor.api"
import { Counselor } from "@/src/config/types/counselor.type"
import Loading from "@/src/components/share/Loading"
import MyProfileComponent from "@/src/components/share/MyProfileComponent"
import ListPost from "@/src/components/post/ListPost"
import CourseListMini from "@/src/components/courses/CourseListMini"
import MembershipPromoPanel from "@/src/components/membership/MembershipPromoPanel"
import notificationApi from "@/src/config/api/notification.api"

const HomeScreen = () => {
  const navigation = useNavigation<any>()
  const { logout, user } = useAuth()

  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [unopenedCount, setUnopenedCount] = useState(0)

  const fetchCounselors = async () => {
    try {
      setLoading(true)
      const data: Counselor[] = await counselorApi.getCounselorWithSub()
      setCounselors(data)
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chuyên gia:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounselors()
  }, [])
  useEffect(() => {
  const fetchNotificationSummary = async () => {
    try {
      const summary = await notificationApi.getNotificationSummary()
      setUnopenedCount(summary.unopenedCount)
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err)
    }
  }
  // Lắng nghe khi HomeScreen được focus
  const unsubscribe = navigation.addListener("focus", fetchNotificationSummary)
  // Gọi lần đầu
  fetchNotificationSummary()
  return unsubscribe
}, [navigation])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchCounselors()
    setRefreshing(false)
  }


  return (
    <ScrollView className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E83E8C"]} />
      }>
      {/* Header */}
      <View className="bg-primary px-4 pt-2 pb-6">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.navigate("ProfileTab", { screen: "Profile" })}>
            <View>
              <Text className="text-white text-lg font-medium">Xin chào,</Text>
              <MyProfileComponent name />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileTab", { screen: "Notifications" })}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Bell size={20} color="white" />
            {unopenedCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "#69515C",
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                  {unopenedCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white mx-4 p-4 rounded-lg shadow-sm -mt-5">
        <Text className="text-secondary-dark font-medium mb-4">Truy cập nhanh</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => navigation.navigate("SurveyTab")} className="items-center">
            <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mb-1">
              <Heart size={20} color="#E83E8C" />
            </View>
            <Text className="text-xs text-secondary">Khảo sát</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ListAllPostScreen")} className="items-center">
            <View className="w-12 h-12 bg-orange-500/20 rounded-full items-center justify-center mb-1">
              <LayoutList size={20} color="#FF6600" />
            </View>
            <Text className="text-xs text-secondary">Bài viết</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("CoursesTab")} className="items-center">
            <View className="w-12 h-12 bg-info/20 rounded-full items-center justify-center mb-1">
              <BookOpen size={20} color="#17A2B8" />
            </View>
            <Text className="text-xs text-secondary">Khóa học</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("CounselorsTab")} className="items-center">
            <View className="w-12 h-12 bg-success/20 rounded-full items-center justify-center mb-1">
              <Calendar size={20} color="#28A745" />
            </View>
            <Text className="text-xs text-secondary">Đặt Lịch</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-4 mt-4">
        <MembershipPromoPanel />
      </View>
      {/* Featured Counselors */}
      <View className="mt-6 px-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-secondary-dark">Chuyên gia nổi bật</Text>
          <TouchableOpacity onPress={() =>
            navigation.navigate("CounselorsTab", {
              screen: "CounselorList",
            })
          } className="flex-row items-center">
            <Text className="text-primary mr-1">Xem tất cả</Text>
            <ArrowRight size={16} color="#E83E8C" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Loading size={30} />
        ) : (
          <CounselorListMini data={counselors} />
        )}
      </View>

      <View className="mt-6 px-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-secondary-dark">Khóa học nổi bật</Text>
          <TouchableOpacity onPress={() =>
            navigation.navigate("CoursesTab", {
              screen: "CourseList",
            })
          } className="flex-row items-center">
            <Text className="text-primary mr-1">Xem tất cả</Text>
            <ArrowRight size={16} color="#E83E8C" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Loading size={30} />
        ) : (
          <CourseListMini />
        )}
      </View>

      {/* Blog Posts */}
      <View className="mt-6  mb-8">
        <ListPost />
      </View>

      <View className="w-3/5 self-center mb-6">
        <Button title="Đăng xuất" onPress={logout} color="#ff4d4d" />
      </View>
    </ScrollView>
  )
}

export default HomeScreen
