import React, { useState } from "react"
import { View, Text, TouchableOpacity, Alert, ColorValue } from "react-native"
import { Play, BookOpen, HelpCircle, ChevronLeft, ChevronRight, Lock, CheckCircle2, Eye } from "lucide-react-native"
import type { Chapter } from "../../config/types/course.type"
import { LinearGradient } from "expo-linear-gradient"

interface CourseContentListProps {
  chapters: Chapter[]
  isEnrolled: boolean
  onPressChapter: (chapter: Chapter) => void
}

const PAGE_SIZE = 5

export const CourseContentList: React.FC<CourseContentListProps> = ({ chapters, isEnrolled, onPressChapter }) => {
  const sortedChapters = [...chapters].sort((a, b) => a.chapNum - b.chapNum)
  const [page, setPage] = useState(1)

  // Nếu chưa ghi danh, chỉ cho xem thử 2 chương có status === 1
  const previewChapters = !isEnrolled
    ? sortedChapters.filter(ch => ch.status === 1).slice(0, 2)
    : []

  const getChapterIcon = (type: "Lecture" | "Quiz" | "Video") => {
    switch (type) {
      case "Lecture":
        return <BookOpen size={18} color="#fff" />
      case "Quiz":
        return <HelpCircle size={18} color="#fff" />
      case "Video":
        return <Play size={18} color="#fff" />
      default:
        return <Play size={18} color="#fff" />
    }
  }
  const getChapterTypeColor = (type: "Lecture" | "Quiz" | "Video"): [ColorValue, ColorValue] => {
  switch (type) {
    case "Video":
        return ["#FF6B6B", "#FF8E8E"]
      case "Quiz":
        return ["#3399CC", "#3366CC"]
      case "Lecture":
        return ["#A8E6CF", "#7FCDCD"]
      default:
        return ["#A8E6CF", "#7FCDCD"]
  }
}

  const getStatusInfo = (chapter: Chapter) => {
    if (isEnrolled) {
      if (chapter.isDone) {
        return {
          text: "Hoàn thành",
          icon: <CheckCircle2 size={16} color="#22C55E" />,
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          borderColor: "border-green-200",
        }
      } else {
        return {
          text: "Vào học",
          icon: <Play size={16} color="#E83E8C" />,
          bgColor: "bg-pink-50",
          textColor: "text-pink-600",
          borderColor: "border-pink-200",
        }
      }
    } else {
      if (previewChapters.some((c) => c.id === chapter.id)) {
        return {
          text: "Xem thử",
          icon: <Eye size={16} color="#3B82F6" />,
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          borderColor: "border-blue-200",
        }
      } else {
        return {
          text: "Khóa",
          icon: <Lock size={16} color="#6B7280" />,
          bgColor: "bg-gray-50",
          textColor: "text-gray-500",
          borderColor: "border-gray-200",
        }
      }
    }
  }

  const totalPages = Math.ceil(sortedChapters.length / PAGE_SIZE)
  const startIdx = (page - 1) * PAGE_SIZE
  const endIdx = startIdx + PAGE_SIZE
  const chaptersToShow = sortedChapters.slice(startIdx, endIdx)

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4 mx-4">
      <Text className="text-lg font-bold text-secondary-dark mb-4">Nội dung khóa học</Text>
      
        {sortedChapters.length === 0 ? (
          <View className="p-8 items-center">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
              <BookOpen size={32} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 text-center font-medium">Chưa có nội dung bài học nào.</Text>
          </View>
        ) : (
          <>
            <View className="">
              {chaptersToShow.map((chapter, index) => {
                const canPress = isEnrolled || previewChapters.some((c) => c.id === chapter.id)
                const statusInfo = getStatusInfo(chapter)
                const colors = getChapterTypeColor(chapter.chapterType)

                const handlePress = () => {
                  if (canPress) {
                    onPressChapter(chapter)
                  } else {
                    Alert.alert("Khóa học bị khóa", "Vui lòng đăng ký khóa học để xem nội dung này.")
                  }
                }

                return (
                  <TouchableOpacity
                    key={chapter.id}
                    onPress={handlePress}
                    className={`mb-3 ${index === chaptersToShow.length - 1 ? "mb-0" : ""}`}
                    activeOpacity={0.7}
                  >
                    <View
                      className={`bg-gray-50 rounded-2xl p-4 border ${canPress ? "border-gray-100" : "border-gray-200"}`}
                    >
                      <View className="flex-row items-center">
                        {/* Chapter Icon */}
                        <LinearGradient
                          colors={canPress ? colors : ["#9CA3AF", "#6B7280"]}
                          className="w-12 h-12 rounded-xl items-center justify-center mr-4 overflow-hidden"
                        >
                          {getChapterIcon(chapter.chapterType)}
                        </LinearGradient>

                        {/* Chapter Info */}
                        <View className="flex-1 mr-3">
                          <Text
                            className={`font-semibold text-base mb-1 ${canPress ? "text-gray-800" : "text-gray-500"}`}
                            numberOfLines={2}
                          >
                            {chapter.chapNum}. {chapter.name}
                          </Text>

                          {chapter.description && (
                            <Text
                              className={`text-sm ${canPress ? "text-gray-600" : "text-gray-400"}`}
                              numberOfLines={2}
                            >
                              {chapter.description}
                            </Text>
                          )}

                          {/* Chapter Type Badge */}
                          <View className="flex-row items-center mt-2">
                            <View className={`px-2 py-1 rounded-full ${canPress ? "bg-white" : "bg-gray-200"}`}>
                              <Text className={`text-xs font-medium ${canPress ? "text-gray-700" : "text-gray-500"}`}>
                                {chapter.chapterType}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Status Badge */}
                        <View
                          className={`px-3 py-2 rounded-xl border ${statusInfo.bgColor} ${statusInfo.borderColor} flex-row items-center`}
                        >
                          {statusInfo.icon}
                          <Text className={`${statusInfo.textColor} text-xs font-semibold ml-1`}>
                            {statusInfo.text}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <View className="flex-row justify-center items-center mt-4">
            <TouchableOpacity
              disabled={page === 1}
              onPress={() => setPage(page - 1)}
              className={`p-2 rounded-full ${page === 1 ? "bg-gray-200" : "bg-primary"}`}
            >
              <ChevronLeft size={20} color={page === 1 ? "#9CA3AF" : "#fff"} />
            </TouchableOpacity>
            <Text className="mx-4 text-secondary-dark font-bold">
               {page} / {totalPages}
            </Text>
            <TouchableOpacity
              disabled={page === totalPages}
              onPress={() => setPage(page + 1)}
              className={`p-2 rounded-full ${page === totalPages ? "bg-gray-200" : "bg-primary"}`}
            >
              <ChevronRight size={20} color={page === totalPages ? "#9CA3AF" : "#fff"} />
            </TouchableOpacity>
          </View>
            )}
          </>
        )}
      </View>
    
  )
}