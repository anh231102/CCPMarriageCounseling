"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Star, MessageSquare, Send, Heart } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import courseApi from "@/src/config/api/course.api"
import Loading from "../share/Loading"

interface CourseRatingFormProps {
  courseId: string
  onSuccess?: () => void
  Progress?: number
}

export const CourseRatingForm: React.FC<CourseRatingFormProps> = ({ courseId, onSuccess, Progress }) => {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const isLocked = typeof Progress === "number" && Progress < 0.8


  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn số sao đánh giá", [{ text: "OK", style: "default" }])
      return
    }

    setLoading(true)
    try {
      await courseApi.postCourseRating(courseId, rating, feedback)
      Alert.alert(
        "Thành công! 🎉",
        "Cảm ơn bạn đã đánh giá khóa học. Đánh giá của bạn sẽ giúp cải thiện chất lượng khóa học.",
        [{ text: "Tuyệt vời!", style: "default" }],
      )
      setRating(0)
      setFeedback("")
      if (onSuccess) onSuccess()
    } catch (err: any) {
      Alert.alert("Có lỗi xảy ra", err.message || "Không thể gửi đánh giá. Vui lòng thử lại.", [
        { text: "Thử lại", style: "default" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1:
        return "Rất không hài lòng"
      case 2:
        return "Không hài lòng"
      case 3:
        return "Bình thường"
      case 4:
        return "Hài lòng"
      case 5:
        return "Rất hài lòng"
      default:
        return "Chọn số sao để đánh giá"
    }
  }

  const currentRating = hoveredStar || rating

  return (
    <View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }} className=" ">

      {/* Header Section */}
      <LinearGradient
        colors={["#E83E8C", "#FF6B9D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderTopLeftRadius: 24, // rounded-t-3xl
          borderTopRightRadius: 24,
          padding: 24 // p-6
        }}
      >
        <View className="flex-row items-center">
          <View className="bg-white/20 p-3 rounded-2xl mr-4">
            <Heart size={24} color="#fff" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">Đánh giá của bạn</Text>
            <Text className="text-white/80 text-sm mt-1">Chia sẻ trải nghiệm của bạn</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content Section */}
      <View className="bg-white rounded-b-3xl shadow-lg overflow-hidden">
        <View className="p-6">
          {/* Rating Section */}
          <View className="items-center mb-8">
            <Text className="text-lg font-bold text-gray-800 mb-2">Bạn cảm thấy khóa học này như thế nào?</Text>
            <Text className="text-gray-500 text-sm mb-6 text-center">Đánh giá của bạn sẽ giúp những học viên khác</Text>

            {/* Stars */}
            <View className="flex-row items-center justify-center mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setRating(i)}
                  onPressIn={() => setHoveredStar(i)}
                  onPressOut={() => setHoveredStar(0)}
                  activeOpacity={0.7}
                  className="p-2"
                  disabled={isLocked}
                >
                  <Star
                    size={36}
                    color={i <= currentRating ? "#FFC107" : "#E5E7EB"}
                    fill={i <= currentRating ? "#FFC107" : "#E5E7EB"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Rating Text */}
            <View className="bg-gray-50 rounded-2xl px-4 py-3 min-w-48 items-center">
              <Text className={`font-semibold ${rating > 0 ? "text-gray-800" : "text-gray-500"}`}>
                {getRatingText(currentRating)}
              </Text>
              {rating > 0 && (
                <Text className="text-yellow-600 text-sm mt-1">
                  {rating} {rating === 1 ? "sao" : "sao"}
                </Text>
              )}
            </View>
          </View>

          {/* Feedback Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <MessageSquare size={20} color="#6B7280" />
              <Text className="text-lg font-bold text-gray-800 ml-2">Nhận xét chi tiết</Text>
              <Text className="text-gray-400 text-sm ml-2">(Không bắt buộc)</Text>
            </View>

            <View className="bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-pink-300">
              <TextInput
                className="p-4 text-gray-800 text-base min-h-24"
                placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
                placeholderTextColor="#9CA3AF"
                value={feedback}
                onChangeText={setFeedback}
                multiline
                textAlignVertical="top"
                maxLength={500}
                editable={!isLocked}
              />
              <View className="flex-row justify-between items-center px-4 pb-3">
                <Text className="text-gray-400 text-xs">Tối đa 500 ký tự</Text>
                <Text className="text-gray-400 text-xs">{feedback.length}/500</Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || rating === 0 || isLocked}
            activeOpacity={0.8}
            className={`rounded-2xl overflow-hidden ${rating === 0 || isLocked ? "opacity-50" : ""}`}
          >
            <LinearGradient
              colors={rating > 0 && !isLocked ? ["#E83E8C", "#FF6B9D"] : ["#9CA3AF", "#6B7280"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 24, // nếu bạn muốn border-radius tương đương rounded-t-3xl
              }}
            >
              {loading ? (
                <>
                  <Loading size={30} color="#fff"  />
                  <Text className="text-white font-bold text-lg ml-3">Đang gửi...</Text>
                </>
              ) : (
                <>
                  <Send size={20} color="#fff" />
                  <Text className="text-white font-bold text-lg ml-3">Gửi đánh giá</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Helper Text */}
          <View className="mt-4 bg-blue-50 rounded-2xl p-4">
            <Text className="text-blue-700 text-sm text-center leading-5">
              💡 <Text className="font-semibold">Mẹo:</Text> Đánh giá chi tiết sẽ giúp những học viên khác hiểu rõ hơn
              về khóa học và giúp giảng viên cải thiện chất lượng bài giảng.
            </Text>
          </View>
        </View>
        {isLocked && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(128,128,128,0.7)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
            pointerEvents="auto"
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center", padding: 16 }}>
              Bạn cần hoàn thành hơn 80% tiến độ khóa học để có thể đánh giá
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}