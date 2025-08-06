// Kiểu dữ liệu 1 bài viết
export interface PostItem {
  id: string
  createBy: string
  title: string
  description: string // Có thể chứa HTML
  image: string
  createAt: string
  status: number
}

// Response khi lấy nhiều bài viết
export interface PostListResponse {
  success: boolean
  data: PostItem[]
  error: string | null
}

// Response khi lấy 1 bài viết
export interface PostDetailResponse {
  success: boolean
  data: PostItem
  error: string | null
}
