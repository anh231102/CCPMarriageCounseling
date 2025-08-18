"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from "react-native"
import { ArrowLeft } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import surveyApi from "@/src/config/api/survey.api"
import type { Question, Survey } from "@/src/config/types/survey.type"
import Loading from "@/src/components/share/Loading"
import coupleApi from "@/src/config/api/couple.api"
import SurveyStartModal from "@/src/components/survey/SurveyStartModal"

const CoupleSurveyQuestionsScreen = () => {
  const [showStartModal, setShowStartModal] = useState(true)
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const {
    selectedSurveyIds,
    userType,
    userData,
    currentSurveyIndex = 0,
    isAuth,
    roomId,
    isHost,
    isSurvey,
  } = route.params

  const { isAuth: authState } = useAuth()
  const progressAnim = useRef(new Animated.Value(0)).current

  const [questions, setQuestions] = useState<Question[]>([])
  const [surveyTitle, setSurveyTitle] = useState<string>("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentSurveyId = selectedSurveyIds[currentSurveyIndex]
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const answersAccumulator = useRef<Record<string, any[]>>({})
  const { accumulatedAnswers: initialAnswersFromRoute } = route.params || {};


  useEffect(() => {

    const fetchQuestions = async () => {
      setLoading(true)
      setShowStartModal(true)
      try {
        const questionData = await surveyApi.getRandomSurveyQuestions(currentSurveyId)
        setQuestions(questionData)

        const allSurveys: Survey[] = await surveyApi.getSurveys()
        const matchedSurvey = allSurveys.find((s) => s.id === currentSurveyId)
        setSurveyTitle(matchedSurvey?.name || `Khảo sát #${currentSurveyIndex + 1}`)
      } catch (err: any) {
        setError("Không thể tải câu hỏi. Vui lòng thử lại.")
      } finally {
        setLoading(false)
      }
    }
    if (initialAnswersFromRoute) {
      answersAccumulator.current = initialAnswersFromRoute;
    }
    fetchQuestions()
  }, [currentSurveyId, initialAnswersFromRoute])

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / (totalQuestions || 1),
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [currentQuestionIndex, totalQuestions])

  const handleAnswer = async (answerValue: any) => {
    const questionId = currentQuestion.id
    const updatedAnswers = {
      ...answers,
      [questionId]: { ...answerValue, surveyId: currentSurveyId },
    }
    setAnswers(updatedAnswers)

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setLoading(true)
      try {
        // ✅ Gom dữ liệu cho Couple API
        const groupedAnswers: Record<string, number> = {}
        Object.values(updatedAnswers).forEach((ans: any) => {
          if (ans.tag && typeof ans.score === "number") {
            groupedAnswers[ans.tag] = (groupedAnswers[ans.tag] || 0) + ans.score
          }
        })

        const formattedResult = {
          surveyId: currentSurveyId,
          answers: Object.entries(groupedAnswers).map(([tag, score]) => ({
            tag,
            score,
          })),
        }

        // ✅ Gửi Couple API
        await coupleApi.postCoupleSurveyResult(formattedResult)
        // Lưu lại toàn bộ câu trả lời từng survey vào allAnswers

        answersAccumulator.current = {
          ...answersAccumulator.current,
          [currentSurveyId]: [
            ...(answersAccumulator.current[currentSurveyId] || []),
            ...Object.values(updatedAnswers),
          ],
        }

        const isLastSurvey = currentSurveyIndex >= selectedSurveyIds.length - 1

        if (isLastSurvey) {
          // In ra toàn bộ đáp án đã tích lũy 
          navigation.replace("LoadingBeforeSave", {
            selectedSurveyIds,
            roomId,
            isHost,
            isSurvey,
            answers: answersAccumulator.current,
          })
        } else {
          navigation.replace("SurveySectionComplete", {
            selectedSurveyIds,
            currentSurveyIndex,
            nextSurveyIndex: currentSurveyIndex + 1,
            currentSurveyTitle: surveyTitle,
            resultText: "",
            userType,
            userData,
            isAuth: isAuth ?? authState,
            couple: true,
            accumulatedAnswers: answersAccumulator.current,
          })
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lưu kết quả khảo sát. Vui lòng thử lại.")
      } finally {
        setLoading(false)
        setAnswers({})
        setCurrentQuestionIndex(0)
      }
    }
  }

  const handleExit = () => {
    Alert.alert("Thoát khảo sát", "Bạn có chắc chắn muốn thoát?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Thoát",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Loading size={50} />
        <Text className="text-secondary mt-3">Đang xử lý dữ liệu...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-primary px-6 py-2 rounded">
          <Text className="text-white">Quay lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={handleExit} className="p-2">
            <ArrowLeft size={24} color="#6C757D" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-secondary-dark">
            Khảo sát {currentSurveyIndex + 1}/{selectedSurveyIds.length}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <Animated.View
            className="h-full bg-primary"
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-secondary">
            Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
          <Text className="text-xs text-secondary font-medium">
            {userData?.name || "Người dùng"}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-primary/5 rounded-xl p-5 mb-6">
          <Text className="text-xl font-semibold text-secondary-dark">
            {currentQuestion?.description || "Không có câu hỏi"}
          </Text>
        </View>

        <View className="space-y-3">
          {currentQuestion?.answers?.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleAnswer(option)}
              className="border border-border rounded-xl p-4 active:bg-primary/5"
            >
              <Text className="text-secondary-dark">{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="p-4 border-t border-border">
        <View className="flex-row justify-center">
          <Text className="text-secondary text-sm">
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% hoàn thành
          </Text>
        </View>
      </View>
      <SurveyStartModal
        visible={showStartModal}
        surveyId={currentSurveyId}
        onClose={() => setShowStartModal(false)}
      />
    </View>
  )
}

export default CoupleSurveyQuestionsScreen
