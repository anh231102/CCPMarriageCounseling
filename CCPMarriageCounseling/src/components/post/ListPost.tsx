"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Image, ActivityIndicator, TextInput } from "react-native"
import { ArrowRight, Search, Calendar, ChevronLeft, ChevronRight, FileText } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import postApi from "@/src/config/api/post.api"
import type { PostItem } from "@/src/config/types/post.type"
import Loading from "../share/Loading"
import ListPostHorizontal from "./ListPostHorizontal"

interface ListPostProps {
  allscreen?: boolean
}

const PAGE_SIZE = 5

const ListPost: React.FC<ListPostProps> = ({ allscreen }) => {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [filteredPosts, setFilteredPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
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

  // Filter & sort & search mỗi khi thay đổi
  useEffect(() => {
    let result = [...posts]
    // Search từng ký tự
    if (search.trim()) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description.toLowerCase().includes(search.toLowerCase()),
      )
    }
    // Sort theo thời gian
    result.sort((a, b) => {
      const timeA = new Date(a.createAt).getTime()
      const timeB = new Date(b.createAt).getTime()
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA
    })
    setFilteredPosts(result)
    setPage(1) // Reset về trang đầu khi search/filter
  }, [search, sortOrder, posts])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    // So sánh ngày/tháng/năm
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return "Hôm nay"
    }
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Hôm qua"
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const textLength = content.replace(/<[^>]*>/g, "").length
    const words = textLength / 5
    const readingTime = Math.ceil(words / wordsPerMinute)
    return readingTime < 1 ? 1 : readingTime
  }

  // Paging
  const pagedPosts = allscreen
    ? filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filteredPosts.slice(0, 3)

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE)

  if (loading) {
    return (
      <View className="mt-6 mb-8">
        <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
          <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mb-4">
            <Loading size={30} color="#E83E8C" />
          </View>
          <Text className="text-gray-600 font-medium">Đang tải bài viết...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View className="mt-6 mb-8">
        <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
          <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-4">
            <FileText size={24} color="#EF4444" />
          </View>
          <Text className="text-red-600 font-medium">{error}</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="mt-6 mb-8">
      {/* Header Section */}
      {!allscreen && (
        <View className="flex-row justify-between items-center mb-6 px-4">
          <View className="flex-row items-center">

            <Text className="text-xl font-bold text-gray-600">Bài viết hữu ích</Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center px-3 py-2 rounded-xl"
            onPress={() => navigation.navigate("ListAllPostScreen")}
            activeOpacity={0.7}
          >
            <Text className="text-pink-600  mr-1">Xem tất cả</Text>
            <ArrowRight size={16} color="#E83E8C" />
          </TouchableOpacity>
        </View>
      )}

      {/* Search and Filter Section */}
      {allscreen && (
        <View className="mb-6 px-4">
          {/* Search Bar */}
          <View className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
            <View className="flex-row items-center p-4">
              <View className="bg-gray-50 p-2 rounded-xl mr-3">
                <Search size={20} color="#6B7280" />
              </View>
              <TextInput
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChangeText={setSearch}
                className="flex-1 text-gray-800 text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Sort Options */}
          <View className="bg-white rounded-2xl shadow-sm p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-blue-50 p-2 rounded-xl mr-3">
                  <Calendar size={18} color="#3B82F6" />
                </View>
                <Text className="text-gray-700 font-medium">Sắp xếp theo thời gian</Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setSortOrder("desc")}
                  className={`px-4 py-2 rounded-xl mr-2 ${sortOrder === "desc" ? "bg-pink-500" : "bg-gray-100"}`}
                  activeOpacity={0.7}
                >
                  <Text className={`font-medium ${sortOrder === "desc" ? "text-white" : "text-gray-600"}`}>
                    Mới nhất
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSortOrder("asc")}
                  className={`px-4 py-2 rounded-xl ${sortOrder === "asc" ? "bg-pink-500" : "bg-gray-100"}`}
                  activeOpacity={0.7}
                >
                  <Text className={`font-medium ${sortOrder === "asc" ? "text-white" : "text-gray-600"}`}>Cũ nhất</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Posts List */}
      <View className="px-4">
        {pagedPosts.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
              <FileText size={32} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 font-medium text-lg mb-2">Không có bài viết nào</Text>
            <Text className="text-gray-400 text-center">
              {search ? "Thử tìm kiếm với từ khóa khác" : "Chưa có bài viết nào được đăng"}
            </Text>
          </View>
        ) : (
          pagedPosts.map((post, index) => (
            <TouchableOpacity
              key={post.id}
              className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
              onPress={() => navigation.navigate("PostDetailScreen", { postId: post.id })}
              activeOpacity={0.8}
            >
              {/* Post Image */}
              <View className="relative">
                <Image
                  source={
                    typeof post.image === 'string'
                      ? { uri: post.image }
                      : require("../../../assets/images/postImage1.jpg")
                  }
                  className="w-full h-48"
                  resizeMode="cover"
                />

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)"]}
                  className="absolute bottom-0 left-0 right-0 h-16"
                />
                {/* Date Badge */}
                <View className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1">
                  <Text className="text-gray-700 text-xs font-medium">{formatDate(post.createAt)}</Text>
                </View>
              </View>

              {/* Post Content */}
              <View className="p-5">
                <Text className="text-gray-900 font-bold text-lg mb-3 leading-6" numberOfLines={2}>
                  {post.title}
                </Text>

                {/* Meta Information */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-blue-50 rounded-full px-3 py-1 mr-3">
                      <Text className="text-blue-600 text-xs font-medium">
                        {getReadingTime(post.description)} phút đọc
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-pink-600 font-semibold mr-2">Đọc thêm</Text>
                    <ArrowRight size={16} color="#E83E8C" />
                  </View>
                </View>
              </View>

              {/* Bottom Accent */}
              <LinearGradient
                colors={["#E83E8C", "#FF6B9D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-1"
              />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Pagination */}
      {allscreen && filteredPosts.length > PAGE_SIZE && (
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm p-4">
            <View className="flex-row justify-center items-center">
              <TouchableOpacity
                disabled={page === 1}
                onPress={() => setPage(page - 1)}
                className={`p-3 rounded-xl mr-4 ${page === 1 ? "bg-gray-100" : "bg-primary"}`}
                activeOpacity={0.7}
              >
                <ChevronLeft size={20} color={page === 1 ? "#9CA3AF" : "#fff"} />
              </TouchableOpacity>

              <View className="bg-gray-50 rounded-xl px-4 py-2">
                <Text className="text-gray-700 font-semibold">
                  {page} / {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                disabled={page === totalPages}
                onPress={() => setPage(page + 1)}
                className={`p-3 rounded-xl ml-4 ${page === totalPages ? "bg-gray-100" : "bg-primary"}`}
                activeOpacity={0.7}
              >
                <ChevronRight size={20} color={page === totalPages ? "#9CA3AF" : "#fff"} />
              </TouchableOpacity>
            </View>

            <Text className="text-center text-gray-500 text-sm mt-3">
              Hiển thị {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredPosts.length)} trong{" "}
              {filteredPosts.length} bài viết
            </Text>
          </View>
        </View>
      )}

    </View>
  )
}

export default ListPost
