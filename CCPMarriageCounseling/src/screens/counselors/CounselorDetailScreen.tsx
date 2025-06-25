import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Star, Calendar, Phone, Mail, MessageCircle } from "lucide-react-native"
import { Counselor } from "@/src/config/types/counselor.type"
import CounselorFeedbackList from "@/src/components/counselor/CounselorFeedbackList"

const CounselorDetailScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { counselor }: { counselor: Counselor } = route.params

  const handleBookAppointment = () => {
    navigation.navigate("BookAppointment", {
      id: counselor.id,
      name: counselor.fullname,
      counselor,
    })
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 items-center">
        <Image source={{ uri: counselor.avatar ?? undefined }} className="w-24 h-24 rounded-full mb-3" />
        <Text className="text-black text-xl font-bold">{counselor.fullname}</Text>
        <Text className="text-black opacity-90 mb-2">
          {Array.isArray(counselor.subCategories)
            ? counselor.subCategories.map((s) => s.name).join(", ")
            : "Chưa có chuyên môn"}
        </Text>

        <View className="flex-row items-center">
          <Star size={14} color="#FFC107" fill="#FFC107" />
          <Text className="text-secondary-dark ml-1 mr-1">
            {counselor.rating ? (Math.round(counselor.rating * 10) / 10).toFixed(1) : "0.0"}
          </Text>
        </View>
      </View>

      <View className="bg-white mx-4 p-6 rounded-lg shadow-sm mb-6">
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

        <View className="mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Giới thiệu</Text>
          <Text className="text-secondary mb-2">
            {counselor.fullname} là chuyên gia tư vấn hôn nhân với {counselor.yearOfJob} năm kinh nghiệm trong lĩnh vực{" "}
            {Array.isArray(counselor.subCategories)
              ? counselor.subCategories.map((s) => s.name).join(", ")
              : "Chưa rõ"}.
            Với kiến thức chuyên sâu và phương pháp tiếp cận tận tâm, chuyên gia đã giúp đỡ hàng trăm cặp đôi cải thiện
            mối quan hệ và xây dựng hôn nhân hạnh phúc.
          </Text>
          <Text className="text-secondary">{counselor.description}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Chuyên môn</Text>
          <View className="flex-row flex-wrap">
            {Array.isArray(counselor.subCategories) &&
              Array.from(
                new Map(counselor.subCategories.map((s) => [s.id, s])).values()
              ).map((sub) => (
                <View key={`SubCategory_${sub.id}`} className="bg-primary/10 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-primary">{sub.name}</Text>
                </View>
              ))}

          </View>
        </View>

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

        <View className="mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Đánh giá</Text>
          <CounselorFeedbackList counselorId={counselor.id} />
        </View>
      </View>
    </ScrollView>
  )
}

export default CounselorDetailScreen
