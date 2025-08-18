"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity, Modal } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { RouteProp, useFocusEffect } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Star, PlayCircle, ArrowRight, CheckCircle, Gift, CreditCard, X } from "lucide-react-native"
import courseApi from "../../config/api/course.api"
import type { Course, Chapter, CourseDetail } from "../../config/types/course.type"
import { CourseDescription } from "../../components/courses/CourseDescription"
import { CourseLearningOutcomes } from "../../components/courses/CourseLearningOutcomes"
import { CourseContentList } from "../../components/courses/CourseContentList"
import { CourseReviews } from "../../components/courses/CourseReviews"
import { RelatedCourses } from "../../components/courses/RelatedCourses"
import CustomButton from "../../components/CustomButton"
import Loading from "@/src/components/share/Loading"
import { CourseRatingForm } from "@/src/components/courses/CourseRatingForm"
import CourseListMini from "@/src/components/courses/CourseListMini"
import { LinearGradient } from "expo-linear-gradient";
type CoursesStackParamList = {
  CourseList: undefined
  CourseDetail: { courseId: string; initialCourse?: Course }
  CourseContent: { chapterId: string; isEnrolled?: boolean; courseId: string }
}

type CourseDetailScreenRouteProp = RouteProp<CoursesStackParamList, "CourseDetail">


