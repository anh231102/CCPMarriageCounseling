"use client"

import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Star, Calendar, Phone, ArrowRight, User, Award } from "lucide-react-native"
import type { Counselor } from "@/src/config/types/counselor.type"
import CounselorFeedbackList from "@/src/components/counselor/CounselorFeedbackList"
import CounselorListMini from "@/src/components/counselor/CounselorListMini"
import Loading from "@/src/components/share/Loading"
import { useEffect, useRef, useState } from "react"
import counselorApi from "@/src/config/api/counselor.api"

const CounselorDetailScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { counselor }: { counselor: Counselor } = route.params
  const [loading, setLoading] = useState(true)
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const scrollRef = useRef<ScrollView>(null)

  const formatRating = (rating?: number) => {
    if (!rating) return "0.0"
    return (Math.round(rating * 10) / 10).toFixed(1)
  }

  const getSpecialtiesText = () => {
    if (!Array.isArray(counselor.subCategories) || counselor.subCategories.length === 0) {
      return "Chưa rõ chuyên môn"
    }
    return counselor.subCategories.map((s) => s.name).join(", ")
  }

  const getUniqueSubcategories = () => {
    if (!Array.isArray(counselor.subCategories)) return []
    return Array.from(new Map(counselor.subCategories.map((s) => [s.id, s])).values())
  }

  const handleBookAppointment = () => {
    navigation.navigate("BookAppointment", {
      id: counselor.id,
      name: counselor.fullname,
      counselor,
    })
  }

  const fetchCounselors = async () => {
    try {
      setLoading(true)
      const data: Counselor[] = await counselorApi.getCounselorWithSub()
      setCounselors(data)
    } catch (err) {
      console.error("Error fetching counselors:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounselors()
    scrollRef.current?.scrollTo({ y: 0, animated: false })
  }, [counselor])

  return (
    <ScrollView className="flex-1 bg-gray-50" ref={scrollRef} showsVerticalScrollIndicator={false}>
      <View className="bg-white pt-8 pb-6">
        <View className="items-center px-6">
          <View className="relative mb-4">
            <Image
              source={{ uri: counselor.avatar ?? undefined }}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            />
            <View className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
              <Award size={16} color="white" />
            </View>
          </View>

          <Text className="text-gray-900 text-2xl font-bold text-center mb-2">{counselor.fullname}</Text>
          <Text className="text-primary font-bold">{`${counselor.price.toLocaleString("vi-VN")}đ/Suất tư vấn`}</Text>
          <View className="flex-row space-x-3 mt-3">
            <View className="flex-row items-center bg-amber-50 px-3 py-1 rounded-full">
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text className="text-amber-700 ml-1 font-semibold">{formatRating(counselor.rating)}</Text>
            </View>

            <View className="flex-row items-center  bg-gray-100 px-3 py-1 rounded-full">
              <User size={14} color="#6B7280" />
              <Text className="text-gray-600 ml-1 text-sm">{counselor.yearOfJob} năm kinh nghiệm</Text>
            </View>
          </View>

        </View>
      </View>

      <View className="px-4 -mt-3 mb-6">
        <TouchableOpacity
          className="bg-primary rounded-2xl p-4 shadow-lg active:scale-95"
          onPress={handleBookAppointment}
          style={{ elevation: 4 }}
        >
          <View className="flex-row items-center justify-center">
            <Calendar size={22} color="white" />
            <Text className="text-white text-lg font-bold ml-2">Đặt lịch tư vấn</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="bg-white mx-4 rounded-2xl shadow-sm mb-4" style={{ elevation: 2 }}>
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
              <User size={18} color="#E83E8C" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Giới thiệu</Text>
          </View>

          <Text className="text-gray-700 leading-6 mb-3">
            {counselor.fullname} là chuyên gia tư vấn hôn nhân với {counselor.yearOfJob} năm kinh nghiệm trong lĩnh vực{" "}
            {getSpecialtiesText()}.
          </Text>

          <Text className="text-gray-600 leading-6">
            Với kiến thức chuyên sâu và phương pháp tiếp cận tận tâm, chuyên gia đã giúp đỡ hàng trăm cặp đôi cải thiện
            mối quan hệ và xây dựng hôn nhân hạnh phúc.
          </Text>

          {counselor.description && (
            <View className="mt-4 p-4 bg-gray-50 rounded-xl">
              <Text className="text-gray-700  leading-6">{counselor.description}</Text>
            </View>
          )}
        </View>
      </View>

      <View className="bg-white mx-4 rounded-2xl shadow-sm mb-4" style={{ elevation: 2 }}>
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Award size={18} color="#E83E8C" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Chuyên môn</Text>
          </View>

          <View className="flex-row flex-wrap">
            {getUniqueSubcategories().map((sub) => (
              <View
                key={`SubCategory_${sub.id}`}
                className="bg-primary/10 rounded-full px-4 py-2 mr-2 mb-2 border border-primary/20"
              >
                <Text className="text-primary font-medium">{sub.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="bg-white mx-4 rounded-2xl shadow-sm mb-4" style={{ elevation: 2 }}>
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Phone size={18} color="#E83E8C" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Thông tin liên hệ</Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
                <Phone size={20} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">Điện thoại</Text>
                <Text className="text-gray-600 mt-1">{counselor.phone || "Chưa có thông tin"}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="bg-white mx-4 rounded-2xl shadow-sm mb-4" style={{ elevation: 2 }}>
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Star size={18} color="#E83E8C" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Đánh giá</Text>
          </View>

          <CounselorFeedbackList counselorId={counselor.id} />
        </View>
      </View>

      <View className="bg-white mx-4 rounded-2xl shadow-sm mb-6" style={{ elevation: 2 }}>
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
                <User size={18} color="#E83E8C" />
              </View>
              <Text className="text-xl font-bold text-gray-900">Chuyên gia nổi bật</Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CounselorsTab", {
                  screen: "CounselorList",
                })
              }
              className="flex-row items-center bg-primary/10 px-3 py-2 rounded-full active:scale-95"
            >
              <Text className="text-primary font-medium mr-1">Xem tất cả</Text>
              <ArrowRight size={16} color="#E83E8C" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="py-8">
              <Loading size={30} />
            </View>
          ) : (
            <CounselorListMini data={counselors.filter((c) => c.id !== counselor.id)} />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default CounselorDetailScreen
