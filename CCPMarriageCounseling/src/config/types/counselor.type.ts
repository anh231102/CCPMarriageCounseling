import { SubCategory } from "./categories.type"

export interface Counselor {
  id: string
  fullname: string
  avatar: string | null
  description: string | null
  phone: string | null
  status: number
  price: number
  rating: number
  reviews: number
  yearOfJob: number
  isBookingAvailible: boolean
  subCategories: SubCategory[]
}

export interface CounselorResponse {
  success: boolean
  data: Counselor[]
  error: string | null
}
