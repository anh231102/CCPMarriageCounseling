"use client"

import type React from "react"
import { Modal, View, Text, TouchableOpacity, ScrollView, ColorValue } from "react-native"
import { Award, CheckCircle, XCircle, Target, TrendingUp } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

interface QuizResultModalProps {
    visible: boolean
    score: number
    maxScore: number
    questions: {
        id: string
        description: string
        answers: { id: string; text: string; score?: number }[]
    }[]
    selectedAnswers: Record<string, string>
    onClose: () => void
}

const QuizResultModal: React.FC<QuizResultModalProps> = ({
    visible,
    score,
    maxScore,
    questions,
    selectedAnswers,
    onClose,
}) => {
    const percentage = Math.round((score / maxScore) * 100)

    const getScoreColor = () => {
        if (percentage >= 80) return "text-green-600"
        if (percentage >= 60) return "text-yellow-600"
        return "text-red-600"
    }

    const getScoreGradient = (): [ColorValue, ColorValue] => {
        if (percentage >= 80) return ["#10B981", "#059669"]
        if (percentage >= 60) return ["#F59E0B", "#FBBF24"]
        return ["#EF4444", "#F87171"]
    }

    const getScoreMessage = () => {
        if (percentage >= 80) return "Xuất sắc! 🎉"
        if (percentage >= 60) return "Tốt! 👍"
        return "Cần cải thiện! 💪"
    }

    // Calculate improvement suggestions
    const improvementSuggestions = questions.filter((q) => {
        const selectedId = selectedAnswers[q.id]
        const selected = q.answers.find((a) => a.id === selectedId)
        const bestAnswer = q.answers.reduce(
            (prev, curr) => (curr.score ?? 0) > (prev.score ?? 0) ? curr : prev,
            q.answers[0] ?? { id: "", text: "", score: 0 }
        );
        return !selected || selected.id !== bestAnswer.id
    })

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/40 justify-center items-center px-4">
                <View
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md"
                    style={{ maxHeight: "90%" }}
                >
                    {/* Header with gradient */}
                    <LinearGradient
                        colors={["#E83E8C", "#FF6B9D"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            padding: 24,          // p-6
                            alignItems: "center", // items-center
                            borderRadius: 16,     // rounded-2xl nếu muốn bo góc
                            shadowColor: "#000",  // thêm shadow cho iOS
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 3,
                            elevation: 4,         // shadow cho Android
                        }}
                    >
                        <View className="bg-white/20 p-4 rounded-full mb-1">
                            <Award size={32} color="#fff" />
                        </View>
                        <Text className="text-white text-2xl font-bold text-center mb-2">Kết quả bài kiểm tra</Text>
                        <Text className="text-white/90 text-center text-sm">{getScoreMessage()}</Text>
                    </LinearGradient>

                    <ScrollView style={{ maxHeight: 900 }} showsVerticalScrollIndicator={false}>
                        <View className="p-6">
                            {/* Score Display */}
                            <View className="items-center mb-6">
                                <View className="bg-pink-50 rounded-2xl px-8 py-6 mb-4 shadow-lg border border-pink-300">
                                    <Text className="text-gray-800 text-center font-semibold text-lg mb-2">
                                        Kết Quả Của Bạn
                                    </Text>
                                    <Text className="text-center text-4xl font-extrabold text-pink-600 drop-shadow-md">
                                        {score} <Text className="text-gray-700 text-2xl">/ {maxScore}</Text>
                                    </Text>
                                </View>
                            </View>


                            {/* Improvement Suggestions */}
                            {improvementSuggestions.length > 0 && (
                                <View className="mb-6">
                                    <View className="flex-row items-center mb-4">
                                        <View className="bg-blue-100 p-2 rounded-xl mr-3">
                                            <Target size={20} color="#3B82F6" />
                                        </View>
                                        <Text className="text-gray-800 font-bold text-lg">Gợi ý cải thiện</Text>
                                    </View>

                                    <View className="space-y-3">
                                        {improvementSuggestions.map((q, idx) => {
                                            const selectedId = selectedAnswers[q.id]
                                            const selected = q.answers.find((a) => a.id === selectedId)
                                            const bestAnswer = q.answers.reduce(
                                                (prev, curr) => (curr.score ?? 0) > (prev.score ?? 0) ? curr : prev,
                                                q.answers[0] ?? { id: "", text: "", score: 0 }
                                            );
                                            return (
                                                <View key={q.id} className="bg-gray-50 rounded-2xl p-4">
                                                    <View className="flex-row items-start mb-2">

                                                        <Text className="text-primary font-bold mr-2 ">
                                                            {questions.findIndex((question) => question.id === q.id) + 1}
                                                        </Text>

                                                        <Text className="text-gray-800 font-semibold  flex-1 leading-5">
                                                            {q.description}
                                                        </Text>
                                                    </View>

                                                    {/* Your Answer */}
                                                    {selected && (
                                                        <View className="bg-pink-50 rounded-xl p-3 mb-2 border border-pink-200">
                                                            <Text className="text-primary text-xs font-medium mb-1">Câu trả lời của bạn:</Text>
                                                            <Text className="text-primary text-sm">{selected.text}</Text>
                                                        </View>
                                                    )}

                                                    {/* Best Answer */}
                                                    <View className="bg-green-50 rounded-xl p-3 border border-green-200">
                                                        <View className="flex-row items-center mb-1">
                                                            <TrendingUp size={14} color="#10B981" />
                                                            <Text className="text-green-700 text-xs font-medium ml-1">Đáp án tốt nhất:</Text>
                                                        </View>
                                                        <Text className="text-green-800 text-sm font-medium">{bestAnswer.text}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            )}

                            {/* Motivational Message */}
                            <View className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
                                <Text className="text-blue-800 text-sm text-center leading-5">
                                    {percentage >= 80
                                        ? "🌟 Rất tốt! Bài kiểm tra cho thấy bạn đã nắm được nhiều kiến thức, hãy tiếp tục phát huy nhé."
                                        : percentage >= 60
                                            ? "✨ Khá ổn! Kết quả này gợi ý bạn đã hiểu phần lớn nội dung, chỉ cần ôn lại một chút để chắc chắn hơn."
                                            : "🌱 Không sao đâu! Đây chỉ là bước tham khảo, hãy coi đây là cơ hội để học thêm và tiến bộ dần nhé."}
                                </Text>
                            </View>

                        </View>
                    </ScrollView>

                    {/* Close Button */}
                    <View className="p-6 pt-0">
                        <TouchableOpacity onPress={onClose} className="rounded-2xl overflow-hidden shadow-md" activeOpacity={0.8}>
                            <LinearGradient
                                colors={["#E83E8C", "#FF6B9D"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    padding: 16,          // tương đương p-4
                                    alignItems: "center", // tương đương items-center
                                    borderRadius: 12,     // có thể thêm bo góc nếu muốn đẹp hơn
                                }}
                            >
                                <Text className="text-white font-bold text-lg">Hoàn thành</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default QuizResultModal
