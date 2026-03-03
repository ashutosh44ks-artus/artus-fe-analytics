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
export const generateLunaOtp = async (): Promise<LunaOtpSuccessResponse> => {
  return await apiClient.post<LunaOtpSuccessResponse>(`/luna_otp`, {});
};

// Luna Login Types
export interface LunaLoginSuccessResponse {
  success: true;
  token: string;
  identity: string;
  expires_in: number;
}
export interface LunaLoginErrorResponse {
  detail: string;
}
export const verifyLunaOtp = async (
  otp: string,
): Promise<LunaLoginSuccessResponse> => {
  return apiClient.post<LunaLoginSuccessResponse>("/luna_login", { otp });
};
