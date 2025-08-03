import { useState, useEffect, useCallback } from "react"
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, ColorValue, } from "react-native"
import {
  ArrowLeft, List, Play, CheckCircle, Circle, ChevronRight, BookOpen,
  HelpCircle,
  Award,
  Clock,
} from "lucide-react-native"
import { Video, ResizeMode } from "expo-av"
import courseApi from "@/src/config/api/course.api"
import type { ChapterDetail, Chapter, QuizQuestion, QuizAnswer, CourseDetail, } from "@/src/config/types/course.type";
import HTMLViewer from "@/src/components/share/HTMLViewer"
import { WebView } from 'react-native-webview';
import { LinearGradient } from "expo-linear-gradient"
import Loading from "@/src/components/share/Loading"

const CourseContentScreen = ({ route, navigation }: any) => {
  const { chapterId, isEnrolled = true, courseId } = route.params || {}
  const [chapterData, setChapterData] = useState<ChapterDetail | null>(null)
  const [lessons, setLessons] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLessons, setShowLessons] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<string | null>(null)
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null)


  const fetchChapterContent = useCallback(async () => {
    if (!chapterId || !courseId) {
      setError("Không tìm thấy ID chương học hoặc khóa học.")
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const chapter = await courseApi.getChapterDetail(chapterId)
      setChapterData(chapter)
      const course = await courseApi.getCourseDetailById(courseId)
      setCourseDetail(course)
      const sortedChapters = (course.chapters || []).sort((a, b) => a.chapNum - b.chapNum)
      setLessons(sortedChapters)
      setSelectedAnswers({})
      setQuizSubmitted(false)
      setQuizResult(null)
    } catch (err) {
      console.error("❌ Error fetching chapter detail:", err)
      setError("Không thể tải chi tiết chương học. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }, [chapterId, courseId])

  useEffect(() => {
    fetchChapterContent()
  }, [fetchChapterContent])

  const handleGoBack = () => {
    navigation.goBack()
  }
  const getChapterTypeColor = (type: string): [ColorValue, ColorValue] => {
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
  const getChapterIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Play size={18} color="#fff" />
      case "Quiz":
        return <HelpCircle size={18} color="#fff" />
      case "Lecture":
        return <BookOpen size={18} color="#fff" />
      default:
        return <BookOpen size={18} color="#fff" />
    }
  }

  const handleNavigateChapter = async (direction: "prev" | "next") => {
    if (!chapterData || lessons.length === 0) return
    const currentIndex = lessons.findIndex((chap: Chapter) => chap.id === chapterData.id)
    let nextChapter: Chapter | undefined
    if (direction === "next" && currentIndex < lessons.length - 1) {
      try {
        await courseApi.markChapterAsDone(chapterData.id)
        // Sau khi đánh dấu, cập nhật lại dữ liệu
        await fetchChapterContent()
      } catch (err) {
        console.error("Lỗi đánh dấu hoàn thành chương:", err)
        Alert.alert("Lỗi", "Không thể đánh dấu hoàn thành chương.")
      }
      nextChapter = lessons[currentIndex + 1]
    } else if (direction === "prev" && currentIndex > 0) {
      nextChapter = lessons[currentIndex - 1]
    }
    if (nextChapter) {
      navigation.navigate("CourseContent", {
        courseId,
        chapterId: nextChapter.id,
        isEnrolled,
      })
    }
  }

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }))
  }

  const handleSubmitQuiz = () => {
    if (!chapterData || chapterData.chapterType !== "Quiz" || !chapterData.quiz) return
    const allQuestionsAnswered = chapterData.quiz.questions.every((q) => selectedAnswers[q.id] !== undefined)
    if (!allQuestionsAnswered) {
      Alert.alert("Chưa hoàn thành", "Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài.")
      return
    }
    setQuizSubmitted(true)
    setQuizResult("Bài kiểm tra đã được nộp! Kết quả đang được xử lý.")
    Alert.alert("Thành công", "Bài kiểm tra đã được nộp!")
  }

  const currentChapterIndex = lessons.findIndex((chap: Chapter) => chap.id === chapterData?.id)
  const isFirstChapter = currentChapterIndex <= 0
  const isLastChapter = lessons.length === 0 || currentChapterIndex === lessons.length - 1


  const canSubmitQuiz =
    chapterData?.chapterType === "Quiz" &&
    chapterData.quiz &&
    chapterData.quiz.questions.every((q) => selectedAnswers[q.id] !== undefined) &&
    !quizSubmitted

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Loading size={60} />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-red-600 text-center">{error}</Text>
      </View>
    )
  }

  if (!chapterData) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-gray-600 text-center">Không tìm thấy nội dung chương học.</Text>
      </View>
    )
  }
  // Giả sử bạn đã có biến courseDetail từ API
  const chapterCount = courseDetail?.chapterCount ?? lessons.length
  const processingCount = courseDetail?.processingCount ?? lessons.filter((chap) => chap.isDone).length
  const canFinishCourse = isLastChapter && chapterCount > 0 && chapterCount - processingCount === 1

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      {isEnrolled && (
        <View className="bg-white p-4 border-b border-gray-200 flex-row justify-between items-center shadow-sm">
          <Text className="text-secondary-dark font-bold text-lg max-w-[60%]" numberOfLines={1}>
            Chi tiết chương
          </Text>
          <TouchableOpacity onPress={() => setShowLessons(!showLessons)}>
            <List size={20} color="#6C757D" />
          </TouchableOpacity>
        </View>
      )}

      {showLessons ? (
        <ScrollView className="flex-1 bg-white">
          <LinearGradient colors={["#F8FAFC", "#F1F5F9"]} className="p-6 ">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Nội dung khóa học</Text>
            {lessons.map((lesson: Chapter, index: number) => {
              const isActive = lesson.id === chapterData.id
              const colors = getChapterTypeColor(lesson.chapterType || "Lecture")

              return (
                <TouchableOpacity
                  key={lesson.id}
                  onPress={() => {
                    setShowLessons(false)
                    navigation.replace("CourseContent", {
                      chapterId: lesson.id,
                      courseId,
                      isEnrolled,
                    })
                  }}
                  className="mb-4"
                >
                  <View
                    className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${isActive ? "border-indigo-200 bg-indigo-50" : "border-transparent"
                      }`}
                  >
                    <View className="flex-row items-center">
                      <LinearGradient colors={colors} className="w-12 h-12 rounded-2xl items-center justify-center mr-4 overflow-hidden">
                        {getChapterIcon(lesson.chapterType || "Lecture")}
                      </LinearGradient>

                      <View className="flex-1">
                        <Text className={`font-semibold text-base ${isActive ? "text-indigo-700" : "text-gray-800"}`}>
                          {index + 1}. {lesson.name}
                        </Text>
                        <Text className="text-gray-500 text-sm mt-1 capitalize">{lesson.chapterType || "Lecture"}</Text>
                      </View>



                      <ChevronRight size={20} color={isActive ? "#6366F1" : "#9CA3AF"} />
                    </View>
                    {lesson.isDone && (
                      <View className="bg-green-100 px-3 py-1 mt-2 rounded-full flex-row items-center w-32">
                        <CheckCircle size={16} color="#22C55E" />
                        <Text className="text-green-600 text-xs ml-1 font-medium">Hoàn thành</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </LinearGradient>
        </ScrollView>
      ) : (
        <>
          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Chapter Header */}
            <LinearGradient
              colors={getChapterTypeColor(chapterData.chapterType || "Lecture")}
              className="mx-4 mt-4 rounded-3xl p-6 overflow-hidden"
            >
              <View className="flex-row items-center mb-4">
                <View className="bg-white/20 p-3 rounded-2xl mr-4">
                  {getChapterIcon(chapterData.chapterType || "Lecture")}
                </View>
                <View className="flex-1">
                  <Text className="text-white/80 text-sm font-medium uppercase tracking-wide">
                    {chapterData.chapterType || "Lecture"}
                  </Text>
                  <Text className="text-white text-xl font-bold mt-1" numberOfLines={2}>
                    {chapterData.name}
                  </Text>
                </View>
              </View>

              <View className="bg-white/10 rounded-2xl p-4">
                <Text className="text-white/90 text-sm leading-6">{chapterData.description || "Không có mô tả"}</Text>
              </View>
            </LinearGradient>

            {/* Content Section */}
            <View className="mx-4 mt-6">
              <View className="bg-white rounded-3xl shadow-lg overflow-hidden">
                {chapterData.chapterType === "Lecture" && chapterData.lecture ? (
                  <View className="p-6">
                    <View className="flex-row items-center mb-4">
                      <View className="bg-blue-100 p-2 rounded-xl mr-3">
                        <BookOpen size={20} color="#3B82F6" />
                      </View>
                      <Text className="text-xl font-bold text-gray-800">Nội dung bài giảng</Text>
                    </View>
                    <HTMLViewer htmlContent={chapterData.lecture.lectureMetadata} />
                  </View>
                ) : chapterData.chapterType === "Video" && chapterData.video ? (
                  <View className="p-6">
                    <View className="flex-row items-center mb-4">
                      <View className="bg-red-100 p-2 rounded-xl mr-3">
                        <Play size={20} color="#EF4444" />
                      </View>
                      <Text className="text-xl font-bold text-gray-800">Video bài học</Text>
                    </View>

                    <View className="bg-black rounded-2xl overflow-hidden mb-4">
                      <Video
                        source={{ uri: chapterData.video.videoUrl }}
                        style={{ width: "100%", height: 220 }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={false}
                      />
                    </View>

                    <View className="bg-gray-50 rounded-2xl p-4">
                      <View className="flex-row items-center mb-2">
                        <Clock size={16} color="#6B7280" />
                        <Text className="text-gray-600 ml-2 font-medium">
                          Thời lượng: {chapterData.video.timeVideo}
                        </Text>
                      </View>
                      {(chapterData.description || chapterData.video?.description) && (
                        <Text className="text-gray-600 mt-2 leading-6">
                          {chapterData.description || chapterData.video.description}
                        </Text>
                      )}
                    </View>
                  </View>
                ) : chapterData.chapterType === "Quiz" && chapterData.quiz ? (
                  <View className="p-6">
                    <View className="flex-row items-center mb-6">
                      <View className="bg-teal-100 p-2 rounded-xl mr-3">
                        <HelpCircle size={20} color="#14B8A6" />
                      </View>
                      <Text className="text-xl font-bold text-gray-800">Bài kiểm tra</Text>
                    </View>

                    {chapterData.quiz.questions.length === 0 ? (
                      <View className="bg-gray-50 rounded-2xl p-8 items-center">
                        <Text className="text-gray-500 text-center">Không có câu hỏi nào.</Text>
                      </View>
                    ) : (
                      <>
                        {chapterData.quiz.questions.map((q: QuizQuestion, i: number) => (
                          <View key={q.id} className="mb-6">
                            <View className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-5 mb-4">
                              <Text className="font-bold text-gray-800 text-lg mb-3">
                                Câu {i + 1}: {q.description}
                              </Text>
                            </View>

                            <View className="space-y-3">
                              {q.answers.map((ans: QuizAnswer) => {
                                const isSelected = selectedAnswers[q.id] === ans.id
                                return (
                                  <TouchableOpacity
                                    key={ans.id}
                                    className={`flex-row items-center p-4 rounded-2xl border-2 ${isSelected ? "bg-teal-50 border-teal-300" : "bg-gray-50 border-gray-200"
                                      }`}
                                    onPress={() => handleAnswerSelect(q.id, ans.id)}
                                    disabled={quizSubmitted}
                                  >
                                    <View className="mr-4">
                                      <View
                                        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? "border-teal-500 bg-teal-500" : "border-gray-300"
                                          }`}
                                      >
                                        {isSelected && <View className="w-2 h-2 bg-white rounded-full" />}
                                      </View>
                                    </View>
                                    <Text
                                      className={`flex-1 text-base ${isSelected ? "text-teal-700 font-medium" : "text-gray-700"
                                        }`}
                                    >
                                      {ans.text}
                                    </Text>
                                  </TouchableOpacity>
                                )
                              })}
                            </View>
                          </View>
                        ))}

                        {quizSubmitted ? (
                          <LinearGradient colors={["#10B981", "#059669"]} className="rounded-2xl p-6 items-center mt-6">
                            <Award size={32} color="#fff" />
                            <Text className="text-white font-bold text-lg text-center mt-2">{quizResult}</Text>
                          </LinearGradient>
                        ) : (
                          <TouchableOpacity
                            className="w-full rounded-2xl overflow-hidden mt-6"
                            onPress={handleSubmitQuiz}
                            disabled={!canSubmitQuiz}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={canSubmitQuiz ? ["#14B8A6", "#0D9488"] : ["#9CA3AF", "#6B7280"]}
                              className="w-full rounded-2xl p-4 items-center"
                            >
                              <Text className="text-white font-bold text-lg">Nộp bài kiểm tra</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                ) : (
                  <View className="p-8 items-center">
                    <Text className="text-gray-500 text-center">Không có nội dung chi tiết cho chương này.</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          {/* Navigation buttons cố định dưới cùng màn hình */}
          {isEnrolled && lessons.length > 0 && (
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 8,
                zIndex: 10,
              }}
              className="flex-row justify-between items-center"
            >
              <TouchableOpacity
                disabled={isFirstChapter}
                onPress={() => handleNavigateChapter("prev")}
                className={`p-4 rounded-full flex-row items-center shadow-sm ${isFirstChapter ? "bg-gray-200 opacity-50" : "bg-gray-100 active:bg-gray-200"
                  }`}
              >
                <ArrowLeft size={20} color={isFirstChapter ? "#9CA3AF" : "#6C757D"} />
                <Text className="ml-2 text-secondary font-medium">Bài trước</Text>
              </TouchableOpacity>
              {!isLastChapter ? (
                <TouchableOpacity
                  disabled={isLastChapter}
                  onPress={() => handleNavigateChapter("next")}
                  className={`p-4 rounded-full flex-row items-center shadow-sm ${isLastChapter ? "bg-gray-200 opacity-50" : "bg-primary active:bg-pink-600"
                    }`}
                >
                  <Text className="mr-2 text-white font-medium">Bài tiếp theo</Text>
                  <ArrowLeft size={20} color="white" style={{ transform: [{ rotate: "180deg" }] }} />
                </TouchableOpacity>
              ) : (
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <TouchableOpacity
                    onPress={async () => {
                      if (!canFinishCourse) return
                      try {
                        if (!chapterData?.isDone) {
                          await courseApi.markChapterAsDone(chapterData.id)
                          await fetchChapterContent()
                        }
                        Alert.alert("Chúc mừng!", "Bạn đã hoàn thành toàn bộ khóa học!")
                      } catch (err) {
                        Alert.alert("Lỗi", "Không thể đánh dấu hoàn thành chương cuối.")
                      }
                    }}
                    disabled={!canFinishCourse || chapterData?.isDone}
                    className={`p-4 rounded-full flex-row items-center shadow-sm ml-2 ${canFinishCourse && !chapterData?.isDone ? "bg-green-500" : "bg-gray-200 opacity-50"}`}
                  >
                    <Text className="text-white font-bold">Hoàn thành khóa học</Text>
                    <CheckCircle size={20} color="#fff" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                  {!canFinishCourse && (
                    <Text style={{ color: "#EF4444", marginTop: 8, fontWeight: "bold", textAlign: "right" }}>
                      Bạn cần hoàn thành tất cả bài giảng trước đó để có thể ấn hoàn thành
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  )
}

export default CourseContentScreen