"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Star, Gift, ArrowRight, Crown, Sparkles, Zap } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import membershipApi from "@/src/config/api/membership.api"
import type { MembershipStatus } from "@/src/config/types/membership.type"
import Loading from "../share/Loading"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width - 32 // Account for horizontal padding

const MembershipPromoPanel = () => {
    const navigation = useNavigation<any>()
    const [loading, setLoading] = useState(true)
    const [membershipList, setMembershipList] = useState<MembershipStatus[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null)

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                setLoading(true)
                const res = await membershipApi.getMyMembershipStatus()
                if (res.success && res.data) {
                    setMembershipList(res.data)
                }
            } catch (err) {
                setMembershipList([])
            } finally {
                setLoading(false)
            }
        }
        fetchMemberships()
    }, [])

    // Auto-slide effect
    useEffect(() => {
        if (membershipList.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % membershipList.length
                    scrollViewRef.current?.scrollTo({
                        x: nextIndex * CARD_WIDTH,
                        animated: true,
                    })
                    return nextIndex
                })
            }, 10000) // Auto-slide every 4 seconds

            return () => clearInterval(interval)
        }
    }, [membershipList.length])

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x
        const index = Math.round(scrollPosition / CARD_WIDTH)
        setCurrentIndex(index)
    }

    const navigateToMembership = () => {
        navigation.navigate("ProfileTab", { screen: "Membership" })
    }

    const getGradientColors = (index: number): [string, string, ...string[]] => {
        const gradients: [string, string, ...string[]][] = [
            ["#8B5CF6", "#A78BFA", "#E83E8C"],
            ["#E83E8C", "#FF6B9D", "#FFD700"],
            ["#FFD700", "#FFA500", "#FF6B9D"],
        ];
        return gradients[index % gradients.length];
    }

    const getIcon = (index: number) => {
        const icons = [Crown, Sparkles, Zap]
        const IconComponent = icons[index % icons.length]
        return <IconComponent size={32} color="#fff" />
    }

    if (loading) {
        return (
            <View className="bg-white rounded-3xl shadow-lg p-8 mb-6 items-center">
                <View className="w-16 h-16 bg-pink-50 rounded-full items-center justify-center mb-4">
                    <Loading size={30} color="#E83E8C" />
                </View>
                <Text className="text-gray-600 font-medium">Đang tải gói thành viên...</Text>
            </View>
        )
    }

    if (membershipList.length === 0) {
        return (
            <View className="bg-white rounded-3xl shadow-lg p-8 mb-6 items-center">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <Crown size={32} color="#9CA3AF" />
                </View>
                <Text className="text-gray-700 font-bold text-lg mb-2">Chưa có gói thành viên</Text>
                <Text className="text-gray-500 text-center mb-4">Các gói thành viên sẽ được cập nhật sớm</Text>
            </View>
        )
    }

    return (
        <View className="mb-6">
            {/* Carousel */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}

            >
                {membershipList.map((item, index) => (
                    <TouchableOpacity
                        key={item.memberShip.id}
                        onPress={navigateToMembership}
                        activeOpacity={0.9}
                        style={{ width: CARD_WIDTH }}
                        className=""
                    >
                        <LinearGradient
                            colors={getGradientColors(index)}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 24,
                                height: 250,
                                shadowColor: "#000",
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                overflow: "hidden"
                            }}
                        >

                            {/* Background Pattern */}
                            <View className="absolute top-0 right-0 w-32 h-32 opacity-20">
                                <LinearGradient
                                    colors={["rgba(255,255,255,0.3)", "transparent"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        width: "100%",       // w-full
                                        height: "100%",      // h-full
                                        borderRadius: 9999,  // rounded-full
                                    }}
                                />

                            </View>
                            <View className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                                <LinearGradient
                                    colors={["rgba(255,255,255,0.2)", "transparent"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        width: "100%",       // w-full
                                        height: "100%",      // h-full
                                        borderRadius: 9999,  // rounded-full
                                    }}
                                />

                            </View>

                            {/* Content */}
                            <View className="flex-1 p-6 justify-between">
                                {/* Header */}
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <View className="bg-white/20 p-3 rounded-2xl mr-3">{getIcon(index)}</View>
                                        <View>
                                            <Text className="text-white text-xl font-bold" numberOfLines={1}>
                                                {item.memberShip.memberShipName}
                                            </Text>
                                            {item.isActive && (
                                                <View className="bg-white/20 rounded-full px-3 py-1 mt-1">
                                                    <Text className="text-white text-xs font-semibold">✓ Đang sử dụng</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                {/* Benefits */}
                                <View className="my-4">
                                    <Text className="text-white/90 text-base leading-6 mb-2">
                                        {item.memberShip.price === 0
                                            ? "Miễn phí"
                                            : `${item.memberShip.price.toLocaleString("vi-VN")}đ/tháng`}
                                    </Text>
                                    <View className="flex-row items-center mb-2">
                                        <Star size={16} color="#FFD700" fill="#FFD700" />
                                        <Text className="text-white/90 text-sm ml-2">Giảm {item.memberShip.discountCourse}% học phí</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Gift size={16} color="#FFD700" />
                                        <Text className="text-white/90 text-sm ml-2">
                                            Giảm {item.memberShip.discountBooking}% phí tư vấn
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Gift size={16} color="#FFD700" />
                                        <Text className="text-white/90 text-sm ml-2">
                                            Miễn phí cho các khóa học dành riêng cho gói thành viên 
                                        </Text>
                                    </View>
                                </View>

                                {/* CTA Button */}
                                <TouchableOpacity
                                    onPress={navigateToMembership}
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-row items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white font-bold text-base mr-2">
                                        {item.isActive ? "Quản lý gói" : "Nâng cấp ngay"}
                                    </Text>
                                    <ArrowRight size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Dots Indicator */}
            {membershipList.length > 1 && (
                <View className="flex-row justify-center mt-4 space-x-2">
                    {membershipList.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setCurrentIndex(index)
                                scrollViewRef.current?.scrollTo({
                                    x: index * CARD_WIDTH,
                                    animated: true,
                                })
                            }}
                            activeOpacity={0.7}
                        >
                            <View
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-pink-500" : "w-2 bg-gray-300"
                                    }`}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Promotional Banner */}
            <View className="mx-4 mt-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200">
                <View className="flex-row items-center">
                    <View className="bg-pink-100 p-2 rounded-xl mr-3">
                        <Gift size={20} color="#E83E8C" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-pink-800 font-bold text-base">Ưu đãi đặc biệt!</Text>
                        <Text className="text-pink-700 text-sm">Miễn phí gói thành viên cho người dùng mới</Text>
                    </View>
                    <TouchableOpacity
                        onPress={navigateToMembership}
                        className="bg-pink-500 rounded-xl px-4 py-2"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-semibold text-sm">Nhận ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default MembershipPromoPanel
