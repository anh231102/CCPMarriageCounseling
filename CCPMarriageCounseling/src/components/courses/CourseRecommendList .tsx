import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Star, Award, Crown, Medal, Trophy } from "lucide-react-native"
import courseApi from "@/src/config/api/course.api"
import type { RecommendedCourse } from "@/src/config/types/course.type"
import Loading from "../share/Loading"

interface CourseRecommendListProps {
    coupleId?: string
}

const CourseRecommendList = ({ coupleId }: CourseRecommendListProps) => {
    const navigation = useNavigation<any>()
    const [data, setData] = useState<RecommendedCourse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                let res: RecommendedCourse[]
                if (coupleId) {
                    res = await courseApi.getRecommendationsByCouple(coupleId)
                } else {
                    res = await courseApi.getRecommendedCourses()
                }
                setData(res.slice(0, 5)) // chỉ lấy top 5
            } catch (err: any) {
                console.error("API error:", err)
                setError("Không thể tải danh sách gợi ý")
            } finally {
                setLoading(false)
            }
        }
        fetchRecommended()
    }, [coupleId])

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown size={20} color="#FFD700" />
            case 1: return <Medal size={20} color="#C0C0C0" />
            case 2: return <Trophy size={20} color="#CD7F32" />
            default: return <Award size={20} color="#6C757D" />
        }
    }

    const getRankBadge = (index: number) => {
        const badges = [
            { text: "TOP 1", bg: "bg-yellow-500", textColor: "text-white" },
            { text: "TOP 2", bg: "bg-gray-400", textColor: "text-white" },
            { text: "TOP 3", bg: "bg-orange-600", textColor: "text-white" },
        ]
        return badges[index] || { text: `TOP ${index + 1}`, bg: "bg-gray-300", textColor: "text-gray-700" }
    }

    const handleCoursePress = (course: RecommendedCourse) => {
        navigation.navigate("CoursesTab", {
            screen: "CourseDetail",
            params: { courseId: course.id, initialCourse: course },
        })
    }

    if (loading) {
        return (
            <View className="py-6 items-center">
                <Loading size={30} color="#E83E8C" />
                <Text className="text-secondary mt-2">Đang tải gợi ý...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View className="py-6 items-center">
                <Text className="text-danger text-sm">{error}</Text>
            </View>
        )
    }

    if (data.length === 0) {
        return (
            <View className="py-6 items-center ">
                <Text className="text-secondary">Không có khóa học gợi ý nào</Text>
            </View>
        )
    }

    return (
        <View className="px-4 mb-6 ">
            <View className="flex-row items-center mb-4">
                <View className="bg-primary/10 rounded-full p-2 mr-3">
                    <Star size={20} color="#E83E8C" />
                </View>
                <Text className="text-lg font-bold text-secondary-dark">
                    {coupleId ? "Khóa học được đề xuất cho cặp đôi" : "Khóa học được đề xuất"}
                </Text>
            </View>

            <View className="space-y-3 ">
                {data.map((course, index) => {
                    const rankBadge = getRankBadge(index)
                    return (
                        <View className="mb-4" key={course.id}>
                            <TouchableOpacity
                                key={course.id}
                                onPress={() => handleCoursePress(course)}
                                className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${index === 0 ? "border-yellow-500" : index === 1 ? "border-gray-400" : "border-orange-600"
                                    }`}
                            >
                                <View className="flex-row items-center">
                                    {/* Rank Badge */}
                                    <View className="items-center mr-4">
                                        <View className={`${rankBadge.bg} rounded-full px-2 py-1 mb-1`}>
                                            <Text className={`text-xs font-bold ${rankBadge.textColor}`}>{rankBadge.text}</Text>
                                        </View>
                                        {getRankIcon(index)}
                                    </View>

                                    {/* Avatar/Thumbnail */}
                                    <View className="relative mr-4">
                                        <Image
                                            source={
                                                course.thumble
                                                    ? { uri: course.thumble }
                                                    : require("../../../assets/images/ccp-logo.png") // hoặc ảnh local mặc định
                                            }
                                            className="w-16 h-16 rounded-xl"
                                        />
                                        {index === 0 && (
                                            <View className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                                <Crown size={12} color="white" />
                                            </View>
                                        )}
                                    </View>

                                    {/* Info */}
                                    <View className="flex-1">
                                        <Text className="text-secondary-dark font-bold text-base mb-1">{course.name}</Text>
                                        <Text className="text-secondary text-sm mb-2" numberOfLines={2}>
                                            {course.description}
                                        </Text>
                                        <Text className="text-secondary text-xs mb-2">
                                            {course.subCategories.map((cat) => cat.name).slice(0, 2).join(", ") +
                                                (course.subCategories.length > 2 ? "..." : "")}
                                        </Text>
                                        <View className="flex-row items-center mb-2">
                                            <Star size={14} color="#FFC107" fill="#FFC107" />
                                            <Text className="text-secondary-dark ml-1 font-medium">{course.rating?.toFixed(1) ?? "?"}</Text>
                                            <Text className="text-secondary text-xs ml-1">({course.reviews ?? 0} đánh giá)</Text>
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-primary font-bold">{course.price?.toLocaleString("vi-VN") ?? "Miễn phí"}đ</Text>
                                        </View>
                                        <View className="bg-primary/10 rounded-full px-3 py-1 w-32 mt-2">
                                            <Text className="text-primary text-xs font-medium">
                                                {index === 0 ? "Phù hợp nhất" : index === 1 ? "Kinh nghiệm cao" : "Đánh giá tốt"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {index === 0 && (
                                    <View className="mt-3 pt-3 border-t border-gray-100">
                                        <View className="flex-row items-center">
                                            <View className="bg-yellow-500/10 rounded-full p-1 mr-2">
                                                <Star size={12} color="#FFD700" />
                                            </View>
                                            <Text className="text-yellow-600 text-xs font-medium">
                                                Được đề xuất hàng đầu dựa trên hồ sơ của bạn
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>

            {/* View All */}
            <TouchableOpacity
                onPress={() => navigation.navigate("CoursesTab")}
                className="mt-4 bg-primary/5 rounded-xl p-4 items-center"
            >
                <Text className="text-primary font-medium">Xem tất cả khóa học</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CourseRecommendList