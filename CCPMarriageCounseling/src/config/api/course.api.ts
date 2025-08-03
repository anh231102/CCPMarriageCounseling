import axiosInstance from "./axiosInstance"
import type {
  CourseResponse,
  CourseDetailResponse,
  ChapterDetailResponse,
  MarkChapterDoneResponse,
  BuyCourseResponse,
  EnrollCourseResponse,
  CourseReview,
  CourseReviewResponse,
  PostCourseRatingRequest,
  PostCourseRatingResponse,
} from "@/src/config/types/course.type"

const getAllCoursesForUser = async () => {
  const response = await axiosInstance.get<CourseResponse>("/Course/all-for-user")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách khóa học")
  }

  return response.data.data
}

const getCourseById = async (courseId: string) => {
  const response = await axiosInstance.get<CourseDetailResponse>(`/Course/${courseId}`)

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy chi tiết khóa học")
  }

  return response.data.data
}

const getChapterDetail = async (chapterId: string) => {
  const response = await axiosInstance.get<ChapterDetailResponse>(`/Course/${chapterId}/chapter-detail`)

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy chi tiết chương học")
  }

  return response.data.data
}

const getMyCourses = async () => {
  const response = await axiosInstance.get<CourseResponse>("/Course/my-courses")

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy danh sách khóa học đã ghi danh")
  }

  return response.data.data
}

const getCourseDetailById = async (courseId: string) => {
  const response = await axiosInstance.get<CourseDetailResponse>(`/Course/${courseId}/detail-for-member`)

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy chi tiết khóa học")
  }

  return response.data.data
}

const markChapterAsDone = async (chapterId: string): Promise<string> => {
  const response = await axiosInstance.post<MarkChapterDoneResponse>(`/Processing/${chapterId}`)

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể đánh dấu chương học là hoàn thành")
  }

  return response.data.data
}

const postBuyCourse = async (courseId: string): Promise<BuyCourseResponse["data"]> => {
  const response = await axiosInstance.post<BuyCourseResponse>(`/Course/${courseId}/buy`, {
    courseId,
  })

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể mua khóa học")
  }

  return response.data.data
}

const putEnrollCourse = async (courseId: string): Promise<string> => {
  const response = await axiosInstance.put<EnrollCourseResponse>(`/Course/enroll/${courseId}`, {
    courseId,
  })

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể ghi danh khóa học")
  }

  return response.data.data
}

const getCourseReviews = async (courseId: string): Promise<CourseReview[]> => {
  const response = await axiosInstance.get<CourseReviewResponse>(
    `/Course/reviews/${courseId}`
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể lấy đánh giá khóa học")
  }

  return response.data.data
}

const postCourseRating = async (
  courseId: string,
  rating: number,
  feedback: string
): Promise<string> => {
  const payload: PostCourseRatingRequest = { rating, feedback }

  const response = await axiosInstance.post<PostCourseRatingResponse>(
    `/Course/rate/${courseId}`,
    payload
  )

  if (!response.data.success) {
    throw new Error(response.data.error || "Không thể gửi đánh giá khóa học")
  }

  return response.data.data
}

const courseApi = {
  getAllCoursesForUser,
  getCourseById,
  getChapterDetail,
  getMyCourses,
  getCourseDetailById,
  markChapterAsDone,
  postBuyCourse,
  putEnrollCourse,
  getCourseReviews,
  postCourseRating
}

export default courseApi
