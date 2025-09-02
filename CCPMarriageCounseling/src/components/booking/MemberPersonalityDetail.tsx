import React, { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { User, Brain, Heart, MessageCircle, Target, Sparkles } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import SurveyScores from "../survey/SurveyScores"
import LoveMapSurveyDetail from "../lovemap/LoveMapSurveyDetail"
import personTypeApi from "@/src/config/api/persontype.api"
import type { MemberPersonality, SurveyResult } from "@/src/config/types/booking.type"

const SURVEY_LABELS: Record<string, string> = {
    SV001: "MBTI",
    SV002: "DISC",
    SV003: "Love Language",
    SV004: "Big Five",
}

const SURVEY_ICONS: Record<string, any> = {
    SV001: Brain,
    SV002: Target,
    SV003: Heart,
    SV004: Sparkles,
}

const SURVEY_COLORS: Record<string, [string, string]> = {
    SV001: ["#3B82F6", "#60A5FA"], // Blue
    SV002: ["#10B981", "#34D399"], // Green
    SV003: ["#E83E8C", "#FF6B9D"], // Pink
    SV004: ["#8B5CF6", "#A78BFA"], // Purple
}

const MemberPersonalityDetail = ({
    memberName,
    personality,
}: {
    memberName: string
    personality: MemberPersonality
}) => {
    // Lưu chi tiết tính cách cho từng surveyId
    const [details, setDetails] = useState<Record<string, string>>({})
    const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const fetchDetails = async () => {
            const allSurveys: SurveyResult[] = [
                ...(personality.mbti || []),
                ...(personality.disc || []),
                ...(personality.loveLanguage || []),
                ...(personality.bigFive || []),
            ]

            for (const survey of allSurveys) {
                setLoadingDetails(prev => ({ ...prev, [survey.surveyId]: true }))
                try {
                    const personType = await personTypeApi.getPersonTypeByName(survey.result, survey.surveyId)
                    setDetails(prev => ({ ...prev, [survey.surveyId]: personType.detail }))
                } catch (error) {
                    console.error(`Error fetching details for ${survey.surveyId}:`, error)
                } finally {
                    setLoadingDetails(prev => ({ ...prev, [survey.surveyId]: false }))
                }
            }
        }
        fetchDetails()
    }, [personality])

    // Helper để lấy list survey theo đúng thứ tự
    const getSurveyList = () => [
        ...(personality.mbti || []),
        ...(personality.disc || []),
        ...(personality.loveLanguage || []),
        ...(personality.bigFive || []),
    ]

    const surveyList = getSurveyList()

    if (surveyList.length === 0) {
        return (
            <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <View className="items-center">
                    <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <User size={32} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-700 font-bold text-lg mb-2">{memberName}</Text>
                    <Text className="text-gray-500 text-center">Chưa có dữ liệu phân tích tính cách</Text>
                </View>
            </View>
        )
    }

    return (
        <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            {/* Header */}
            <LinearGradient
                colors={["#E83E8C", "#FF6B9D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    padding: 20, // tương đương p-5
                }}
            >

                <View className="flex-row items-center">
                    <View className="bg-white/20 p-3 rounded-2xl mr-4">
                        <User size={24} color="#fff" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-xl font-bold">{memberName}</Text>
                        <Text className="text-white/80 text-sm mt-1">
                            {surveyList.length} bài đánh giá tính cách
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Survey Results */}
            <View className="p-5">
                {surveyList.map((survey, idx) => {
                    const IconComponent = SURVEY_ICONS[survey.surveyId] || Brain
                    const colors = SURVEY_COLORS[survey.surveyId] || ["#6B7280", "#9CA3AF"]
                    const isLoading = loadingDetails[survey.surveyId]

                    return (
                        <View key={survey.surveyId + idx} className="mb-6 last:mb-0">
                            {/* Survey Header */}
                            <View className="flex-row items-center mb-4">
                                <LinearGradient
                                    colors={colors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 16,
                                    }}
                                >

                                    <IconComponent size={20} color="#fff" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-bold text-lg">
                                        {SURVEY_LABELS[survey.surveyId] || survey.surveyId}
                                    </Text>
                                    <View className="bg-gray-50 rounded-xl px-3 py-2 mt-1 border border-gray-200">
                                        <Text className="text-gray-700 font-semibold text-base">
                                            Kết quả: {survey.result}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Survey Scores */}
                            <View className="mb-4">
                                <Text className="text-gray-700 font-semibold text-base mb-3">Điểm số chi tiết:</Text>
                                <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <SurveyScores scores={survey.scores} surveyId={survey.surveyId} />
                                </View>
                            </View>

                            {/* Survey Description */}
                            {survey.description && (
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-semibold text-base mb-3">Mô tả:</Text>
                                    <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <Text className="text-gray-700 text-base leading-6">
                                            {survey.description}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Detailed Analysis */}
                            <View className="mb-4">
                                <Text className="text-gray-700 font-semibold text-base mb-3">Phân tích chi tiết:</Text>
                                {isLoading ? (
                                    <View className="bg-gray-50 rounded-xl p-6 items-center border border-gray-200">
                                        <ActivityIndicator size="small" color="#E83E8C" />
                                        <Text className="text-gray-500 text-sm mt-2">Đang tải phân tích...</Text>
                                    </View>
                                ) : (
                                    <View className="bg-pink-50 rounded-xl border border-pink-200 overflow-hidden pt-4 px-4">
                                        <LoveMapSurveyDetail
                                            title="Chi tiết tính cách"
                                            description={details[survey.surveyId] || "Chưa có thông tin chi tiết"}
                                        />
                                    </View>
                                )}
                            </View>

                            {/* Separator */}
                            {idx < surveyList.length - 1 && (
                                <View className="border-b border-gray-100 mb-6" />
                            )}
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export default MemberPersonalityDetail