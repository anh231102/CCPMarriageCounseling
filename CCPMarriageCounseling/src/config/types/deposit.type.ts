// deposit.type.ts

export interface DepositRequest {
  amount: number; // Số tiền nạp (VND)
}

export interface DepositResponse {
  success: boolean;
  data: string; // URL thanh toán VNPAY trả về
  error: string | null;
}
