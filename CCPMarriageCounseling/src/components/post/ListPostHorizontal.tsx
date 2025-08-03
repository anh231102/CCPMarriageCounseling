import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native"
import { ArrowRight } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import postApi from "@/src/config/api/post.api"
import type { PostItem } from "@/src/config/types/post.type"

const ListPostHorizontal: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation<any>()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postApi.getAllPosts()
        setPosts(data)
      } catch (err: any) {
        setError("Không thể tải bài viết")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="small" color="#E83E8C" />
        <Text className="text-gray-600 mt-2">Đang tải bài viết...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="py-8 items-center">
        <Text className="text-red-600">{error}</Text>
      </View>
    )
  }

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-4 px-4">
        <Text className="text-lg font-bold text-secondary-dark">Bài viết hữu ích</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.navigate("ListAllPostScreen")}
        >
          <Text className="text-primary mr-1">Xem tất cả</Text>
          <ArrowRight size={16} color="#E83E8C" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item: post }) => (
          <TouchableOpacity
            key={post.id}
            className="bg-white rounded-2xl shadow-sm mr-4 overflow-hidden"
            style={{ width: 260 }}
            onPress={() => navigation.navigate("PostDetailScreen", { postId: post.id })}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }}
              className="w-full h-32"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-gray-900 font-bold text-base mb-2" numberOfLines={2}>
                {post.title}
              </Text>
              <Text className="text-pink-600 font-semibold">Đọc thêm</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text className="text-gray-500 px-4">Không có bài viết nào</Text>}
      />
    </View>
  )
}

export default ListPostHorizontal