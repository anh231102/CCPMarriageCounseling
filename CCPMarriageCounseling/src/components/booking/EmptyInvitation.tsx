"use client"

import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native"
import { Users, Calendar, Clock, MessageCircle, Video, Phone, CheckCircle, XCircle } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import bookingApi from "@/src/config/api/booking.api"
import { type BookingMemberData } from "@/src/config/types/booking.type"
import Loading from "../share/Loading"

const getTypeIcon = (subCategories: any[]) => {
    if (!subCategories || subCategories.length === 0) return MessageCircle
    const name = subCategories[0].name.toLowerCase()
    if (name.includes("video")) return Video
    if (name.includes("thoại") || name.includes("call")) return Phone
    return MessageCircle
}
type EmptyInvitationProps = {
    onReloadHistory?: () => void;
};

const EmptyInvitation: React.FC<EmptyInvitationProps> = ({ onReloadHistory }) => {
    const [loading, setLoading] = useState(true)
    const [invitations, setInvitations] = useState<BookingMemberData[]>([])

    const fetchInvitations = async () => {
        setLoading(true)
        try {
            const data = await bookingApi.getBookingInvitations()
            setInvitations(data)
        } catch (err) {
            Alert.alert("Lỗi", "Không thể tải lời mời")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInvitations()
    }, [])

    const handleAccept = async (id: string) => {
        try {
            await bookingApi.postAcceptInvitation(id)
            Alert.alert("Thành công", "Bạn đã đồng ý tham gia buổi tư vấn.")
            fetchInvitations()
            onReloadHistory && onReloadHistory()
        } catch (err: any) {
            Alert.alert("Lỗi", err.message || "Không thể đồng ý tham gia")
        }
    }

    const handleDecline = async (id: string) => {
        try {
            await bookingApi.postDeclineInvitation(id)
            Alert.alert("Thành công", "Bạn đã từ chối lời mời.")
            fetchInvitations()
            onReloadHistory && onReloadHistory()
        } catch (err: any) {
            Alert.alert("Lỗi", err.message || "Không thể từ chối lời mời")
        }
    }

    if (loading) {
        return (
            <View className="items-center justify-center p-8 bg-white rounded-2xl shadow-sm mx-4 mt-4">
                <View className="w-16 h-16 bg-pink-50 rounded-full items-center justify-center mb-4">
                    <Loading size={40} color="#E83E8C" />
                </View>
                <Text className="text-gray-600 font-medium">Đang tải lời mời...</Text>
            </View>
        )
    }

    if (invitations.length === 0) {
        return (
            <View className="items-center justify-center p-8 bg-white rounded-2xl shadow-sm mx-4 mt-4">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <Users size={40} color="#9CA3AF" />
                </View>
                <Text className="text-gray-700 text-xl font-bold mb-2 text-center">Chưa có lời mời nào</Text>
                <Text className="text-gray-500 text-center">Các lời mời tư vấn sẽ hiển thị ở đây.</Text>
            </View>
        )
    }

    return (
        <ScrollView className="w-full " showsVerticalScrollIndicator={false}>
            {invitations.map((item) => {
                const IconComponent = getTypeIcon(item.subCategories)
                return (
                    <View key={item.id} className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
                        {/* Header with Inviter Info */}
                        <LinearGradient
                            colors={["#E83E8C", "#FF6B9D"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                padding: 20,
                                flexDirection: "row",
                                alignItems: "center",
                                borderRadius: 12,
                                width: "100%",    // hoặc số cụ thể
                                minHeight: 60     // tránh bị invisible nếu không có content
                            }}
                        >
                            <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center mr-4">
                                <Users size={32} color="#fff" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-lg text-white" numberOfLines={1}>
                                    {item.member.fullname}
                                </Text>
                                <Text className="text-white/80 text-sm mt-1">{item.member.phone || "Không có số điện thoại"}</Text>
                            </View>
                        </LinearGradient>

                        {/* Main Content */}
                        <View className="p-5">
                            {/* Counselor Info */}
                            <View className="mb-4 border-b border-gray-100 pb-4">
                                <Text className="font-bold text-base text-gray-800 mb-2">Chuyên gia tư vấn:</Text>
                                <Text className="text-gray-700 text-lg font-semibold">{item.counselor.fullname}</Text>
                                <Text className="text-gray-500 text-sm">{item.counselor.phone || "Không có số điện thoại"}</Text>
                            </View>

                            {/* Booking Details */}
                            <View className="mb-6 space-y-3">
                                <Text className="font-bold text-base text-gray-800 mb-2">Thông tin buổi tư vấn:</Text>
                                <View className="flex-row items-center">
                                    <View className="bg-blue-50 p-2 rounded-lg mr-3">
                                        <Calendar size={18} color="#3B82F6" />
                                    </View>
                                    <Text className="text-gray-700 text-base flex-1">
                                        {new Date(item.timeStart).toLocaleDateString("vi-VN")}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="bg-green-50 p-2 rounded-lg mr-3">
                                        <Clock size={18} color="#10B981" />
                                    </View>
                                    <Text className="text-gray-700 text-base flex-1">
                                        {new Date(item.timeStart).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}{" "}
                                        -{" "}
                                        {new Date(item.timeEnd).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="bg-purple-50 p-2 rounded-lg mr-3">
                                        <IconComponent size={18} color="#8B5CF6" />
                                    </View>
                                    <Text className="text-gray-700 text-base flex-1">
                                        {" Video call"}
                                    </Text>
                                </View>
                                <View className="bg-gray-50 rounded-xl p-4 mt-3">
                                    <Text className="text-gray-600 text-sm leading-5">
                                        <Text className="font-semibold">Ghi chú:</Text> {item.note || "Không có ghi chú."}
                                    </Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row justify-between mt-4 space-x-4">
                                <TouchableOpacity
                                    className="bg-pink-500 rounded-xl px-4 py-4 flex-1 mr-2 items-center"
                                    onPress={() => handleAccept(item.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white font-bold">Đồng ý tham gia</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-gray-200 rounded-xl px-4 py-4 flex-1 ml-2 items-center"
                                    onPress={() => handleDecline(item.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-gray-700 font-bold">Từ chối tham gia</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    )
}

export default EmptyInvitation