export const CourseDetailScreen = () => {
  const route = useRoute<CourseDetailScreenRouteProp>()
  const navigation = useNavigation<any>()
  const { courseId, initialCourse } = route.params
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewReloadKey, setReviewReloadKey] = useState(0);


  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isEnrolled = course?.isEnrolled ?? initialCourse?.isEnrolled ?? true
  const isFree = initialCourse?.isFree ?? false
  const freeByMembershipName = initialCourse?.freeByMembershipName ?? ""
  const isBuy = course?.isBuy ?? initialCourse?.isBuy ?? true
  const openedChapters = course?.chapters?.filter(chap => chap.status === 1) ?? [];
  const chapterCount = openedChapters.length;
  const processingCount = openedChapters.filter(chap => chap.isDone).length;
  const Progress = chapterCount > 0 ? processingCount / chapterCount : 0;

  const fetchCourseDetails = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await courseApi.getCourseDetailById(courseId)
      setCourse(data)
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết khóa học.")
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useFocusEffect(
    useCallback(() => {
      fetchCourseDetails();
    }, [fetchCourseDetails])
  );

  const handleEnrollCourse = () => {
    setShowConfirmModal(true);
  };

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
    <>
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
            {/* Header with gradient */}
            <LinearGradient
              colors={["#E83E8C", "#FF6B9D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 24, // tương đương p-6
                borderRadius: 12
              }}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-bold">Xác nhận đăng ký</Text>
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  className="bg-white/20 p-2 rounded-full"
                  activeOpacity={0.7}
                >
                  <X size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Course Image */}
              <View className="items-center">
                <View className="bg-white/10  rounded-2xl">
                  <Image
                    source={{ uri: course.thumble || "https://via.placeholder.com/120x120.png?text=Course" }}
                    className="w-56 h-48 rounded-xl"
                  />
                </View>
              </View>
            </LinearGradient>

            {/* Content */}
            <View className="p-6">
              {/* Course Name */}
              <Text className="text-gray-900 font-bold text-xl text-center mb-4 leading-6">{course.name}</Text>

              {/* Course Details */}
              <View className="space-y-3 mb-6">
                {/* Membership Benefit */}
                {freeByMembershipName && (
                  <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
                    <View className="flex-row items-center">
                      <View className="bg-green-100 p-2 rounded-xl mr-3">
                        <Gift size={18} color="#10B981" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-green-800 font-semibold text-sm">Ưu đãi thành viên</Text>
                        <Text className="text-green-700 text-sm">Miễn phí cho: {freeByMembershipName}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Price Information */}
                <View className="bg-gray-50 rounded-2xl p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="bg-pink-100 p-2 rounded-xl mr-3">
                        <CreditCard size={18} color="#E83E8C" />
                      </View>
                      <Text className="text-gray-700 font-medium">Giá khóa học</Text>
                    </View>
                    <View className="items-end">
                      {course.price === 0 ? (
                        <View className="bg-green-500 rounded-full px-3 py-1">
                          <Text className="text-white font-bold text-sm">Miễn phí</Text>
                        </View>
                      ) : (
                        <Text className="text-pink-600 font-bold text-lg">{course.price?.toLocaleString("vi-VN")}đ</Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={async () => {
                    setShowConfirmModal(false);
                    try {
                      await courseApi.postBuyCourse(course.id);
                      Alert.alert("Thành công! 🎉", "Bạn đã đăng ký khóa học thành công!", [{ text: "Tuyệt vời!", style: "default" }]);
                      setCourse((prev) => prev ? { ...prev, isEnrolled: true, isBuy: true } : null);
                      if (course.chapters && course.chapters.length > 0) {
                        navigation.navigate("ProfileTab", { screen: "MyCourseList" });
                      }
                    } catch (err: any) {
                      let errorMsg = "Đăng ký khóa học thất bại!";
                      if (err.response && (err.response.data?.error || err.response.data?.message)) {
                        errorMsg = err.response.data.error || err.response.data.message;
                      }
                      if (errorMsg.toLowerCase().includes("số dư") || errorMsg.toLowerCase().includes("ví không đủ")) {
                        Alert.alert(
                          "Thông báo",
                          errorMsg,
                          [
                            {
                              text: "Nạp tiền vào ví",
                              onPress: () => navigation.navigate("ProfileTab", { screen: "Wallet" }),
                            },
                            { text: "Hủy", style: "cancel" },
                          ]
                        );
                      } else {
                        Alert.alert("Thông báo", errorMsg);
                      }
                    }
                  }}
                  activeOpacity={0.8}
                  className="overflow-hidden rounded-2xl"
                >
                  <LinearGradient
                    colors={["#E83E8C", "#FF6B9D"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      padding: 15,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      height: 55, // thêm kích thước cụ thể
                      width: "100%"
                    }}
                  >

                    <Text className="text-white font-bold items-center text-lg ml-2">Đăng ký ngay</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  className="bg-gray-100 py-4 px-6 rounded-2xl mt-2 flex-row items-center justify-center"
                  activeOpacity={0.7}
                >

                  <Text className="text-gray-700 font-semibold text-lg ml-2">Hủy bỏ</Text>
                </TouchableOpacity>
              </View>

              {/* Helper Text */}
              <View className="mt-4 bg-blue-50 rounded-2xl p-4">
                <Text className="text-blue-700 text-sm text-center leading-5">
                  💡 <Text className="font-semibold">Lưu ý:</Text> Sau khi đăng ký thành công, bạn có thể truy cập khóa
                  học ngay lập tức trong mục "Khóa học của tôi".
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView className="flex-1 bg-gray-100">
        <Image
          source={{ uri: course.thumble || "https://via.placeholder.com/400x200.png?text=No+Image" }}
          className="w-full h-52"
        />
        <View className="p-4 bg-white shadow-sm mb-4">
          <Text className="text-2xl font-bold text-secondary-dark mb-1">{course.name}</Text>
          {(!isEnrolled && !isBuy) && (
            <>
              {freeByMembershipName && (
                <View className="bg-green-50 rounded-2xl p-4 mb-2 border border-green-200">
                  <View className="flex-row items-center">
                    <View className="bg-green-100 p-2 rounded-xl mr-3">
                      <Gift size={18} color="#10B981" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-green-800 font-semibold text-sm">Ưu đãi thành viên</Text>
                      <Text className="text-green-700 text-sm">Miễn phí cho: {freeByMembershipName}</Text>
                    </View>
                  </View>
                </View>
              )}
              <View className="flex-row items-center mb-2">
                <Star size={20} color="#FFC107" fill="#FFC107" />
                <Text className="text-secondary-dark ml-1 text-base">{course.rating?.toFixed(1) || 0}</Text>
                <Text className="text-gray-500 text-sm ml-2">({course.rank || 0} xếp hạng)</Text>
              </View>
              <Text className="text-primary font-bold text-xl mb-4">
                {course.price === 0 ? `Miễn phí ` : `${course.price?.toLocaleString("vi-VN")}đ`}
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
        <CourseReviews CourseId={course.id} openReviewForm={true} reloadKey={reviewReloadKey} />
        {isEnrolled && (
          <>
            <View className="p-4  shadow-sm mb-4">
              <CourseRatingForm courseId={course.id} Progress={Progress} onSuccess={() => setReviewReloadKey(prev => prev + 1)} />
            </View>
          </>
        )}
        {!isEnrolled && (
          <>
            <View className="mt-6 px-4 mb-3">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-secondary-dark">Khóa học nổi bật</Text>
                <TouchableOpacity onPress={() =>
                  navigation.navigate("CourseList")
                } className="flex-row items-center">
                  <Text className="text-primary mr-1">Xem tất cả</Text>
                  <ArrowRight size={16} color="#E83E8C" />
                </TouchableOpacity>
              </View>

              {loading ? (
                <Loading size={30} />
              ) : (
                <CourseListMini />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </>
  )
}
export default CourseDetailScreen