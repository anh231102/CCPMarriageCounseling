"use client"

import { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Search, Filter, Star, ArrowRight } from "lucide-react-native"

const courses = [
  {
    id: "1",
    title: "Giao tiếp hiệu quả trong hôn nhân",
    instructor: "TS. Nguyễn Thị A",
    level: "Cơ bản",
    duration: "4 tuần",
    rating: 4.8,
    students: 1245,
    image: "https://placeholder.svg?height=200&width=300",
    price: "Miễn phí",
  },
  {
    id: "2",
    title: "Quản lý xung đột trong mối quan hệ",
    instructor: "ThS. Trần Văn B",
    level: "Trung cấp",
    duration: "6 tuần",
    rating: 4.7,
    students: 987,
    image: "https://placeholder.svg?height=200&width=300",
    price: "299.000đ",
  },
  {
    id: "3",
    title: "Xây dựng sự tin tưởng và thân mật",
    instructor: "TS. Lê Thị C",
    level: "Nâng cao",
    duration: "5 tuần",
    rating: 4.9,
    students: 1532,
    image: "https://placeholder.svg?height=200&width=300",
    price: "399.000đ",
  },
  {
    id: "4",
    title: "Nuôi dạy con cái trong hôn nhân",
    instructor: "ThS. Phạm Văn D",
    level: "Cơ bản",
    duration: "8 tuần",
    rating: 4.6,
    students: 2156,
    image: "https://placeholder.svg?height=200&width=300",
    price: "499.000đ",
  },
  {
    id: "5",
    title: "Quản lý tài chính gia đình",
    instructor: "TS. Hoàng Thị E",
    level: "Trung cấp",
    duration: "4 tuần",
    rating: 4.5,
    students: 876,
    image: "https://placeholder.svg?height=200&width=300",
    price: "299.000đ",
  },
]

const CourseListScreen = () => {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState("")

  const handleCoursePress = (course: any) => {
    navigation.navigate("CourseDetail", {
      id: course.id,
      title: course.title,
      course: course,
    })
  }

  const renderCourseItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleCoursePress(item)}
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
    >
      <Image source={{ uri: item.image }} className="w-full h-40" />
      <View className="p-4">
        <Text className="text-secondary-dark font-bold text-base mb-1">{item.title}</Text>
        <Text className="text-secondary mb-2">{item.instructor}</Text>

        <View className="flex-row items-center mb-2">
          <View className="flex-row items-center">
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text className="text-secondary-dark ml-1 mr-2">{item.rating}</Text>
          </View>
          <Text className="text-secondary text-xs">({item.students} học viên)</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            <Text className="text-secondary mr-3">{item.level}</Text>
            <Text className="text-secondary">{item.duration}</Text>
          </View>
          <Text className="text-primary font-bold">{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row mb-4">
        <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 mr-2 border border-gray-200">
          <Search size={18} color="#6C757D" />
          <TextInput
            className="flex-1 p-2"
            placeholder="Tìm kiếm khóa học"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity className="bg-white p-3 rounded-lg border border-gray-200">
          <Filter size={18} color="#6C757D" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("CourseRecommendation")}
        className="bg-primary/10 rounded-lg p-4 mb-6"
      >
        <Text className="text-primary font-bold text-lg mb-2">Khóa học đề xuất cho bạn</Text>
        <Text className="text-secondary-dark mb-2">Dựa trên kết quả khảo sát và sở thích của bạn</Text>
        <View className="flex-row items-center">
          <Text className="text-primary font-medium">Xem ngay</Text>
          <ArrowRight size={16} color="#E83E8C" className="ml-1" />
        </View>
      </TouchableOpacity>

      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default CourseListScreen
