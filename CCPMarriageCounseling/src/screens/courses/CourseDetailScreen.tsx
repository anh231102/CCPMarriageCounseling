"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, ScrollView, Image, ActivityIndicator, Alert } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Star, PlayCircle } from "lucide-react-native"
import courseApi from "../../config/api/course.api"
import type { Course, Chapter, CourseDetail } from "../../config/types/course.type"
import { CourseDescription } from "../../components/courses/CourseDescription"
import { CourseLearningOutcomes } from "../../components/courses/CourseLearningOutcomes"
import { CourseContentList } from "../../components/courses/CourseContentList"
import { CourseReviews } from "../../components/courses/CourseReviews"
import { RelatedCourses } from "../../components/courses/RelatedCourses"
import CustomButton from "../../components/CustomButton"
import Loading from "@/src/components/share/Loading"

type CoursesStackParamList = {
  CourseList: undefined
  CourseDetail: { courseId: string; initialCourse?: Course }
  CourseContent: { chapterId: string; isEnrolled?: boolean; courseId: string }
}

type CourseDetailScreenRouteProp = RouteProp<CoursesStackParamList, "CourseDetail">
type CourseDetailScreenNavigationProp = NativeStackNavigationProp<CoursesStackParamList, "CourseDetail">

export const CourseDetailScreen = () => {
  const route = useRoute<CourseDetailScreenRouteProp>()
  const navigation = useNavigation<CourseDetailScreenNavigationProp>()
  const { courseId, initialCourse } = route.params




  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isEnrolled = course?.isEnrolled ?? initialCourse?.isEnrolled ?? true
  const isFree = initialCourse?.isFree ?? false
  const freeByMembershipName = initialCourse?.freeByMembershipName ?? ""
  const isBuy = initialCourse?.isBuy ?? true

  const fetchCourseDetails = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await courseApi.getCourseById(courseId)
      setCourse(data)
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết khóa học.")
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchCourseDetails()
  }, [fetchCourseDetails])

  const handleEnrollCourse = async () => {
    if (!course) return

    Alert.alert(
      "Xác nhận đăng ký",
      `Bạn có muốn đăng ký khóa học "${course.name}" với giá ${course.price === 0 || isFree ? "Miễn phí" : `${course.price?.toLocaleString("vi-VN")}đ`}?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng ký",
          onPress: async () => {
            try {
              await courseApi.postBuyCourse(course.id)
              Alert.alert("Thành công", "Bạn đã đăng ký khóa học thành công!")
              setCourse((prev) => prev ? { ...prev, isEnrolled: true, isBuy: true } : null)
              if (course.chapters && course.chapters.length > 0) {
                navigation.navigate("CourseContent", {
                  courseId: course.id,
                  chapterId: course.chapters[0].id,
                  isEnrolled: true,
                })
              }
            } catch (err: any) {
              Alert.alert("Lỗi", err?.message || "Đăng ký khóa học thất bại!")
            }
          },
        },
      ]
    )
  }

  const handlePressChapter = (chapter: Chapter) => {
    if (chapter.status === 1 || chapter.status === null) {
      navigation.navigate("CourseContent", { chapterId: chapter.id, isEnrolled, courseId })
    } else {
      courseId
      Alert.alert("Khóa học bị khóa", "Vui lòng đăng ký khóa học để xem nội dung này.")
    }
  }

  const handleRelatedCoursePress = (relatedCourse: Course) => {
    navigation.push("CourseDetail", {
      courseId: relatedCourse.id,
      initialCourse: relatedCourse,

    })

  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Loading size={60} />
        <Text className="mt-2 text-secondary-dark">Đang tải chi tiết khóa học...</Text>
      </View>
    )
  }

  if (error || !course) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <Text className="text-red-500 text-center text-base">{error || "Không tìm thấy khóa học."}</Text>
        <Text className="text-secondary-dark text-center mt-2">Vui lòng thử lại sau.</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <Image
        source={{ uri: course.thumble || "https://via.placeholder.com/400x200.png?text=No+Image" }}
        className="w-full h-52"
      />
      <View className="p-4 bg-white shadow-sm mb-4">
        <Text className="text-2xl font-bold text-secondary-dark mb-1">{course.name}</Text>
        {(!isEnrolled && !isBuy) && (
          <>
            <Text className="text-primary text-base mb-1">
              Miễn phí cho người đã đăng ký: {freeByMembershipName}
            </Text>
            <View className="flex-row items-center mb-2">
              <Star size={20} color="#FFC107" fill="#FFC107" />
              <Text className="text-secondary-dark ml-1 text-base">{course.rating?.toFixed(1) || "N/A"}</Text>
              <Text className="text-gray-500 text-sm ml-2">({course.rank || 0} xếp hạng)</Text>
            </View>
            <Text className="text-primary font-bold text-xl mb-4">
              {course.price === 0 || isFree ? `Miễn phí ` : `${course.price?.toLocaleString("vi-VN")}đ`}
            </Text>
            <CustomButton
              onPress={handleEnrollCourse}
              className="bg-primary py-3 rounded-lg"
            >
              Đăng ký khóa học
            </CustomButton>
          </>)}

      </View>

      <CourseDescription description={course.description} />
      <CourseLearningOutcomes />
      <CourseContentList
        chapters={course.chapters}
        isEnrolled={isEnrolled}
        onPressChapter={handlePressChapter}
      />
      <CourseReviews />
      {!isEnrolled && (
        <>
          <RelatedCourses currentCourseId={course.id} onPressCourse={handleRelatedCoursePress} />
          <View className="h-8" />
        </>
      )}
    </ScrollView>
  )
}
export default CourseDetailScreen