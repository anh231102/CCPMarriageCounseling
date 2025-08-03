import axiosInstance from "./axiosInstance"
import type {
  PostItem,
  PostListResponse,
  PostDetailResponse,
} from "../types/post.type"

// Lấy danh sách tất cả bài viết
export const getAllPosts = async (): Promise<PostItem[]> => {
  const res = await axiosInstance.get<PostListResponse>("/Post")

  if (!res.data.success) {
    throw new Error(res.data.error || "Lỗi khi tải danh sách bài viết")
  }

  return res.data.data
}

// Lấy chi tiết một bài viết theo ID
export const getPostById = async (id: string): Promise<PostItem> => {
  const res = await axiosInstance.get<PostDetailResponse>(`/Post/${id}`)

  if (!res.data.success) {
    throw new Error(res.data.error || "Lỗi khi tải chi tiết bài viết")
  }

  return res.data.data
}
const postApi = {
  getAllPosts,
  getPostById,
}

export default postApi