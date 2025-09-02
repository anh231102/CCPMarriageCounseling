"use client"

import type React from "react"
import { Modal, View, Text, TouchableOpacity } from "react-native"
import { Award, Calendar, Star, Sparkles, X } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import Logo from "../share/Logo"

interface CertificateModalProps {
    visible: boolean
    onClose: () => void
    onGoBack?: () => void
    userName?: string
    courseName?: string
    date?: string
}

const CertificateModal: React.FC<CertificateModalProps> = ({
    visible,
    onClose,
    onGoBack,
    userName = "Tên học viên",
    courseName = "",
    date,
}) => {
    const completionDate = date || new Date().toLocaleDateString("vi-VN")

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/60 justify-center items-center p-4">
                <View className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border-4 border-pink-300">
                    {/* Decorative Header */}
                    <LinearGradient
                        colors={["#F9A8D4", "#EC4899"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            padding: 24,       // p-6 (6 * 4px)
                            position: "relative",
                            borderRadius: 16,
                        }}
                    >
                        {/* Background Pattern */}
                        <View className="absolute top-0 right-0 w-20 h-20 opacity-20">
                            <Sparkles size={80} color="#fff" />
                        </View>
                        <View className="absolute bottom-0 left-0 w-16 h-16 opacity-10">
                            <Star size={64} color="#fff" />
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full"
                            activeOpacity={0.7}
                        >
                            <X size={20} color="#fff" />
                        </TouchableOpacity>

                        {/* Header Content */}
                        <View className="items-center">
                            <View className="bg-white/20 p-4 rounded-full mb-4">
                                <Award size={40} color="#fff" />
                            </View>
                            <Text className="text-white text-2xl font-bold text-center tracking-wide">XÁC NHẬN HOÀN THÀNH</Text>
                        </View>
                    </LinearGradient>

                    {/* Certificate Content */}
                    <View className="p-6 bg-gradient-to-b from-white to-pink-50">
                        {/* Decorative Border */}
                        <View className="border-t-2 border-b-2 border-pink-200 py-3 mb-6">
                            <Text className="text-gray-600 text-center text-sm italic leading-5">Văn bản này ghi nhận rằng</Text>
                        </View>

                        {/* Student Name */}
                        <View className="items-center mb-6">
                            <View className="bg-pink-50 rounded-2xl px-6 py-4 border-2 border-pink-200">
                                <Text className="text-gray-900 text-xl font-bold text-center">{userName}</Text>
                            </View>
                        </View>

                        {/* Course Completion Text */}
                        <Text className="text-gray-700 text-center text-base mb-4 leading-6">đã hoàn thành khóa học kỹ năng</Text>

                        {/* Course Name */}
                        <View className="bg-pink-100 rounded-2xl p-4 mb-6 border border-pink-300">
                            <Text className="text-pink-800 text-lg font-semibold text-center leading-6">{courseName}</Text>
                        </View>

                        {/* Achievement Message */}
                        <View className="bg-pink-50 rounded-2xl p-4 mb-6 border border-pink-200">
                            <Text className="text-pink-800 text-xl text-center leading-5">
                                🎉
                            </Text>
                            <Text className="text-pink-800 text-sm text-center leading-5">
                                Đây là sự ghi nhận cho tinh thần học hỏi và nỗ lực không ngừng của bạn trong suốt khóa học.
                            </Text>
                        </View>

                        {/* Footer Information */}
                        <View className="flex-row justify-between items-center mb-6 bg-pink-50 rounded-2xl p-4">
                            {/* Logo Section */}
                            <View className="items-center flex-1">
                                <Logo />

                            </View>

                            {/* Date Section */}
                            <View className="items-center flex-1">
                                <View className="bg-white p-3 rounded-xl shadow-sm border border-pink-200">
                                    <View className="flex-row items-center mb-1">
                                        <Calendar size={16} color="#E83E8C" />
                                        <Text className="text-pink-700 font-semibold text-sm ml-2">Ngày hoàn thành</Text>
                                    </View>
                                    <Text className="text-pink-600 text-center text-sm">{completionDate}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="space-y-3">
                            {/* Close Button */}
                            <TouchableOpacity onPress={() => {
                                onClose();
                                if (onGoBack) onGoBack();
                            }} className="rounded-2xl overflow-hidden shadow-md" activeOpacity={0.8}>
                                <LinearGradient
                                    colors={["#E83E8C", "#BE185D"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        padding: 16,
                                        alignItems: "center",
                                        borderRadius: 12,
                                    }}
                                >
                                    <Text className="text-white font-bold text-lg">Hoàn thành</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Decorative Bottom Border */}
                    <LinearGradient
                        colors={["#F9A8D4", "#EC4899"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            height: 8,
                            width: "100%",
                            borderRadius: 4,
                        }}
                    />

                </View>
            </View>
        </Modal>
    )
}

export default CertificateModal
