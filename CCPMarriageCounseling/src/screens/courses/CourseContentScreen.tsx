"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeft, List, Play, CheckCircle, Download, BookOpen } from "lucide-react-native"

const CourseContentScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { title, lessonId, lessonTitle, lessons } = route.params
  const [showLessons, setShowLessons] = useState(false)

  // Giả lập dữ liệu bài học hiện tại
  const currentLesson = {
    id: lessonId || "1",
    title: lessonTitle || "Giới thiệu về khóa học",
    videoUrl: "https://example.com/video.mp4",
    duration: "10 phút",
    completed: false,
    materials: [
      { id: "1", title: "Tài liệu hướng dẫn.pdf", size: "2.5 MB" },
      { id: "2", title: "Bài tập thực hành.docx", size: "1.2 MB" },
    ],
  }

  const screenWidth = Dimensions.get("window").width
  const videoHeight = (screenWidth * 9) / 16 // Tỷ lệ 16:9

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
          <ArrowLeft size={20} color="#6C757D" />
          <Text className="text-secondary ml-1">Quay lại</Text>
        </TouchableOpacity>
        <Text className="text-secondary-dark font-medium" numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => setShowLessons(!showLessons)}>
          <List size={20} color="#6C757D" />
        </TouchableOpacity>
      </View>

      {showLessons ? (
        <View className="flex-1 bg-white p-4">
          <Text className="text-lg font-bold text-secondary-dark mb-4">Nội dung khóa học</Text>

          {(lessons || []).map((lesson: any, index: number) => (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => {
                setShowLessons(false)
                navigation.setParams({
                  lessonId: lesson.id,
                  lessonTitle: lesson.title,
                })
              }}
              className={`flex-row items-center mb-3 p-2 rounded-lg ${
                lesson.id === currentLesson.id ? "bg-primary/10" : ""
              }`}
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  lesson.id === currentLesson.id ? "bg-primary/20" : "bg-gray-100"
                }`}
              >
                {lesson.completed ? (
                  <CheckCircle size={16} color="#28A745" />
                ) : (
                  <Play size={16} color={lesson.id === currentLesson.id ? "#E83E8C" : "#6C757D"} />
                )}
              </View>
              <View className="flex-1">
                <Text
                  className={`${lesson.id === currentLesson.id ? "text-primary font-medium" : "text-secondary-dark"}`}
                >
                  {index + 1}. {lesson.title}
                </Text>
                <Text className="text-secondary text-xs">{lesson.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <ScrollView className="flex-1">
          {/* Video Player Placeholder */}
          <View className="bg-white items-center justify-center" style={{ height: videoHeight }}>
            <Play size={48} color="white" />
          </View>

          <View className="p-4">
            <Text className="text-xl font-bold text-secondary-dark mb-2">{currentLesson.title}</Text>

            <View className="flex-row items-center mb-4">
              <View className="flex-row items-center mr-4">
                <Play size={16} color="#6C757D" />
                <Text className="text-secondary ml-1">{currentLesson.duration}</Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => {
                  // Đánh dấu bài học đã hoàn thành
                }}
              >
                <CheckCircle size={16} color={currentLesson.completed ? "#28A745" : "#6C757D"} />
                <Text className="text-secondary ml-1">
                  {currentLesson.completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold text-secondary-dark mb-2">Mô tả bài học</Text>
              <Text className="text-secondary">
                Bài học này giới thiệu tổng quan về khóa học, các mục tiêu và kết quả mong đợi. Bạn sẽ hiểu được tầm
                quan trọng của giao tiếp trong hôn nhân và các nguyên tắc cơ bản.
              </Text>
            </View>

            {currentLesson.materials.length > 0 && (
              <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <Text className="text-lg font-bold text-secondary-dark mb-3">Tài liệu học tập</Text>

                {currentLesson.materials.map((material) => (
                  <TouchableOpacity key={material.id} className="flex-row items-center mb-2 last:mb-0">
                    <View className="w-10 h-10 bg-gray-100 rounded items-center justify-center mr-3">
                      <BookOpen size={20} color="#6C757D" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-secondary-dark">{material.title}</Text>
                      <Text className="text-secondary text-xs">{material.size}</Text>
                    </View>
                    <Download size={20} color="#6C757D" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold text-secondary-dark mb-2">Ghi chú</Text>
              <Text className="text-secondary italic">
                Hãy ghi chú những điểm quan trọng trong bài học này để thảo luận với đối tác của bạn.
              </Text>
            </View>

            <View className="flex-row justify-between mb-6">
              <TouchableOpacity
                onPress={() => {
                  // Chuyển đến bài học trước
                }}
                className="bg-secondary/10 p-3 rounded-lg flex-row items-center"
                disabled={currentLesson.id === "1"}
              >
                <ArrowLeft size={18} color="#6C757D" />
                <Text className="text-secondary ml-2">Bài trước</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // Chuyển đến bài học tiếp theo
                }}
                className="bg-primary p-3 rounded-lg flex-row items-center"
              >
                <Text className="text-white mr-2">Bài tiếp theo</Text>
                <ArrowLeft size={18} color="white" style={{ transform: [{ rotate: "180deg" }] }} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default CourseContentScreen
