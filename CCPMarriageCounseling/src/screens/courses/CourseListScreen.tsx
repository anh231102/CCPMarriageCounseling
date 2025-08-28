"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, FlatList, ActivityIndicator, TextInput, RefreshControl, SafeAreaView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Filter, Search } from "lucide-react-native"
import courseApi from "../../config/api/course.api"
import type { Course } from "../../config/types/course.type"
import { CourseCard } from "../../components/courses/CourseCard"
import { PaginationControls } from "../../components/courses/PaginationControls"
import Loading from "@/src/components/share/Loading"
import { CourseFilterModal } from "../../components/courses/CourseFilterModal"
import type { SubCategory } from "@/src/config/types/category.type"


type CoursesStackParamList = {
  CourseList: undefined
  CourseDetail: { courseId: string; initialCourse?: Course }
}

type CourseListScreenNavigationProp = NativeStackNavigationProp<CoursesStackParamList, "CourseList">

const ITEMS_PER_PAGE = 6 // Number of courses to display per page


export const CourseListScreen = () => {
  const navigation = useNavigation<CourseListScreenNavigationProp>()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [filter, setFilter] = useState({
    minPrice: 0,
    maxPrice: 2000000,
    rating: 0,
    subCategory: null as string | null,
  })

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await courseApi.getAllCoursesForUser()
      setCourses(data)
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách khóa học.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchCourses()
  }, [fetchCourses])

  const filteredCourses = courses.filter(
    (course) =>
      !course.isEnrolled && !course.isBuy &&
      course.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (course.rating ?? 0) >= filter.rating &&
      (course.price ?? 0) >= filter.minPrice &&
      (course.price ?? 0) <= filter.maxPrice &&
      (filter.subCategory ? course.subCategories?.some(sub => sub.id === filter.subCategory) : true)
  )

  const getChapterCount = (course: Course) => {
    if (!course.chapters || course.chapters.length === 0) return 0
    // Chỉ lấy những chapter có status === 1
    const validChapters = course.chapters.filter(chap => chap.status === 1)
    const nums = validChapters.map(chap => chap.chapNum)
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0
    return maxNum
  }

  const validCourses = filteredCourses.filter(course => getChapterCount(course) > 0)
  const totalPages = Math.ceil(validCourses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCourses = validCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const allSubCategories: SubCategory[] = Array.from(
    new Map(
      courses
        .flatMap(c => c.subCategories || [])
        .map(sub => [sub.id, sub])
    ).values()
  )


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleCoursePress = (course: Course) => {
    navigation.navigate("CourseDetail", { courseId: course.id, initialCourse: course, })
  }

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Loading size={60} />
        <Text className="mt-2 text-secondary-dark">Đang tải khóa học...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <Text className="text-red-500 text-center text-base">{error}</Text>
        <Text className="text-secondary-dark text-center mt-2">Vui lòng kéo xuống để thử lại.</Text>
      </View>
    )
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row items-center p-4 bg-white shadow-sm">
          {/* Ô tìm kiếm */}
          <View className="flex-1 flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <Search size={20} color="#6C757D" />
            <TextInput
              className="flex-1 ml-2 text-secondary-dark"
              placeholder="Tìm kiếm khóa học..."
              placeholderTextColor="#6C757D"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Nút filter */}
          <View className="border border-gray-300 ml-3 p-2 rounded-lg py-4">
            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              className=""
            >
              <Filter size={22} color="#E83E8C" />
            </TouchableOpacity>
          </View>
        </View>


        {paginatedCourses.length === 0 && !loading ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-secondary-dark text-lg">Không tìm thấy khóa học nào.</Text>
            <Text className="text-gray-500 text-sm mt-2">Hãy thử tìm kiếm với từ khóa khác.</Text>
          </View>
        ) : (
          <FlatList
            data={paginatedCourses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CourseCard course={item} onPress={handleCoursePress} ofMyCourses="" />}
            contentContainerStyle={{ paddingVertical: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E83E8C"]} />}
          />
        )}

        {totalPages > 1 && (
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </SafeAreaView>
      <CourseFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filter={filter}
        setFilter={setFilter}
        subCategories={allSubCategories}
      />
    </>
  )
}
export default CourseListScreen