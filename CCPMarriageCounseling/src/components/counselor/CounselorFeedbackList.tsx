"use client"

import { useEffect, useState, useMemo } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Star, MessageCircle } from "lucide-react-native"
import bookingApi from "@/src/config/api/booking.api"
import type { FeedbackForCounselor } from "@/src/config/types/booking.type"
import Loading from "../share/Loading"

type Props = {
  counselorId: string
}

const PAGE_SIZE = 5

const CounselorFeedbackList = ({ counselorId }: Props) => {
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackForCounselor[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackForCounselor[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true)
      try {
        const data = await bookingApi.getFeedbacksByCounselor(counselorId)
        setAllFeedbacks(data)
        setFeedbacks(data.slice(0, PAGE_SIZE))
        setPage(1)
        setHasMore(data.length > PAGE_SIZE)
      } catch (error) {
        setAllFeedbacks([])
        setFeedbacks([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedbacks()
  }, [counselorId])

  const loadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      const nextPage = page + 1
      const nextFeedbacks = allFeedbacks.slice(0, nextPage * PAGE_SIZE)
      setFeedbacks(nextFeedbacks)
      setPage(nextPage)
      setHasMore(nextFeedbacks.length < allFeedbacks.length)
      setLoadingMore(false)
    }, 300)
  }

  const totalPages = Math.ceil(allFeedbacks.length / PAGE_SIZE)

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    setFeedbacks(allFeedbacks.slice((newPage - 1) * PAGE_SIZE, newPage * PAGE_SIZE))
  }

  useEffect(() => {
    setFeedbacks(allFeedbacks.slice(0, PAGE_SIZE))
    setPage(1)
  }, [allFeedbacks])

  const stats = useMemo(() => {
    if (allFeedbacks.length === 0) return null
    const total = allFeedbacks.length
    const avg = Math.round((allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / total) * 10) / 10
    const starCounts = [0, 0, 0, 0, 0]
    allFeedbacks.forEach((f) => {
      if (f.rating >= 1 && f.rating <= 5) starCounts[f.rating - 1]++
    })
    return { total, avg, starCounts }
  }, [allFeedbacks])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return "Hôm qua"
    if (diffDays <= 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={16} color="#FFC107" fill={i < rating ? "#FFC107" : "transparent"} strokeWidth={1.5} />
    ))
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Loading size={32} />
        <Text className="text-gray-500 text-sm mt-3 font-medium">Đang tải đánh giá...</Text>
      </View>
    )
  }

  if (allFeedbacks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <View className="bg-gray-100 rounded-full p-4 mb-3">
          <MessageCircle size={24} color="#9CA3AF" />
        </View>
        <Text className="text-gray-500 text-base font-medium">Chưa có đánh giá</Text>
        <Text className="text-gray-400 text-sm mt-1">Hãy là người đầu tiên đánh giá chuyên gia này</Text>
      </View>
    )
  }

  return (
    <View>
      {stats && (
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl font-bold text-yellow-400">{stats.avg}</Text>
            <View className="flex-row ml-2">{renderStars(Math.round(stats.avg))}</View>
            <Text className="ml-2 text-gray-500">{`(${stats.total} đánh giá)`}</Text>
          </View>
          <View>
            {stats.starCounts.slice().reverse().map((count, i) => (
              <View key={i} className="flex-row items-center mb-1">
                <Text className="w-8 text-yellow-400">{5 - i}<Star size={16} color="#FFC107" fill="#FFC107" /></Text>
                <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2 overflow-hidden">
                  <View style={{ width: `${(count / stats.total) * 100}%` }} className="h-2 bg-yellow-400" />
                </View>
                <Text className="w-8 text-gray-600 text-right">{count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="space-y-3">
        {feedbacks.map((item, index) => (
          <View
            key={index}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-base">{item.memberFullName}</Text>
                <Text className="text-gray-500 text-xs mt-0.5">{formatDate(item.timeEnd)}</Text>
              </View>
            </View>
            <View className="flex-row items-center mb-3">
              <View className="flex-row mr-2">{renderStars(item.rating)}</View>
              <Text className="text-gray-600 text-sm font-medium">{item.rating}/5</Text>
            </View>
            <Text className="text-gray-700 leading-5 text-sm">{item.feedback}</Text>
          </View>
        ))}
      </View>

      {totalPages > 1 && (
        <View className="flex-row justify-center items-center my-4 space-x-4">
          <TouchableOpacity
            onPress={() => goToPage(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-xl ${page === 1 ? "bg-gray-200" : "bg-pink-100"}`}
          >
            <Text className={`font-bold ${page === 1 ? "text-gray-400" : "text-primary"}`}>Trang trước</Text>
          </TouchableOpacity>
          <Text className="mx-2 text-gray-700 font-medium">{`Trang ${page} / ${totalPages}`}</Text>
          <TouchableOpacity
            onPress={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-xl ${page === totalPages ? "bg-gray-200" : "bg-pink-100"}`}
          >
            <Text className={`font-bold ${page === totalPages ? "text-gray-400" : "text-primary"}`}>Trang sau</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default CounselorFeedbackList
