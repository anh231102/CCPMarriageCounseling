// deposit.api.ts
import axiosInstance from "./axiosInstance";
import { DepositRequest, DepositResponse } from "@/src/config/types/deposit.type";

const createVnpayRequest = async (payload: DepositRequest): Promise<string> => {
  const response = await axiosInstance.post<DepositResponse>(
    "/Deposit/vnpay-request",
    payload
  );

  const data = response.data;

  if (!data.success) {
    throw new Error(data.error || "Yêu cầu tạo thanh toán VNPAY thất bại");
  }

  return data.data; // URL thanh toán
};

const depositApi = {
  createVnpayRequest,
};

export default depositApi;
