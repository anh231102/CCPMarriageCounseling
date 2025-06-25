"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, ScrollView, Alert, Animated } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeft } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"


const SurveyQuestionsScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { userType, userData } = route.params
  const { isAuth, user } = useAuth()

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isPartnerAnswering, setIsPartnerAnswering] = useState(false)
  const progressAnim = useRef(new Animated.Value(0)).current

  // Định nghĩa 4 phần khảo sát
  const surveySections = [
    {
      id: "mbti",
      title: "MBTI - Myers-Briggs",
      questions: [
        {
          id: "mbti_1",
          text: "Bạn thích dành thời gian một mình hay với nhiều người?",
          options: [
            { id: "A", text: "Tôi thích dành thời gian với nhiều người", value: "E" },
            { id: "B", text: "Tôi thích dành thời gian một mình", value: "I" },
          ],
        },
        {
          id: "mbti_2",
          text: "Khi đối mặt với một vấn đề, bạn thường:",
          options: [
            { id: "A", text: "Dựa vào kinh nghiệm và thực tế", value: "S" },
            { id: "B", text: "Tìm kiếm các khả năng và ý tưởng mới", value: "N" },
          ],
        },
        {
          id: "mbti_3",
          text: "Khi đưa ra quyết định, bạn thường:",
          options: [
            { id: "A", text: "Dựa trên logic và lý trí", value: "T" },
            { id: "B", text: "Dựa trên cảm xúc và giá trị cá nhân", value: "F" },
          ],
        },
        {
          id: "mbti_4",
          text: "Bạn thích cuộc sống:",
          options: [
            { id: "A", text: "Có kế hoạch và cấu trúc rõ ràng", value: "J" },
            { id: "B", text: "Linh hoạt và tự do thích nghi", value: "P" },
          ],
        },
        {
          id: "mbti_5",
          text: "Trong một cuộc trò chuyện, bạn thường:",
          options: [
            { id: "A", text: "Nói nhiều và dễ dàng bắt chuyện với người lạ", value: "E" },
            { id: "B", text: "Lắng nghe nhiều hơn và thận trọng khi gặp người lạ", value: "I" },
          ],
        },
      ],
    },
    {
      id: "disc",
      title: "DISC - Phong cách hành vi",
      questions: [
        {
          id: "disc_1",
          text: "Khi làm việc nhóm, bạn thường:",
          options: [
            { id: "D", text: "Chủ động đưa ra quyết định và dẫn dắt nhóm", value: "D" },
            { id: "I", text: "Tạo không khí vui vẻ và động viên mọi người", value: "I" },
            { id: "S", text: "Hỗ trợ và giúp đỡ các thành viên khác", value: "S" },
            { id: "C", text: "Tập trung vào chi tiết và chất lượng công việc", value: "C" },
          ],
        },
        {
          id: "disc_2",
          text: "Trong tình huống căng thẳng, bạn có xu hướng:",
          options: [
            { id: "D", text: "Đối mặt trực tiếp và giải quyết nhanh chóng", value: "D" },
            { id: "I", text: "Tìm cách làm dịu tình hình bằng giao tiếp", value: "I" },
            { id: "S", text: "Kiên nhẫn và tìm giải pháp ổn định", value: "S" },
            { id: "C", text: "Phân tích kỹ lưỡng trước khi hành động", value: "C" },
          ],
        },
        {
          id: "disc_3",
          text: "Bạn cảm thấy thoải mái nhất khi:",
          options: [
            { id: "D", text: "Có quyền kiểm soát và đưa ra quyết định", value: "D" },
            { id: "I", text: "Được tương tác và giao tiếp với nhiều người", value: "I" },
            { id: "S", text: "Làm việc trong môi trường ổn định, hòa hợp", value: "S" },
            { id: "C", text: "Có thời gian suy nghĩ và chuẩn bị kỹ lưỡng", value: "C" },
          ],
        },
        {
          id: "disc_4",
          text: "Điểm mạnh của bạn là:",
          options: [
            { id: "D", text: "Quyết đoán và có khả năng lãnh đạo", value: "D" },
            { id: "I", text: "Nhiệt tình và có khả năng thuyết phục", value: "I" },
            { id: "S", text: "Đáng tin cậy và hỗ trợ tốt", value: "S" },
            { id: "C", text: "Chính xác và có tư duy phân tích", value: "C" },
          ],
        },
      ],
    },
    {
      id: "love-language",
      title: "Love Languages - Ngôn ngữ tình yêu",
      questions: [
        {
          id: "love_1",
          text: "Bạn cảm thấy được yêu thương nhất khi đối tác dành thời gian chất lượng cho bạn.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "love_2",
          text: "Những lời khen ngợi và khẳng định từ đối tác rất quan trọng với bạn.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "love_3",
          text: "Bạn cảm thấy được yêu thương khi nhận quà tặng từ đối tác.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "love_4",
          text: "Khi đối tác giúp đỡ bạn làm việc, bạn cảm thấy được quan tâm.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "love_5",
          text: "Những cử chỉ thân mật như ôm, nắm tay làm bạn cảm thấy gần gũi.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
      ],
    },
    {
      id: "big-five",
      title: "Big Five - Năm yếu tố tính cách",
      questions: [
        {
          id: "big5_1",
          text: "Tôi là người có trí tưởng tượng phong phú.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "big5_2",
          text: "Tôi là người có tính kỷ luật cao.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "big5_3",
          text: "Tôi là người hướng ngoại và năng động.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "big5_4",
          text: "Tôi là người dễ hòa đồng và tin tưởng người khác.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
        {
          id: "big5_5",
          text: "Tôi thường lo lắng và căng thẳng.",
          options: [
            { id: "1", text: "Hoàn toàn không đồng ý", value: 1 },
            { id: "2", text: "Không đồng ý", value: 2 },
            { id: "3", text: "Trung lập", value: 3 },
            { id: "4", text: "Đồng ý", value: 4 },
            { id: "5", text: "Hoàn toàn đồng ý", value: 5 },
          ],
        },
      ],
    },
  ]

  const currentSection = surveySections[currentSectionIndex]
  const currentQuestion = currentSection.questions[currentQuestionIndex]
  const totalQuestions = surveySections.reduce((sum, section) => sum + section.questions.length, 0)
  const currentOverallIndex =
    surveySections.slice(0, currentSectionIndex).reduce((sum, section) => sum + section.questions.length, 0) +
    currentQuestionIndex

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentOverallIndex + 1) / totalQuestions,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [currentOverallIndex, totalQuestions])

  const handleAnswer = (value: any) => {
    const questionId = currentQuestion.id
    const newAnswers = {
      ...answers,
      [questionId]: {
        ...answers[questionId],
        [isPartnerAnswering ? "partner" : "user"]: value,
      },
    }
    setAnswers(newAnswers)

    // Chuyển câu hỏi tiếp theo
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentSectionIndex < surveySections.length - 1) {
      // Chuyển phần tiếp theo
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentQuestionIndex(0)
    } else {
      // Hoàn thành một người, chuyển sang người thứ hai hoặc kết thúc
      if (userType === "self-check" && !isPartnerAnswering) {
        setIsPartnerAnswering(true)
        setCurrentSectionIndex(0)
        setCurrentQuestionIndex(0)
        Alert.alert("Chuyển sang đối tác", "Bây giờ đến lượt đối tác của bạn trả lời các câu hỏi.", [{ text: "OK" }])
      } else {
        handleComplete()
      }
    }
  }

  const handleComplete = () => {
    const results = {
      surveyType: "comprehensive",
      userType,
      userData,
      answers,
      timestamp: new Date().toISOString(),
    }

    navigation.navigate("SurveyResults", {
      results,
      isAuth,
    })
  }

  const handleExit = () => {
    Alert.alert("Thoát khảo sát", "Bạn có chắc chắn muốn thoát? Tiến trình sẽ không được lưu.", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Thoát",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={handleExit} className="p-2">
            <ArrowLeft size={24} color="#6C757D" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-secondary-dark">Khảo sát tổng hợp</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Section Progress */}
        <View className="mb-3">
          <Text className="text-sm text-secondary mb-2">
            Phần {currentSectionIndex + 1}/4: {currentSection.title}
          </Text>
          <View className="flex-row space-x-1">
            {surveySections.map((_, index) => (
              <View
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index < currentSectionIndex
                    ? "bg-success"
                    : index === currentSectionIndex
                      ? "bg-primary"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Overall Progress */}
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
            Câu hỏi {currentOverallIndex + 1}/{totalQuestions}
          </Text>
          <Text className="text-xs text-secondary font-medium">
            {isPartnerAnswering ? userData?.partnerName || "Đối tác" : userData?.name || "Bạn"}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-primary/5 rounded-xl p-5 mb-6">
          <Text className="text-xl font-semibold text-secondary-dark">{currentQuestion.text}</Text>
        </View>

        <View className="space-y-3">
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleAnswer(option.value)}
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
            {Math.round(((currentOverallIndex + 1) / totalQuestions) * 100)}% hoàn thành
          </Text>
        </View>
      </View>
    </View>
  )
}

export default SurveyQuestionsScreen
