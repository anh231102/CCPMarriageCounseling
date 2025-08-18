// Survey.type.ts
import { Brain, Zap, Heart, Star, Target, Settings } from "lucide-react-native"
import type { SurveyType } from "./persontype.type"

export interface SurveyTypeMeta {
  id: SurveyType
  name: string
  fullName: string
  fullNameVi: string
  shortTitle: string
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
    fullNameVi: "Chỉ số phân loại tính cách",
    shortTitle: "Đánh giá 16 loại tính cách dựa trên 4 cặp đối lập",
    icon: Brain,
    color: "#E83E8C",
    bgColor: "bg-primary/10",
    description: "Bài trắc nghiệm MBTI giúp bạn khám phá 16 nhóm tính cách khác nhau, từ đó hiểu rõ bản thân hơn về cách suy nghĩ, cảm xúc và hành động. Công cụ này hỗ trợ bạn trong việc phát triển cá nhân, cải thiện giao tiếp và định hướng nghề nghiệp phù hợp.",
  },
  {
    id: "SV002",
    name: "DISC",
    fullName: "DISC Assessment",
    fullNameVi: "Đánh giá phong cách hành vi",
    shortTitle: "Phân tích 4 phong cách hành vi chính trong giao tiếp và làm việc",
    icon: Zap,
    color: "#FFC107",
    bgColor: "bg-warning/10",
    description: "Trắc nghiệm DISC tập trung vào 4 nhóm hành vi chính (D – Dominance, I – Influence, S – Steadiness, C – Compliance). Đây là công cụ đơn giản nhưng hiệu quả để hiểu cách bạn phản ứng, giao tiếp và làm việc với người khác.",
  },
  {
    id: "SV003",
    name: "Love Languages",
    fullName: "The 5 Love Languages",
    fullNameVi: "5 ngôn ngữ tình yêu",
    shortTitle: "Khám phá 5 cách thể hiện và cảm nhận tình yêu",
    icon: Heart,
    color: "#E83E8C",
    bgColor: "bg-primary/10",
    description: "Trắc nghiệm Ngôn ngữ tình yêu (Love Languages) giúp bạn khám phá cách bản thân và người khác thể hiện cũng như đón nhận tình cảm. Hiểu được ‘ngôn ngữ tình yêu’ sẽ giúp cải thiện các mối quan hệ và gắn kết bền chặt hơn.",
  },
  {
    id: "SV004",
    name: "Big Five",
    fullName: "Big Five Personality Traits",
    fullNameVi: "5 yếu tố lớn của tính cách",
    shortTitle:"Đánh giá 5 khía cạnh chính của tính cách con người",
    icon: Star,
    color: "#28A745",
    bgColor: "bg-success/10",
    description: "Bài trắc nghiệm Big Five (OCEAN) đánh giá tính cách dựa trên 5 yếu tố cốt lõi: Sự cởi mở (Openness), Tận tâm (Conscientiousness), Hướng ngoại (Extraversion), Dễ chịu (Agreeableness) và Ổn định cảm xúc (Neuroticism). Đây là mô hình khoa học và phổ biến nhất để nghiên cứu và ứng dụng trong tâm lý học.",
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
