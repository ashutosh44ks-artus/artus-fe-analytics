"use client";

import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

// Query Keys
export const customerFeedbackDataQueryKeys = {
  base: ["customer-feedback"] as const,
};

// User Types
export interface CustomerFeedbackDataSuccessResponse {
  feedback: {
    created_at: string;
    email: string;
    feedback: string;
    feedback_id: string;
    rating: number;
    user_id: string;
    company_name: string;
    heard_from: string;
    job_title: string;
  }[];
}
export const getCustomerFeedbackData =
  async (): Promise<CustomerFeedbackDataSuccessResponse> => {
    const token = await getCookie("luna_auth_token");
    return await apiClient.post<CustomerFeedbackDataSuccessResponse>(
      `/luna_feedback`,
      {
        token,
      },
    );
  };
