export interface Chapter {
  id: string
  chapNum: number
  courseId: string
  name: string
  description: string | null
  chapterType: "Lecture" | "Quiz" | "Video"
  chapNo: string
  createAt: string
  status: number | null
  isDone: boolean
}

export interface SubCategory {
  id: string
  name: string
  status: number
}

export interface Course {
  id: string
  name: string
  thumble: string | null
  description: string | null
  price: number | null
  rating: number | null
  rank: number
  isEnrolled: boolean
  freeByMembershipName: string
  chapters: Chapter[]
  subCategories: SubCategory[] | null
  isFree: boolean
  isBuy: boolean
  isOpen: boolean
}

export interface CourseDetail {
  id: string
  name: string
  thumble: string | null
  description: string | null
  price: number | null
  rating: number | null
  rank: number
  chapterCount: number
  chapters: Chapter[]
  subCategories: SubCategory[]
  status: number
  isEnrolled: boolean
  processingCount: number


}

export interface CourseResponse {
  success: boolean
  data: Course[]
  error: string | null
}

export interface CourseDetailResponse {
  success: boolean
  data: CourseDetail
  error: string | null
}

export interface ChapterDetailResponse {
  success: boolean
  data: ChapterDetail
  error: string | null
}

export interface ChapterDetail {
  id: string
  name: string
  chapNum: number
  description: string | null
  chapterType: "Lecture" | "Quiz" | "Video"
  lecture: Lecture | null
  quiz: Quiz | null
  video: Video | null
  isDone: boolean
}

export interface Lecture {
  id: string
  name: string
  lectureMetadata: string
}

export interface Quiz {
  id: string
  name: string
  totalScore: number
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  description: string
  maxScore: number
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  id: string
  text: string
  score: number
}

export interface Video {
  id: string
  videoUrl: string
  description: string
  name: string
  timeVideo: string
}

export interface MarkChapterDoneResponse {
  success: boolean
  data: string 
  error: string | null
}

export interface BuyCourseResponse {
  success: boolean
  data: BuyCourseResult
  error: string | null
}

export interface BuyCourseResult {
  enrollCourseId: string
  paidAmount: number
  remaining: number
  transactionId: string | null
  message: string // ví dụ: "Đăng ký khóa học thành công."
}

export interface EnrollCourseResponse {
  success: boolean
  data: string // "Đã mở khóa học thành công."
  error: string | null
}

export interface CourseReview {
  rating: number
  feedback: string
  memberName: string
}

export interface CourseReviewResponse {
  success: boolean
  data: CourseReview[]
  error: string | null
}

export interface PostCourseRatingRequest {
  rating: number
  feedback: string
}

export interface PostCourseRatingResponse {
  success: boolean
  data: string // "Course rated successfully."
  error: string | null
}
