"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native"
import { Bell, Calendar, BookOpen, Heart, MessageCircle, Trash2 } from "lucide-react-native"

const NotificationsScreen = () => {
  // Cài đặt thông báo
  const [settings, setSettings] = useState({
    appointments: true,
    courses: true,
    surveys: true,
    messages: true,
    promotions: false,
  })

  // Giả lập dữ liệu thông báo
  const notifications = [
    {
      id: "1",
      title: "Nhắc nhở buổi tư vấn",
      message: "Bạn có buổi tư vấn với TS. Nguyễn Thị A vào lúc 09:00 ngày mai",
      time: "1 giờ trước",
      read: false,
      type: "appointment",
      icon: Calendar,
    },
    {
      id: "2",
      title: "Khóa học mới",
      message: "Khóa học 'Giao tiếp hiệu quả trong hôn nhân' đã được thêm vào",
      time: "2 giờ trước",
      read: true,
      type: "course",
      icon: BookOpen,
    },
    {
      id: "3",
      title: "Kết quả khảo sát",
      message: "Kết quả khảo sát MBTI của bạn đã sẵn sàng",
      time: "1 ngày trước",
      read: true,
      type: "survey",
      icon: Heart,
    },
    {
      id: "4",
      title: "Tin nhắn mới",
      message: "Bạn có tin nhắn mới từ TS. Trần Văn B",
      time: "2 ngày trước",
      read: true,
      type: "message",
      icon: MessageCircle,
    },
  ]

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }))
  }

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className={`p-4 mb-3 rounded-lg ${item.read ? "bg-white" : "bg-primary/5"} border border-gray-100`}
    >
      <View className="flex-row">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
            item.type === "appointment"
              ? "bg-info/10"
              : item.type === "course"
                ? "bg-success/10"
                : item.type === "survey"
                  ? "bg-primary/10"
                  : "bg-warning/10"
          }`}
        >
          <item.icon
            size={20}
            color={
              item.type === "appointment"
                ? "#17A2B8"
                : item.type === "course"
                  ? "#28A745"
                  : item.type === "survey"
                    ? "#E83E8C"
                    : "#FFC107"
            }
          />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-secondary-dark font-bold">{item.title}</Text>
            <Text className="text-secondary text-xs">{item.time}</Text>
          </View>
          <Text className="text-secondary">{item.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-secondary-dark mb-4">Cài đặt thông báo</Text>

            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Calendar size={20} color="#17A2B8" className="mr-3" />
                <Text className="text-secondary-dark">Lịch hẹn tư vấn</Text>
              </View>
              <Switch
                value={settings.appointments}
                onValueChange={() => toggleSetting("appointments")}
                trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <BookOpen size={20} color="#28A745" className="mr-3" />
                <Text className="text-secondary-dark">Khóa học</Text>
              </View>
              <Switch
                value={settings.courses}
                onValueChange={() => toggleSetting("courses")}
                trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Heart size={20} color="#E83E8C" className="mr-3" />
                <Text className="text-secondary-dark">Khảo sát</Text>
              </View>
              <Switch
                value={settings.surveys}
                onValueChange={() => toggleSetting("surveys")}
                trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <MessageCircle size={20} color="#FFC107" className="mr-3" />
                <Text className="text-secondary-dark">Tin nhắn</Text>
              </View>
              <Switch
                value={settings.messages}
                onValueChange={() => toggleSetting("messages")}
                trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Bell size={20} color="#6C757D" className="mr-3" />
                <Text className="text-secondary-dark">Khuyến mãi và tin tức</Text>
              </View>
              <Switch
                value={settings.promotions}
                onValueChange={() => toggleSetting("promotions")}
                trackColor={{ false: "#D1D5DB", true: "#E83E8C" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-secondary-dark">Thông báo gần đây</Text>
            <TouchableOpacity className="flex-row items-center">
              <Trash2 size={16} color="#6C757D" className="mr-1" />
              <Text className="text-secondary">Xóa tất cả</Text>
            </TouchableOpacity>
          </View>

          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className={`p-4 mb-3 rounded-lg ${
                notification.read ? "bg-white" : "bg-primary/5"
              } border border-gray-100`}
            >
              <View className="flex-row">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    notification.type === "appointment"
                      ? "bg-info/10"
                      : notification.type === "course"
                        ? "bg-success/10"
                        : notification.type === "survey"
                          ? "bg-primary/10"
                          : "bg-warning/10"
                  }`}
                >
                  <notification.icon
                    size={20}
                    color={
                      notification.type === "appointment"
                        ? "#17A2B8"
                        : notification.type === "course"
                          ? "#28A745"
                          : notification.type === "survey"
                            ? "#E83E8C"
                            : "#FFC107"
                    }
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-secondary-dark font-bold">{notification.title}</Text>
                    <Text className="text-secondary text-xs">{notification.time}</Text>
                  </View>
                  <Text className="text-secondary">{notification.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default NotificationsScreen
