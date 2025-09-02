import React, { useEffect, useState } from "react"
import { Modal, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native"
import { X, FileText, Brain, Heart, Lightbulb, Users } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import bookingApi from "@/src/config/api/booking.api"
import SurveyScores from "../survey/SurveyScores"
import LoveMapSurveyDetail from "../lovemap/LoveMapSurveyDetail"
import LoveMapContent from "../lovemap/LoveMapContent"
import MemberPersonalityDetail from "./MemberPersonalityDetail"

interface ConclusionProps {
    visible: boolean
    onClose: () => void
    conclusion: {
        problemSummary: string | null
        problemAnalysis: string | null
        guides: string | null
        bookingId: string
    } | null
}

const ConclusionLoveMapModal = ({ visible, onClose, conclusion }: ConclusionProps) => {
    const [loading, setLoading] = useState(false)
    const [bundle, setBundle] = useState<any>(null)

    useEffect(() => {
        if (visible && conclusion?.bookingId) {
            setLoading(true)
            bookingApi
                .postPersonTypeBundle({ bookingId: conclusion.bookingId })
                .then(setBundle)
                .finally(() => setLoading(false))
        }
    }, [visible, conclusion?.bookingId])

    if (!conclusion) return null

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <LinearGradient
                    colors={["#E83E8C", "#FF6B9D"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        padding: 24,   // tương đương p-6
                        paddingBottom: 16, // tương đương pb-4
                    }}
                >

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="bg-white/20 p-3 rounded-2xl mr-4">
                                <FileText size={24} color="#fff" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-xl font-bold">Kết luận buổi tư vấn</Text>
                                <Text className="text-white/80 text-sm mt-1">Tổng hợp và phân tích chi tiết</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-white/20 p-2 rounded-full"
                            activeOpacity={0.7}
                        >
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="p-4">
                        {/* Consultation Summary Section */}
                        <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
                            {/* Problem Summary */}
                            {conclusion.problemSummary && (
                                <View className="p-5 border-b border-gray-100">
                                    <View className="flex-row items-center mb-3">
                                        <View className="bg-blue-50 p-2 rounded-xl mr-3">
                                            <Brain size={20} color="#3B82F6" />
                                        </View>
                                        <Text className="text-gray-800 font-bold text-lg">Tóm tắt vấn đề</Text>
                                    </View>
                                    <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <Text className="text-gray-700 text-base leading-6">
                                            {conclusion.problemSummary}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Problem Analysis */}
                            {conclusion.problemAnalysis && (
                                <View className="p-5 border-b border-gray-100">
                                    <View className="flex-row items-center mb-3">
                                        <View className="bg-purple-50 p-2 rounded-xl mr-3">
                                            <Heart size={20} color="#8B5CF6" />
                                        </View>
                                        <Text className="text-gray-800 font-bold text-lg">Phân tích vấn đề</Text>
                                    </View>
                                    <View className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                        <Text className="text-gray-700 text-base leading-6">
                                            {conclusion.problemAnalysis}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Guides */}
                            {conclusion.guides && (
                                <View className="p-5">
                                    <View className="flex-row items-center mb-3">
                                        <View className="bg-green-50 p-2 rounded-xl mr-3">
                                            <Lightbulb size={20} color="#10B981" />
                                        </View>
                                        <Text className="text-gray-800 font-bold text-lg">Hướng dẫn cải thiện</Text>
                                    </View>
                                    <View className="bg-green-50 rounded-xl p-4 border border-green-200">
                                        <Text className="text-gray-700 text-base leading-6">
                                            {conclusion.guides}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Personality Analysis Section */}
                        <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
                            <View className="bg-pink-50 p-4 border-b border-pink-100">
                                <View className="flex-row items-center">
                                    <View className="bg-pink-100 p-2 rounded-xl mr-3">
                                        <Users size={20} color="#E83E8C" />
                                    </View>
                                    <Text className="text-gray-800 font-bold text-lg">Phân tích tính cách</Text>
                                </View>
                            </View>

                            <View className="p-5">
                                {loading ? (
                                    <View className="items-center py-8">
                                        <View className="w-16 h-16 bg-pink-50 rounded-full items-center justify-center mb-4">
                                            <ActivityIndicator size="large" color="#E83E8C" />
                                        </View>
                                        <Text className="text-gray-600 font-medium">Đang tải phân tích tính cách...</Text>
                                    </View>
                                ) : bundle?.couple != null ? (
                                    <View>
                                        <View className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-200">
                                            <View className="flex-row items-center mb-2">
                                                <Heart size={18} color="#E83E8C" />
                                                <Text className="text-pink-800 font-bold text-base ml-2">Bản đồ tình yêu</Text>
                                            </View>
                                            <Text className="text-pink-700 text-sm">
                                                Phân tích mối quan hệ dựa trên kết quả khảo sát
                                            </Text>
                                        </View>
                                        <LoveMapContent coupleId={bundle.couple.id} onClose={onClose} />
                                    </View>
                                ) : (
                                    <View>
                                        {bundle?.member1 &&
                                            (bundle.member1.mbti?.length ||
                                                bundle.member1.disc?.length ||
                                                bundle.member1.loveLanguage?.length ||
                                                bundle.member1.bigFive?.length) ? (
                                            <View className="mb-6">
                                                
                                                <MemberPersonalityDetail
                                                    memberName="Thành viên 1"
                                                    personality={bundle.member1}
                                                />
                                            </View>
                                        ) : null}

                                        {bundle?.member2 &&
                                            (bundle.member2.mbti?.length ||
                                                bundle.member2.disc?.length ||
                                                bundle.member2.loveLanguage?.length ||
                                                bundle.member2.bigFive?.length) ? (
                                            <View className="mb-6">
                                                
                                                <MemberPersonalityDetail
                                                    memberName="Thành viên 2"
                                                    personality={bundle.member2}
                                                />
                                            </View>
                                        ) : null}

                                        {(!bundle?.member1 && !bundle?.member2) && (
                                            <View className="items-center py-8">
                                                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                                                    <Users size={32} color="#9CA3AF" />
                                                </View>
                                                <Text className="text-gray-500 text-center font-medium">
                                                    Chưa có dữ liệu phân tích tính cách
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Close Button */}

            </SafeAreaView>
        </Modal>
    )
}

export default ConclusionLoveMapModal