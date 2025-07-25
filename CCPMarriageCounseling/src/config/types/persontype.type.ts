import { Category } from "./category.type"

//person.type.ts
export interface PersonType {
  id: string
  name: string
  description: string
  detail: string
  image: string
  surveyId: string
  scores: Record<string, number>
  categoryId?: string
  category?: Category
}

export interface PersonTypeResponse {
  success: boolean
  data: PersonType
  error: string | null
}


export interface PersonTypeHistoryItem {
  surveyId: string
  result: string
  description: string
  rawScores: string
  scores: Record<string, number>
  createAt: string
}

export interface PersonTypeHistoryResponse {
  success: boolean
  data: PersonTypeHistoryItem[]
  error: string | null
}

export type SurveyType = "SV001" | "SV002" | "SV003" | "SV004"
