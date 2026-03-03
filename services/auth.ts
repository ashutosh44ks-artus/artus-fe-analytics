"use client";

import { apiClient } from "@/lib/api";
import axios from "axios";

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
export const generateLunaOtp = async (): Promise<LunaOtpSuccessResponse> => {
  // const response: LunaOtpResponse = await apiClient.post(`/luna_otp`, {});
  // return response;
  try {
    const response = await apiClient.post<LunaOtpSuccessResponse>(`/luna_otp`, {});
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError<LunaOtpErrorResponse>(error)) {
      throw error.response?.data; // goes to onError
    }
    throw new Error("Network error");
  }
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
export type LunaLoginResponse =
  | LunaLoginSuccessResponse
  | LunaLoginErrorResponse;
export const verifyLunaOtp = async (
  otp: string,
): Promise<LunaLoginSuccessResponse> => {
  try {
    const response = await apiClient.post<LunaLoginSuccessResponse>(
      "/luna_login",
      { otp },
    );

    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError<LunaLoginErrorResponse>(error)) {
      throw error.response?.data; // goes to onError
    }

    throw new Error("Network error");
  }
};
