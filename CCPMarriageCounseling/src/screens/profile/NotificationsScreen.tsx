"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, RefreshControl } from "react-native"
import { Search, Bell, BellRing, Calendar, ChevronDown } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import notificationApi from "@/src/config/api/notification.api"
import Loading from "@/src/components/share/Loading"

const PAGE_SIZE = 10

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [allNotifications, setAllNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Lấy danh sách thông báo từ API
  const fetchNotifications = async (reset = false) => {
    setLoading(true)
    try {
      const data = await notificationApi.getMyNotifications()
      setAllNotifications(data)
      if (reset) {
        setNotifications(data.slice(0, PAGE_SIZE))
        setPage(2)
        setHasMore(data.length > PAGE_SIZE)
      } else {
        setNotifications((prev) => [...prev, ...data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)])
        setPage((prev) => prev + 1)
        setHasMore(page * PAGE_SIZE < data.length)
      }
    } catch (e) {
      setNotifications([])
      setHasMore(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications(true)
  }, [])
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications(true)
    setRefreshing(false)
  }

  // Search
  const filtered = search
    ? notifications.filter((n) => n.description?.toLowerCase().includes(search.toLowerCase()))
    : notifications

  const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  // Đặt giờ phút giây về 0 để so sánh ngày
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffTime = nowOnly.getTime() - dateOnly.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })

  if (diffDays === 0) return `Hôm nay, ${timeStr}`
  if (diffDays === 1) return `Hôm qua, ${timeStr}`
  if (diffDays < 7) return `${diffDays} ngày trước, ${timeStr}`
  return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" }) + `, ${timeStr}`
}

  const getNotificationIcon = (type: string) => {
    return <BellRing size={20} color="#E83E8C" />
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E83E8C"]}
            tintColor="#E83E8C"
          />
        }>
        <View className="p-4">
          {/* Search Bar */}
          <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <View className="flex-row items-center p-4">
              <View className="bg-pink-50 p-2 rounded-xl mr-3">
                <Search size={20} color="#E83E8C" />
              </View>
              <TextInput
                placeholder="Tìm kiếm thông báo..."
                value={search}
                onChangeText={setSearch}
                className="flex-1 text-gray-800 text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Notifications List */}
          {filtered.length === 0 && !loading && (
            <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
              <View className="w-16 h-16 bg-pink-50 rounded-full items-center justify-center mb-4">
                <Bell size={32} color="#E83E8C" />
              </View>
              <Text className="text-gray-700 text-lg font-bold mb-2">Không có thông báo nào</Text>
              <Text className="text-gray-500 text-center">
                {search ? "Thử tìm kiếm với từ khóa khác" : "Bạn chưa có thông báo nào"}
              </Text>
            </View>
          )}

          {filtered.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className={`mb-4 rounded-2xl shadow-sm overflow-hidden ${notification.isRead ? "bg-white" : "bg-pink-50"
                }`}
              activeOpacity={0.8}
            >
              <View className="p-5">
                {/* Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className={`p-2 rounded-xl mr-3 ${notification.isRead ? "bg-gray-100" : "bg-pink-100"}`}>
                      {getNotificationIcon(notification.notiType)}
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`font-bold text-base mb-1 ${notification.isRead ? "text-gray-700" : "text-pink-800"
                          }`}
                        numberOfLines={1}
                      >
                        {notification.notiType}
                      </Text>
                      {!notification.isRead && <View className="bg-pink-500 rounded-full w-2 h-2 self-start" />}
                    </View>
                  </View>

                  {/* Date */}
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 text-xs ml-1">{formatDate(notification.createDate)}</Text>
                  </View>
                </View>

                {/* Content */}
                <View className={`rounded-xl p-4 ${notification.isRead ? "bg-gray-50" : "bg-white"}`}>
                  <Text className="text-gray-700 text-sm leading-5" numberOfLines={3}>
                    {notification.description}
                  </Text>
                </View>
              </View>

              {/* Bottom Accent */}
              {!notification.isRead && (
                <LinearGradient
                  colors={["#E83E8C", "#FF6B9D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 4, // tương đương h-1 (1 * 4px)
                    width: "100%", // nên thêm để full chiều ngang
                  }}
                />

              )}
            </TouchableOpacity>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <View className="bg-white rounded-2xl p-6 items-center shadow-sm mb-4">
              <Loading size={60} color="#E83E8C" />
              <Text className="text-gray-600 mt-3 font-medium">Đang tải thông báo...</Text>
            </View>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <TouchableOpacity
              onPress={() => fetchNotifications()}
              className="rounded-2xl overflow-hidden shadow-sm mb-6"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#E83E8C", "#FF6B9D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  padding: 16,           // p-4 = 16px
                  flexDirection: "row",  // flex-row
                  alignItems: "center",  // items-center
                  justifyContent: "center", // justify-center
                }}
              >
                <ChevronDown size={20} color="#fff" />
                <Text className="text-white font-bold text-base ml-2">Tải thêm thông báo</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationsScreen
