// Survey list type
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

// ✅ Answer type
export interface Answer {
  id: string
  text: string
  score: number
  tag: string
}

// ✅ Question type
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
