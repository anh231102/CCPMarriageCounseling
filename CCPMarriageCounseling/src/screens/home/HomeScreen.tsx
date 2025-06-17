"use client"

import { View, Text, ScrollView, Image, TouchableOpacity, Button, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Bell, Heart, BookOpen, Calendar, ArrowRight } from "lucide-react-native"
import { useAuth } from "@/src/hooks/useAuth"
import CounselorListMini from "@/src/components/counselor/CounselorListMini"
import { useEffect, useState } from "react"
import counselorApi from "@/src/config/api/counselor.api"
import { Counselor } from "@/src/config/types/counselor.type"

const HomeScreen = () => {
  const navigation = useNavigation<any>()
  const { logout, user } = useAuth()

  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const data: Counselor[] = await counselorApi.getCounselorWithSub()
        setCounselors(data)
      } catch (err) {
        console.error("Lỗi khi lấy danh sách chuyên gia:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCounselors()
  }, [])

  const blogs = [
    {
      id: "1",
      title: "5 cách giao tiếp hiệu quả trong hôn nhân",
      excerpt: "Giao tiếp là chìa khóa để xây dựng mối quan hệ bền vững...",
      image: "https://placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Làm thế nào để vượt qua khủng hoảng hôn nhân",
      excerpt: "Mọi cuộc hôn nhân đều có thể gặp khó khăn, nhưng...",
      image: "https://placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary p-4 pt-12 pb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg font-medium">Xin chào,</Text>
            <Text className="text-white text-xl font-bold">{user?.name || "Người dùng"}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileTab", { screen: "Notifications" })}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Bell size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white mx-4 p-4 rounded-lg shadow-sm -mt-5">
        <Text className="text-secondary-dark font-medium mb-4">Truy cập nhanh</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => navigation.navigate("SurveyTab")} className="items-center">
            <View className="w-12 h-12 bg-primary-light/20 rounded-full items-center justify-center mb-1">
              <Heart size={20} color="#E83E8C" />
            </View>
            <Text className="text-xs text-secondary">Khảo sát</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("CoursesTab")} className="items-center">
            <View className="w-12 h-12 bg-info/20 rounded-full items-center justify-center mb-1">
              <BookOpen size={20} color="#17A2B8" />
            </View>
            <Text className="text-xs text-secondary">Khóa học</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Counselors")} className="items-center">
            <View className="w-12 h-12 bg-success/20 rounded-full items-center justify-center mb-1">
              <Calendar size={20} color="#28A745" />
            </View>
            <Text className="text-xs text-secondary">Đặt Lịch</Text>
          </TouchableOpacity>
        </View>
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
          <ActivityIndicator size="small" color="#4F46E5" />
        ) : (
          <CounselorListMini data={counselors} />
        )}
      </View>

      {/* Blog Posts */}
      <View className="mt-6 px-4 mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-secondary-dark">Bài viết hữu ích</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-primary mr-1">Xem tất cả</Text>
            <ArrowRight size={16} color="#E83E8C" />
          </TouchableOpacity>
        </View>

        {blogs.map((blog) => (
          <TouchableOpacity key={blog.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
            <Image source={{ uri: blog.image }} className="w-full h-40" />
            <View className="p-3">
              <Text className="text-secondary-dark font-bold text-base mb-1">{blog.title}</Text>
              <Text className="text-secondary text-sm">{blog.excerpt}</Text>
              <Text className="text-primary mt-2">Đọc thêm</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="w-3/5 self-center mb-6">
        <Button title="Đăng xuất" onPress={logout} color="#ff4d4d" />
      </View>
    </ScrollView>
  )
}

export default HomeScreen
