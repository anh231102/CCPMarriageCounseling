import { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MessageCircle,
  Star,
  ArrowRight,
  Flag,
} from "lucide-react-native"
import bookingApi from "@/src/config/api/booking.api"
import {
  BookingMemberData,
  BookingStatus,
  getBookingStatusLabel,
} from "@/src/config/types/booking.type"

const AppointmentHistoryScreen = () => {
  const navigation = useNavigation<any>()
  const [bookings, setBookings] = useState<BookingMemberData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingApi.getMyBookings()
        setBookings(data)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu lịch sử:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const getTypeIcon = (subCategories: any[]) => {
    if (!subCategories || subCategories.length === 0) return MessageCircle
    const name = subCategories[0].name.toLowerCase()
    if (name.includes("video")) return Video
    if (name.includes("thoại") || name.includes("call")) return Phone
    return MessageCircle
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.XacNhan:
        return { bg: "bg-blue-100", text: "text-blue-600" }
      case BookingStatus.HoanThanh:
        return { bg: "bg-green-100", text: "text-green-600" }
      case BookingStatus.DeXuatLichMoi:
        return { bg: "bg-yellow-100", text: "text-yellow-700" }
      case BookingStatus.ThanhVienHuy:
        return { bg: "bg-gray-200", text: "text-gray-700" }
      case BookingStatus.BaoCao:
        return { bg: "bg-orange-100", text: "text-orange-700" }
      case BookingStatus.HoanTien:
        return { bg: "bg-cyan-100", text: "text-cyan-700" }
      case BookingStatus.KetThuc:
        return { bg: "bg-emerald-100", text: "text-emerald-700" }
      default:
        return { bg: "bg-secondary/10", text: "text-secondary" }
    }
  }

  const CountdownTimer = ({ endTime }: { endTime: string }) => {
    const [remaining, setRemaining] = useState(0)

    useEffect(() => {
      const deadline = new Date(endTime).getTime() + 24 * 60 * 60 * 1000
      const updateRemaining = () => {
        const now = new Date().getTime()
        const diff = Math.max(deadline - now, 0)
        setRemaining(diff)
      }
      updateRemaining()
      const interval = setInterval(updateRemaining, 1000)
      return () => clearInterval(interval)
    }, [endTime])

    if (remaining <= 0) return null

    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

    return (
      <Text className="text-xs text-green-500 mt-1">
        Còn lại {hours} giờ {minutes} phút {seconds} giây để báo cáo
      </Text>
    )
  }

  const renderAppointmentItem = ({ item }: { item: BookingMemberData }) => {
    const IconComponent = getTypeIcon(item.subCategories)
    const statusColor = getStatusColor(item.status)
    const now = new Date().getTime()
    const canStart = new Date(item.timeStart).getTime() <= now

    return (
      <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <View className="flex-row mb-3">
          <Image
            source={{ uri: item.counselor.avatar || "https://placeholder.svg" }}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="text-secondary-dark font-bold">{item.counselor.fullname}</Text>
            <Text className="text-secondary">
              {item.subCategories.map((sc) => sc.name).join(", ")}
            </Text>
            <View className={`mt-1 px-2 py-0.5 rounded-full self-start ${statusColor.bg}`}>
              <Text className={`text-xs ${statusColor.text}`}>
                {getBookingStatusLabel(item.status)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row flex-wrap mb-3">
          <View className="flex-row items-center mr-4 mb-2">
            <Calendar size={16} color="#6C757D" className="mr-1" />
            <Text className="text-secondary">{item.timeStart?.split("T")[0]}</Text>
          </View>
          <View className="flex-row items-center mr-4 mb-2">
            <Clock size={16} color="#6C757D" className="mr-1" />
            <Text className="text-secondary">
              {new Date(item.timeStart).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(item.timeEnd).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <IconComponent size={16} color="#6C757D" className="mr-5 ml-2" />
            <Text className="text-secondary">
              {item.subCategories[0]?.name || "Video call"}
            </Text>
          </View>
        </View>

        {item.status === BookingStatus.XacNhan && (
          <View className="flex-row">
            <TouchableOpacity
              disabled={!canStart}
              onPress={() => {
                if (!canStart) return
                navigation.navigate("StartAppointment", { appointmentId: item.id })
              }}
              className={`flex-1 rounded-lg p-2 mr-2 items-center ${canStart ? "bg-primary" : "bg-gray-300"
                }`}
            >
              <Text className={`font-medium ${canStart ? "text-white" : "text-gray-600"}`}>
                Bắt đầu tư vấn
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 border border-red-500 bg-red-500/10 rounded-lg p-2 ml-2 items-center">
              <Text className="text-red-500 font-medium">Hủy lịch</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === BookingStatus.HoanThanh && item.rating === null && (
          <View className="flex-col mt-4">
            <View className="flex-row justify-between mb-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RateAppointment", {
                    appointmentId: item.id,
                    counselor: item.counselor,
                  })
                }
                className="flex-row items-center justify-center bg-primary/10 rounded-lg p-2 mr-2 flex-1"
              >
                <Star size={16} color="#E83E8C" className="mr-1" />
                <Text className="text-primary font-medium">Đánh giá buổi tư vấn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ReportAppointment", {
                    appointmentId: item.id,
                    counselor: item.counselor,
                  })
                }
                className="flex-row items-center justify-center bg-yellow-500/10 rounded-lg p-2 flex-1"
              >
                <Flag size={16} color="#FFC107" className="mr-1" />
                <Text className="text-yellow-500 font-medium">Báo cáo buổi tư vấn</Text>
              </TouchableOpacity>
            </View>
            <CountdownTimer endTime={item.timeEnd} />
          </View>
        )}

        {item.status === BookingStatus.HoanThanh && item.rating !== null && (
          <TouchableOpacity className="flex-row items-center justify-center bg-success/10 rounded-lg p-2">
            <Calendar size={16} color="#28A745" className="mr-1" />
            <Text className="text-success font-medium">Đặt lịch lại</Text>
          </TouchableOpacity>
        )}

        {item.status === BookingStatus.DeXuatLichMoi && (
          <View className="flex-row mt-2">
            <TouchableOpacity className="flex-1 bg-green-500/10 rounded-lg p-2 mr-2 items-center">
              <Text className="text-green-500 font-medium">Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-red-500/10 rounded-lg p-2 ml-2 items-center">
              <Text className="text-red-500 font-medium">Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === BookingStatus.ThanhVienHuy && (
          <TouchableOpacity className="flex-row items-center justify-center bg-blue-100 rounded-lg p-2 mt-2">
            <Calendar size={16} color="#007BFF" className="mr-1" />
            <Text className="text-blue-600 font-medium">Đặt lịch lại</Text>
          </TouchableOpacity>
        )}

        {item.status === BookingStatus.BaoCao && (
          <View className="items-center bg-orange-100 p-2 rounded-lg mt-2">
            <Text className="text-orange-600 font-medium">Chờ phản hồi từ hệ thống</Text>
          </View>
        )}

        {item.status === BookingStatus.HoanTien && (
          <View className="items-center bg-cyan-100 p-2 rounded-lg mt-2">
            <Text className="text-cyan-700 font-medium">Hoàn tiền thành công</Text>
          </View>
        )}

        {item.status === BookingStatus.KetThuc && (
         <View className="flex-col mt-4">
            <View className="flex-row justify-between mb-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RateAppointment", {
                    appointmentId: item.id,
                    counselor: item.counselor,
                  })
                }
                className="flex-row items-center justify-center bg-primary/10 rounded-lg p-2 mr-2 flex-1"
              >
                <Star size={16} color="#E83E8C" className="mr-1" />
                <Text className="text-primary font-medium">Đánh giá buổi tư vấn</Text>
              </TouchableOpacity>
              
            </View>
            
          </View>
        )}
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <TouchableOpacity
        onPress={() => navigation.navigate("CounselorList")}
        className="bg-primary/10 rounded-lg p-4 mb-6"
      >
        <Text className="text-primary font-bold text-lg mb-2">Tìm chuyên gia tư vấn</Text>
        <View className="flex-row items-center">
          <Text className="text-primary font-medium">Xem danh sách chuyên gia</Text>
          <ArrowRight size={16} color="#E83E8C" className="ml-1" />
        </View>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#E83E8C" className="mt-10" />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center p-6">
              <Text className="text-secondary-dark text-lg font-medium mb-2">Chưa có lịch sử tư vấn</Text>
              <Text className="text-secondary text-center mb-4">
                Bạn chưa có buổi tư vấn nào. Hãy đặt lịch với chuyên gia để được hỗ trợ.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("CounselorList")}
                className="bg-primary rounded-lg p-3 w-full items-center"
              >
                <Text className="text-white font-medium">Tìm chuyên gia ngay</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  )
}

export default AppointmentHistoryScreen
