export interface WalletBalanceResponse {
  success: boolean
  data: WalletBalanceData
  error: string | null
}

export interface WalletBalanceData {
  remaining: number
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  success: boolean
  data: string | null
  error: string | null
}
