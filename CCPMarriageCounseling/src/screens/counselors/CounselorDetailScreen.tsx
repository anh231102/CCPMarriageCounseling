import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Star, Calendar, Phone, Mail, MessageCircle } from "lucide-react-native"
import { Counselor } from "@/src/config/types/counselor.type"

const CounselorDetailScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { counselor }: { counselor: Counselor } = route.params

  // Dữ liệu đánh giá tạm thời
  const reviews = [
    {
      id: "1",
      name: "Nguyễn Văn X",
      rating: 5,
      date: "15/05/2023",
      comment: "Chuyên gia rất tận tâm và chuyên nghiệp. Tôi đã học được nhiều kỹ năng giao tiếp hữu ích.",
    },
    {
      id: "2",
      name: "Trần Thị Y",
      rating: 4,
      date: "10/04/2023",
      comment: "Buổi tư vấn rất hữu ích. Tôi và chồng đã cải thiện được nhiều vấn đề trong mối quan hệ.",
    },
    {
      id: "3",
      name: "Lê Văn Z",
      rating: 5,
      date: "02/03/2023",
      comment: "Chuyên gia có nhiều kinh nghiệm và đưa ra những lời khuyên thiết thực.",
    },
  ]

  const handleBookAppointment = () => {
    navigation.navigate("BookAppointment", {
      id: counselor.id,
      name: counselor.fullname,
      counselor,
    })
  }

  const renderReviewItem = ({ item }: { item: any }) => (
    <View className="bg-gray-50 rounded-lg p-3 mb-3">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-medium text-secondary-dark">{item.name}</Text>
        <Text className="text-secondary text-xs">{item.date}</Text>
      </View>
      <View className="flex-row mb-2">
        {[...Array(5)].map((_, index) => (
          <Star key={index} size={14} color="#FFC107" fill={index < item.rating ? "#FFC107" : "transparent"} />
        ))}
      </View>
      <Text className="text-secondary">{item.comment}</Text>
    </View>
  )

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 items-center">
       <Image source={{ uri: counselor.avatar ?? undefined }} className="w-24 h-24 rounded-full mb-3" />

        <Text className="text-black text-xl font-bold">{counselor.fullname}</Text>
        <Text className="text-black opacity-90 mb-2">
          {counselor.subCategories.map((s) => s.name).join(", ")}
        </Text>
        <View className="flex-row items-center">
          <Star size={16} color="yellow" fill="yellow" />
          <Text className="text-black ml-1 mr-1">{counselor.rating}</Text>
          <Text className="text-black opacity-90"> (3 đánh giá)</Text>
        </View>
      </View>

      <View className="bg-white mx-4 p-6 rounded-lg shadow-sm mb-6">
        {/* Hành động */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className="flex-1 items-center mr-2 p-3 bg-primary/10 rounded-lg"
            onPress={handleBookAppointment}
          >
            <Calendar size={20} color="#E83E8C" />
            <Text className="text-primary mt-1 font-medium">Đặt lịch</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 items-center ml-2 p-3 bg-secondary/10 rounded-lg">
            <MessageCircle size={20} color="#6C757D" />
            <Text className="text-secondary mt-1 font-medium">Nhắn tin</Text>
          </TouchableOpacity>
        </View>

        {/* Giới thiệu */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Giới thiệu</Text>
          <Text className="text-secondary mb-2">
            {counselor.fullname} là chuyên gia tư vấn hôn nhân với {counselor.yearOfJob} năm kinh nghiệm trong lĩnh vực{" "}
            {counselor.subCategories.map((s) => s.name).join(", ")}. Với kiến thức chuyên sâu và phương pháp tiếp cận tận tâm, chuyên gia đã
            giúp đỡ hàng trăm cặp đôi cải thiện mối quan hệ và xây dựng hôn nhân hạnh phúc.
          </Text>
          <Text className="text-secondary">{counselor.description}</Text>
        </View>

        {/* Chuyên môn */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Chuyên môn</Text>
          <View className="flex-row flex-wrap">
            {counselor.subCategories.map((sub) => (
              <View key={sub.id} className="bg-primary/10 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-primary">{sub.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Thông tin liên hệ */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Thông tin liên hệ</Text>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Phone size={18} color="#6C757D" />
            </View>
            <View>
              <Text className="text-secondary-dark">Điện thoại</Text>
              <Text className="text-secondary">{counselor.phone || "Chưa có"}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Mail size={18} color="#6C757D" />
            </View>
            <View>
              <Text className="text-secondary-dark">Email</Text>
              <Text className="text-secondary">
                {counselor.fullname.split(" ").pop()?.toLowerCase() || "user"}@ccp.vn
              </Text>
            </View>
          </View>
        </View>

        {/* Đánh giá */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Đánh giá</Text>
          {reviews.map((item) => (
            <View key={item.id}>{renderReviewItem({ item })}</View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default CounselorDetailScreen
