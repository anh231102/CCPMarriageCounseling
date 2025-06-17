export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  membershipType?: string
  isCouple?: boolean
  partnerId?: string
  interests?: string[]
  onboardingCompleted?: boolean
}