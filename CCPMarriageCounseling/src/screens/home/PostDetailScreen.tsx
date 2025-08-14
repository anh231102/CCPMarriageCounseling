"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, ScrollView, SafeAreaView } from "react-native"
import { useRoute } from "@react-navigation/native"
import { Calendar, Clock, FileText } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import postApi from "@/src/config/api/post.api"
import type { PostItem } from "@/src/config/types/post.type"
import HTMLViewer from "@/src/components/share/HTMLViewer"
import ListPostHorizontal from "@/src/components/post/ListPostHorizontal"
import Loading from "@/src/components/share/Loading"

type RouteParams = {
  postId: string
}

const PostDetailScreen = () => {
  const route = useRoute()
  // @ts-ignore
  const { postId } = route.params as RouteParams
  const [post, setPost] = useState<PostItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postApi.getPostById(postId)
        setPost(data)
      } catch (err: any) {
        setError("Không thể tải chi tiết bài viết")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    // Kiểm tra có phải hôm nay không
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return "Hôm nay"
    }
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Hôm qua"
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`
    } else {
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const textLength = content.replace(/<[^>]*>/g, "").length
    const words = textLength / 5 // Estimate words from characters
    const readingTime = Math.ceil(words / wordsPerMinute)
    return readingTime < 1 ? 1 : readingTime
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-8 rounded-3xl shadow-sm items-center">
            <View className="w-16 h-16 bg-pink-50 rounded-full items-center justify-center mb-4">
              <Loading size={60} color="#E83E8C" />
            </View>
            <Text className="text-gray-600 font-medium">Đang tải bài viết...</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !post) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-white p-8 rounded-3xl shadow-sm items-center max-w-sm">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <FileText size={32} color="#EF4444" />
            </View>
            <Text className="text-red-600 text-center font-medium text-lg mb-2">
              {error || "Không tìm thấy bài viết"}
            </Text>
            <Text className="text-gray-500 text-center text-sm">Vui lòng thử lại sau</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={["#FFFFFF", "#FAFAFA"]}
          style={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 16,
          }}
        >

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 leading-tight mb-4">{post.title}</Text>

          {/* Meta Information */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-pink-50 p-2 rounded-xl mr-3">
                <Calendar size={16} color="#E83E8C" />
              </View>
              <View>
                <Text className="text-gray-600 text-sm font-medium">{formatDate(post.createAt)}</Text>
                <Text className="text-gray-400 text-xs">{new Date(post.createAt).toLocaleDateString("vi-VN")}</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-blue-50 p-2 rounded-xl mr-2">
                <Clock size={16} color="#3B82F6" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">{getReadingTime(post.description)} phút đọc</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View className="bg-white mx-2 rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Content Header */}


          {/* Article Content */}
          <View className="px-6 py-6">
            <HTMLViewer htmlContent={post.description} />
          </View>
        </View>
        <View className="px-4 ">
          <View className="bg-white rounded-2xl shadow-sm p-4">
            <View className="flex-row justify-center items-center">
            </View>

            <ListPostHorizontal />
          </View>
        </View>
        {/* Footer Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default PostDetailScreen
