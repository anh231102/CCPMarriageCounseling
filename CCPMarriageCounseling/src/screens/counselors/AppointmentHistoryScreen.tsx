import { View, Text, FlatList, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Calendar, Clock, Video, Phone, MessageCircle, Star, ArrowRight } from "lucide-react-native"

const AppointmentHistoryScreen = () => {
  const navigation = useNavigation<any>()

  // Giả lập dữ liệu lịch sử tư vấn
  const appointments = [
    {
      id: "1",
      counselor: {
        id: "1",
        name: "TS. Nguyễn Thị A",
        image: "https://placeholder.svg?height=100&width=100",
        specialty: "Tâm lý hôn nhân",
      },
      date: "01/06/2023",
      time: "09:00 - 10:00",
      type: { id: "video", name: "Video call", icon: Video },
      status: "upcoming", // sắp tới
      canCancel: true,
    },
    {
      id: "2",
      counselor: {
        id: "2",
        name: "ThS. Trần Văn B",
        image: "https://placeholder.svg?height=100&width=100",
        specialty: "Tư vấn gia đình",
      },
      date: "15/05/2023",
      time: "15:00 - 16:00",
      type: { id: "phone", name: "Cuộc gọi thoại", icon: Phone },
      status: "completed", // đã hoàn thành
      rated: false,
    },
    {
      id: "3",
      counselor: {
        id: "3",
        name: "TS. Lê Thị C",
        image: "https://placeholder.svg?height=100&width=100",
        specialty: "Tâm lý học đôi",
      },
      date: "10/05/2023",
      time: "10:30 - 11:30",
      type: { id: "chat", name: "Nhắn tin", icon: MessageCircle },
      status: "completed", // đã hoàn thành
      rated: true,
    },
    {
      id: "4",
      counselor: {
        id: "4",
        name: "ThS. Phạm Văn D",
        image: "https://placeholder.svg?height=100&width=100",
        specialty: "Tư vấn nuôi dạy con",
      },
      date: "05/05/2023",
      time: "13:30 - 14:30",
      type: { id: "video", name: "Video call", icon: Video },
      status: "cancelled", // đã hủy
    },
  ]

  const renderAppointmentItem = ({ item }: { item: any }) => (
    <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
      <View className="flex-row mb-3">
        <Image source={{ uri: item.counselor.image }} className="w-16 h-16 rounded-full" />
        <View className="ml-3 flex-1">
          <Text className="text-secondary-dark font-bold">{item.counselor.name}</Text>
          <Text className="text-secondary">{item.counselor.specialty}</Text>

          <View
            className={`mt-1 px-2 py-0.5 rounded-full self-start ${
              item.status === "upcoming"
                ? "bg-info/10"
                : item.status === "completed"
                  ? "bg-success/10"
                  : "bg-secondary/10"
            }`}
          >
            <Text
              className={`text-xs ${
                item.status === "upcoming"
                  ? "text-info"
                  : item.status === "completed"
                    ? "text-success"
                    : "text-secondary"
              }`}
            >
              {item.status === "upcoming" ? "Sắp tới" : item.status === "completed" ? "Đã hoàn thành" : "Đã hủy"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap mb-3">
        <View className="flex-row items-center mr-4 mb-2">
          <Calendar size={16} color="#6C757D" className="mr-1" />
          <Text className="text-secondary">{item.date}</Text>
        </View>
        <View className="flex-row items-center mr-4 mb-2">
          <Clock size={16} color="#6C757D" className="mr-1" />
          <Text className="text-secondary">{item.time}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <item.type.icon size={16} color="#6C757D" className="mr-1" />
          <Text className="text-secondary">{item.type.name}</Text>
        </View>
      </View>

      {item.status === "upcoming" && (
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => {
              // Xử lý khi nhấn vào nút Bắt đầu tư vấn
            }}
            className="flex-1 bg-primary rounded-lg p-2 mr-2 items-center"
          >
            <Text className="text-white font-medium">Bắt đầu tư vấn</Text>
          </TouchableOpacity>

          {item.canCancel && (
            <TouchableOpacity
              onPress={() => {
                // Xử lý khi nhấn vào nút Hủy lịch
              }}
              className="flex-1 bg-white border border-danger rounded-lg p-2 ml-2 items-center"
            >
              <Text className="text-danger font-medium">Hủy lịch</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {item.status === "completed" && !item.rated && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("RateAppointment", {
              appointmentId: item.id,
              counselor: item.counselor,
            })
          }
          className="flex-row items-center justify-center bg-primary/10 rounded-lg p-2"
        >
          <Star size={16} color="#E83E8C" className="mr-1" />
          <Text className="text-primary font-medium">Đánh giá buổi tư vấn</Text>
        </TouchableOpacity>
      )}

      {item.status === "completed" && item.rated && (
        <TouchableOpacity
          onPress={() => {
            // Xử lý khi nhấn vào nút Đặt lịch lại
          }}
          className="flex-row items-center justify-center bg-success/10 rounded-lg p-2"
        >
          <Calendar size={16} color="#28A745" className="mr-1" />
          <Text className="text-success font-medium">Đặt lịch lại</Text>
        </TouchableOpacity>
      )}
    </View>
  )

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

      <FlatList
        data={appointments}
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
    </View>
  )
}

export default AppointmentHistoryScreen
