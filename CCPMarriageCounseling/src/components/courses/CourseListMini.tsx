"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { FlatList, TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Star, Users, Clock, BookOpen, Gift } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import courseApi from "@/src/config/api/course.api"
import type { Course } from "@/src/config/types/course.type"
import Loading from "../share/Loading"

const CourseListMini: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigation = useNavigation<any>()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseApi.getAllCoursesForUser()
                const notBoughtCourses = data.filter(course => !course.isBuy)
                // Sắp xếp theo rating giảm dần
                notBoughtCourses.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                setCourses(notBoughtCourses)
            } catch (err: any) {
                setError("Không thể tải danh sách khóa học")
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [])

    const formatRating = (rating: number | null | undefined) => {
        if (!rating) return "0.0"
        return (Math.round(rating * 10) / 10).toFixed(1)
    }

    const formatPrice = (price: number | null | undefined) => {
        if (!price || price === 0) return "Miễn phí"
        return `${price.toLocaleString("vi-VN")}đ`
    }

    const getRatingColor = (rating: number | null | undefined) => {
        if (!rating) return "#9CA3AF"
        if (rating >= 4.5) return "#10B981"
        if (rating >= 4.0) return "#F59E0B"
        if (rating >= 3.0) return "#EF4444"
        return "#9CA3AF"
    }

    const getChapterCount = (course: Course) => {
        if (!course.chapters || course.chapters.length === 0) return 0
        // Chỉ lấy những chapter có status === 1
        const validChapters = course.chapters.filter(chap => chap.status === 1)
        const nums = validChapters.map(chap => chap.chapNum)
        const maxNum = nums.length > 0 ? Math.max(...nums) : 0
        return maxNum
    }

    if (loading) {
        return (
            <View className="py-8 items-center">
                <View className="bg-white rounded-2xl p-6 shadow-sm items-center">
                    <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mb-3">
                        <Loading size={30} color="#E83E8C" />
                    </View>
                    <Text className="text-gray-600 font-medium">Đang tải khóa học...</Text>
                </View>
            </View>
        )
    }

    if (error) {
        return (
            <View className="py-8 items-center">
                <View className="bg-white rounded-2xl p-6 shadow-sm items-center">
                    <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-3">
                        <BookOpen size={24} color="#EF4444" />
                    </View>
                    <Text className="text-red-600 font-medium">{error}</Text>
                </View>
            </View>
        )
    }

    return (
        <FlatList
            data={courses.filter(course => getChapterCount(course) > 0)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("CoursesTab", {
                            screen: "CourseDetail",
                            params: { courseId: item.id, initialCourse: item },
                        })
                    }
                    className="mr-4 bg-white rounded-2xl shadow-sm overflow-hidden"
                    style={{ width: 200 }}
                    activeOpacity={0.8}
                >
                    {/* Course Image */}
                    <View className="relative">
                        <Image
                            source={{ uri: item.thumble || "https://placehold.co/200x120?text=Course" }}
                            className="w-full h-28 bg-gray-100"
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.3)"]}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 48, // h-12
                            }}
                        />


                        {/* Price Badge */}
                        <View className="absolute top-3 right-3">
                            {item.price === 0 ? (
                                <View className="bg-green-500 rounded-full px-3 py-1 flex-row items-center">
                                    <Gift size={12} color="#fff" />
                                    <Text className="text-white text-xs font-bold ml-1">Miễn phí</Text>
                                </View>
                            ) : (
                                <View className="bg-pink-500 rounded-full px-3 py-1">
                                    <Text className="text-white text-xs font-bold">{formatPrice(item.price)}</Text>
                                </View>
                            )}
                        </View>

                        {/* Rating Badge */}
                        <View className="absolute bottom-3 left-3">
                            <View className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex-row items-center">
                                <Star size={12} color="#FFC107" fill="#FFC107" />
                                <Text className="text-gray-800 text-xs font-semibold ml-1">{formatRating(item.rating)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Course Content */}
                    <View className="p-4">
                        {/* Course Title */}
                        <Text
                            className="text-gray-900 font-bold text-base mb-3 leading-5 h-12"
                            numberOfLines={2}
                        >
                            {item.name}
                        </Text>

                        {/* Course Meta */}
                        <View className="space-y-2">
                            {/* Chapters Count */}
                            <View className="flex-row items-center">
                                <View className="bg-blue-50 p-1 rounded-lg mr-2">
                                    <BookOpen size={14} color="#3B82F6" />
                                </View>
                                <Text className="text-gray-600 text-sm flex-1">{getChapterCount(item)} chương học</Text>
                            </View>

                            {/* Students Count (if available) */}



                        </View>
                    </View>

                    {/* Bottom Accent */}
                    <LinearGradient
                        colors={["#E83E8C", "#FF6B9D"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 4 }} // h-1 = 4px
                    />

                </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
            ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center py-8">
                    <View className="bg-white rounded-2xl p-8 shadow-sm items-center">
                        <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <BookOpen size={32} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-500 font-medium text-lg mb-2">Chưa có khóa học nào</Text>
                        <Text className="text-gray-400 text-center text-sm">Khóa học sẽ được cập nhật sớm</Text>
                    </View>
                </View>
            )}
        />
    )
}

export default CourseListMini
