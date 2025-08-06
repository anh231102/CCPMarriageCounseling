// Survey.type.ts
import { Brain, Zap, Heart, Star, Target, Settings } from "lucide-react-native"
import type { SurveyType } from "./persontype.type"

export interface SurveyTypeMeta {
  id: SurveyType
  name: string
  fullName: string
  icon: any // React component
  color: string
  bgColor: string
  description?: string
}

export const surveyTypes: SurveyTypeMeta[] = [
  {
    id: "SV001",
    name: "MBTI",
    fullName: "Myers Briggs Type Indicator",
    icon: Brain,
    color: "#E83E8C",
    bgColor: "bg-primary/10",
    description: "Đánh giá 16 loại tính cách dựa trên 4 cặp đối lập",
  },
  {
    id: "SV002",
    name: "DISC",
    fullName: "DISC Assessment",
    icon: Zap,
    color: "#FFC107",
    bgColor: "bg-warning/10",
    description: "Phân tích 4 phong cách hành vi chính trong giao tiếp và làm việc",
  },
  {
    id: "SV003",
    name: "Love Languages",
    fullName: "The 5 Love Languages",
    icon: Heart,
    color: "#E83E8C",
    bgColor: "bg-primary/10",
    description: "Khám phá 5 cách thể hiện và cảm nhận tình yêu",
  },
  {
    id: "SV004",
    name: "Big Five",
    fullName: "Big Five Personality Traits",
    icon: Star,
    color: "#28A745",
    bgColor: "bg-success/10",
    description: "Đánh giá 5 khía cạnh chính của tính cách con người",
  },
]

export const getSurveyMetaById = (id: SurveyType) =>
  surveyTypes.find((s) => s.id === id)

export interface Survey {
  id: string
  name: string
  descriptione: string
  image: string
  createAt: string
  status: number
}

export interface SurveyResponse {
  success: boolean
  data: Survey[]
  error: string | null
}


export interface Answer {
  id: string
  text: string
  score: number
  tag: string
}


export interface Question {
  id: string
  description: string
  answers: Answer[]
}

export interface QuestionResponse {
  success: boolean
  data: Question[]
  error: string | null
}

export interface SurveyResultRequest {
  surveyId: string
  answers: {
    tag: string
    score: number
  }[]
}

export interface SurveyResultResponse {
  success: boolean
  data: string
  error: string | null
}
