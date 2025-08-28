import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import memberApi from "@/src/config/api/member.api"
import coupleApi from "@/src/config/api/couple.api"
import Loading from "../share/Loading"

interface RecommendCategoryProps {
  coupleId?: string
}

const chunkArray = (arr: string[], size: number) => {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

const RecommendCategory: React.FC<RecommendCategoryProps> = ({ coupleId }) => {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // state cho scrollbar custom
  const [scrollX, setScrollX] = useState(0)
  const [contentWidth, setContentWidth] = useState(1)
  const [layoutWidth, setLayoutWidth] = useState(1)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        let data: string[]
        if (coupleId) {
          data = await coupleApi.getCoupleSubcategories(coupleId)
        } else {
          data = await memberApi.getMySubcategories()
        }
        setCategories(data)
      } catch (err: any) {
        setError(err.message || "Đã có lỗi xảy ra")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [coupleId])

  if (loading) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm items-center justify-center">
        <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mb-3">
          <Loading size={24} color="#E83E8C" />
        </View>
        <Text className="text-gray-600 font-medium">Đang tải chuyên mục...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <View className="items-center">
          <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-3">
            <AlertCircle size={24} color="#EF4444" />
          </View>
          <Text className="text-red-600 font-medium text-center">{error}</Text>
        </View>
      </View>
    )
  }

  if (categories.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <View className="items-center">
          <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center mb-3">
            <CheckCircle size={24} color="#10B981" />
          </View>
          <Text className="text-green-600 font-semibold text-lg mb-1">Tuyệt vời!</Text>
          <Text className="text-gray-500 text-center">Không có chuyên mục cần cải thiện</Text>
        </View>
      </View>
    )
  }

  const columns = chunkArray(categories, 3)

  // Tính % thanh scrollbar
  const scrollIndicatorSize = layoutWidth / contentWidth * layoutWidth
  const scrollIndicatorPosition = scrollX / contentWidth * layoutWidth

  return (
    <View className="bg-white rounded-2xl p-6 ">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <View className="bg-pink-50 p-2 rounded-xl mr-3">
          <TrendingUp size={20} color="#E83E8C" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 font-bold text-lg">Chuyên mục cần cải thiện</Text>
          <Text className="text-gray-500 text-sm">{categories.length} lĩnh vực được đề xuất</Text>
        </View>
      </View>

      {/* Categories Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} // tắt mặc định
        onContentSizeChange={(w) => setContentWidth(w)}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => setScrollX(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
        style={{ marginBottom: 12 }}
      >
        <View style={{ flexDirection: "row" }}>
          {columns.map((col, colIdx) => (
            <View key={colIdx} style={{ marginRight: 16 }}>
              {col.map((item) => (
                <View key={item} style={{ marginBottom: 12 }}>
                  <LinearGradient
                    colors={["#FDF2F8", "#FCE7F3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: "#FBCFE8",
                      minWidth: 140,
                      maxWidth: 200,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ width: 8, height: 8, backgroundColor: "#EC4899", borderRadius: 9999, marginRight: 8 }} />
                      <Text
                        style={{ color: "#BE185D", fontWeight: "500", fontSize: 14, flex: 1 }}
                        numberOfLines={2}
                      >
                        {item}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Custom Scrollbar màu hồng */}
      <View style={{ height: 4, backgroundColor: "#FCE7F3", borderRadius: 4, overflow: "hidden" }}>
        <View
          style={{
            height: 4,
            width: scrollIndicatorSize,
            backgroundColor: "#EC4899", // màu hồng
            borderRadius: 4,
            transform: [{ translateX: scrollIndicatorPosition }],
          }}
        />
      </View>

      {/* Footer Info */}
      <View className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-200">
        <Text className="text-blue-700 text-sm text-center leading-5">
          💡 <Text className="font-semibold">Gợi ý:</Text> Tập trung cải thiện những lĩnh vực này để nâng cao mối quan hệ
        </Text>
      </View>
    </View>
  )
}

export default RecommendCategory
