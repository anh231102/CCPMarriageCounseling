export interface WalletBalanceResponse {
  success: boolean
  data: WalletBalanceData
  error: string | null
}

export interface WalletBalanceData {
  remaining: number
}
