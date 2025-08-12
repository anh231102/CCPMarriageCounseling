import { FlatList, TouchableOpacity, View, Text, Image, RefreshControl } from "react-native"
import { Star, Calendar } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { Counselor } from "@/src/config/types/counselor.type"

interface Props {
  data: Counselor[]
  searchQuery: string
  refreshing: boolean
  onRefresh: () => void
}

const CounselorListFull = ({ data, searchQuery, refreshing, onRefresh }: Props) => {
  const navigation = useNavigation<any>()

  const handleCounselorPress = (counselor: Counselor) => {
    navigation.navigate("CounselorDetail", {
      id: counselor.id,
      name: counselor.fullname,
      counselor: counselor,
    })
  }

  const renderCounselorItem = ({ item }: { item: Counselor }) => (
    <TouchableOpacity onPress={() => handleCounselorPress(item)} className="bg-white rounded-lg shadow-sm mb-4 p-4">
      <View className="flex-row">
        <Image source={{ uri: item.avatar || "https://via.placeholder.com/100" }} className="w-20 h-20 rounded-full" />
        <View className="flex-1 ml-4">
          <Text className="text-secondary-dark font-bold text-base">{item.fullname}</Text>
          <Text
            className="text-secondary mb-1"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.subCategories.map((cat) => cat.name).join(", ")}
          </Text>

          <Text className="text-secondary text-sm mb-2">{item.yearOfJob} năm kinh nghiệm</Text>

          <View className="flex-row items-center">
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text className="text-secondary-dark ml-1 mr-1">
              {item.rating ? (Math.round(item.rating * 10) / 10).toFixed(1) : "0.0"}
            </Text>

            <Text className="text-secondary text-xs">({item.reviews} đánh giá)</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <Text className="text-primary font-bold">{`${item.price.toLocaleString("vi-VN")}đ/Suất tư vấn`}</Text>
        <TouchableOpacity
          onPress={() => {
            if (item.isBookingAvailible) {
              navigation.navigate("BookAppointment", {
                id: item.id,
                name: item.fullname,
                counselor: item,
              })
            }
          }}
          className={`flex-row items-center px-3 py-1 rounded-lg ${item.isBookingAvailible ? "bg-primary" : "bg-gray-300"}`}
        >
          <Calendar size={16} color="white" />
          <Text className="text-white font-medium ml-1">
            {item.isBookingAvailible ? "Đặt lịch" : "Không có lịch"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const filteredData = data.filter((item) =>
    item.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <FlatList
      data={filteredData}
      renderItem={renderCounselorItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={["#E83E8C"]} // màu vòng quay Android
        tintColor="#E83E8C"  // màu vòng quay iOS
      />
    }
      
    />
  )
}

export default CounselorListFull
