"use client";

import { apiClient } from "@/lib/api";

// Luna OTP Types
export interface LunaOtpSuccessResponse {
  success: true;
  message: string;
  results: Record<string, string>;
}
export interface LunaOtpErrorResponse {
  detail: string;
}
export type LunaOtpResponse = LunaOtpSuccessResponse | LunaOtpErrorResponse;
export const generateLunaOtp = async () => {
  const response: LunaOtpResponse = await apiClient.post(`/luna_otp`, {});
  return response;
};
