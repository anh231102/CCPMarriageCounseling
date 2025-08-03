"use client"

import React, { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { View, Text, ActivityIndicator, ScrollView } from "react-native"
import { Star, MessageCircle } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import courseApi from "@/src/config/api/course.api"
import type { CourseReview } from "@/src/config/types/course.type"
import { CourseRatingForm } from "./CourseRatingForm"

interface CourseReviewsProps {
  CourseId: string
  openReviewForm?: boolean
}

// Helper: Lấy màu avatar dựa trên tên
const getAvatarColor = (name: string): [string, string] => {
  const colors: [string, string][] = [
    ["#E83E8C", "#FF6B9D"],
    ["#6366F1", "#8B5CF6"],
    ["#10B981", "#34D399"],
    ["#F59E0B", "#FBBF24"],
    ["#EF4444", "#F87171"],
    ["#8B5CF6", "#A78BFA"],
  ]
  const index = name.length % colors.length
  return colors[index]
}

// Helper: Lấy chữ cái đầu của tên
const getInitials = (name: string) => {
  if (!name) return ""
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || ""
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Helper: Render sao đánh giá
const renderStars = (rating: number) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        color={i <= rating ? "#FFC107" : "#E0E0E0"}
        fill={i <= rating ? "#FFC107" : "#E0E0E0"}
        style={{ marginRight: 2 }}
      />
    )
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>
}

// Helper: Trung bình rating
const getAverageRating = (reviews: CourseReview[]) => {
  if (!reviews.length) return "0.0"
  const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
  return avg.toFixed(1)
}

// Helper: Phân phối rating
const getRatingDistribution = (reviews: CourseReview[]) => {
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    if (r.rating && dist[r.rating]) dist[r.rating]++
    else if (r.rating) dist[r.rating] = 1
  })
  return dist
}

export const CourseReviews: React.FC<CourseReviewsProps> = ({ CourseId, openReviewForm }) => {
  const navigation = useNavigation()
  const [reviews, setReviews] = useState<CourseReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

   const fetchReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await courseApi.getCourseReviews(CourseId)
      setReviews(data)
    } catch (err: any) {
      setError(err.message || "Không thể tải đánh giá.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [CourseId])

  // Nếu openReviewForm = false, dùng style phủ đủ trang (flex: 1, không margin/padding ngoài)
  const containerStyle =
    openReviewForm === false
      ? { flex: 1, borderRadius: 0, margin: 0, padding: 0, backgroundColor: "#fff" }
      : { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" as "hidden" }

  const innerContainerClass = openReviewForm === false ? "" : "mx-4 mb-6"

  if (loading) {
    return (
      <View style={openReviewForm === false ? { flex: 1, justifyContent: "center", backgroundColor: "#fff" } : {}} className={innerContainerClass}>
        <LinearGradient
          colors={["#E83E8C", "#FF6B9D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-t-3xl p-6"
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 p-3 rounded-2xl mr-4 overflow-hidden">
              <MessageCircle size={24} color="#fff" />
            </View>
            <Text className="text-white text-2xl font-bold">Đánh giá khóa học</Text>
          </View>
        </LinearGradient>
        <View className="bg-white rounded-b-3xl shadow-lg p-8 items-center">
          <ActivityIndicator size="large" color="#E83E8C" />
          <Text className="text-gray-500 mt-4 font-medium">Đang tải đánh giá...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={containerStyle}>
      <View className={innerContainerClass}>
        {/* Header Section */}
        <LinearGradient
          colors={["#E83E8C", "#FF6B9D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-t-3xl p-6 overflow-hidden"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-white/20 p-3 rounded-2xl mr-4">
                <MessageCircle size={24} color="#fff" />
              </View>
              <View>
                <Text className="text-white text-2xl font-bold">Đánh giá khóa học</Text>
                <Text className="text-white/80 text-sm mt-1">{reviews.length} đánh giá</Text>
              </View>
            </View>
            {reviews.length > 0 && (
              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <Star size={20} color="#FFC107" fill="#FFC107" />
                  <Text className="text-white text-xl font-bold ml-1">{getAverageRating(reviews)}</Text>
                </View>
                <Text className="text-white/80 text-xs">Trung bình</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View className="bg-white rounded-b-3xl shadow-lg overflow-hidden" style={openReviewForm === false ? { borderRadius: 0, shadowColor: "transparent" } : {}}>
          {reviews.length === 0 ? (
            <View className="p-8 items-center">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <MessageCircle size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-center font-medium text-lg mb-2">Chưa có đánh giá nào</Text>
              <Text className="text-gray-400 text-center text-sm">Hãy là người đầu tiên đánh giá khóa học này</Text>
            </View>
          ) : (
            <>
              {/* Rating Summary */}
              {reviews.length > 0 && (
                <View className="p-6 border-b border-gray-100">
                  <Text className="text-lg font-bold text-gray-800 mb-4">Tổng quan đánh giá</Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      {Object.entries(getRatingDistribution(reviews))
                        .reverse()
                        .map(([rating, count]) => (
                          <View key={rating} className="flex-row items-center mb-2">
                            <Text className="text-sm text-gray-600 w-8">{rating}★</Text>
                            <View className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                              <View
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${reviews.length > 0 ? ((typeof count === "number" ? count : 0) / reviews.length) * 100 : 0}%` }}
                              />
                            </View>
                            <Text className="text-sm text-gray-500 w-8">{typeof count === "number" ? count : 0}</Text>
                          </View>
                        ))}
                    </View>
                  </View>
                </View>
              )}

              {/* Reviews List */}
              <View style={openReviewForm === false ? { flex: 1 } : {}}>
                
               
                  <View className="p-4">
                    {reviews.map((review, idx) => {
                      const avatarColors = getAvatarColor(review.memberName)
                      return (
                        <View key={idx} className="mb-4">
                          <View className="bg-gray-50 rounded-2xl p-5">
                            <View className="flex-row items-start ">
                              {/* Avatar */}
                              <LinearGradient
                                colors={avatarColors}
                                className="w-12 h-12 rounded-full items-center justify-center mr-4 overflow-hidden"
                              >
                                <Text className="text-white font-bold text-sm">{getInitials(review.memberName)}</Text>
                              </LinearGradient>
                              {/* Review Content */}
                              <View className="flex-1">
                                <View className="flex-row items-center justify-between mb-2">
                                  <Text className="font-bold text-gray-800 text-base">{review.memberName}</Text>
                                </View>
                                {/* Rating */}
                                <View className="flex-row items-center mb-3">
                                  {renderStars(review.rating)}
                                  <Text className="text-gray-500 text-sm ml-2">({review.rating}/5)</Text>
                                </View>
                                {/* Feedback */}
                                <Text className="text-gray-700 leading-6 text-base">{review.feedback}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                
              </View>
              {/* Show More Button */}
              {reviews.length > 2 && openReviewForm && (
                <View className="border-t border-gray-100 p-4">
                  <View className="bg-gray-50 rounded-2xl p-4 items-center">
                    <Text
                      className="text-pink-600 font-medium"
                      style={{ textDecorationLine: "underline" }}
                      onPress={() => (navigation as any).navigate("CourseReview", { courseId: CourseId })}
                    >
                      Xem tất cả {reviews.length} đánh giá
                    </Text>
                  </View>
                </View>
              )}
            </>
            
          )}
        </View>
      </View>
    </View>
  )
}