"use client"

import { FlatList, TouchableOpacity, View, Text, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Star } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { Counselor } from "@/src/config/types/counselor.type"

interface Props {
  data: Counselor[]
}

const CounselorListMini = ({ data }: Props) => {
  const navigation = useNavigation<any>()

  const formatRating = (rating: number | null | undefined) => {
    if (!rating) return "0.0"
    return (Math.round(rating * 10) / 10).toFixed(1)
  }

  const getSpecialties = (subCategories: any[]) => {
    if (subCategories.length === 0) return "Chưa có chuyên môn"
    if (subCategories.length > 2) {
      return (
        subCategories
          .slice(0, 2)
          .map((cat) => cat.name)
          .join(", ") + "..."
      )
    }
    return subCategories.map((cat) => cat.name).join(", ")
  }


  const sortedData = [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

  return (
    <FlatList
      data={sortedData}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 4 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CounselorsTab", {
              screen: "CounselorDetail",
              params: { counselor: item },
            })
          }
          className="mr-4 bg-white rounded-2xl shadow-sm overflow-hidden"
          style={{ width: 160 }}
          activeOpacity={0.8}
        >
          {/* Card Content */}
          <View className="p-4">
            {/* Avatar Section */}
            <View className="items-center mb-3">
              <View className="relative">
                <Image
                  source={{ uri: item.avatar || "https://via.placeholder.com/100" }}
                  className="w-16 h-16 rounded-full"
                  style={{ backgroundColor: "#F3F4F6" }}
                />
                {/* Online Status Indicator */}
                <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
              </View>
            </View>

            {/* Name */}
            <Text className="text-gray-800 font-bold text-center text-base mb-2" numberOfLines={1}>
              {item.fullname}
            </Text>

            {/* Specialties */}
            <View className="mb-3">
              <View className="bg-gray-50 rounded-xl px-3 py-2">
                <Text className="text-gray-600 text-xs text-center leading-4" numberOfLines={2}>
                  {getSpecialties(item.subCategories)}
                </Text>
              </View>
            </View>

            {/* Rating Section */}
            <View className="flex-row items-center justify-center">
              <View className="bg-yellow-50 rounded-full px-3 py-1 flex-row items-center">
                <Star size={14} color="#FFC107" fill="#FFC107" />
                <Text className="text-gray-800 font-semibold text-sm ml-1">{formatRating(item.rating)}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Accent */}
          <LinearGradient
            colors={["#E83E8C", "#FF6B9D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 4 }} // h-1 ~ 4px
          />
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
    />
  )
}

export default CounselorListMini
