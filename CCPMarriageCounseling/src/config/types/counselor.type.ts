import { SubCategory } from "./category.type"

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
export interface RecommendedCounselorResponse {
  success: boolean
  data: Counselor[]
  error: string | null
}


export interface CounselorResponse {
  success: boolean
  data: Counselor[]
  error: string | null
}

export interface TimeSlot {
  start: string
  end: string
}

export interface DailyAvailableSchedule {
  workDate: string
  availableSlots: TimeSlot[]
}



export interface AvailableScheduleData {
  counselorId: string
  counselor: Counselor
  subCategories: SubCategory[]
  dailyAvailableSchedules: DailyAvailableSchedule[]
}

export interface AvailableScheduleResponse {
  success: boolean
  data: AvailableScheduleData
  error: any
}

export interface RecommendedCounselorByCoupleResponse {
  success: boolean
  data: Counselor[]
  error: string | null
}

export interface FilterState {
  minPrice: string
  maxPrice: string
  minYear: string
  maxYear: string
  selectedSubCategories: string[]
  rating: number;
}