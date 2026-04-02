import { getCookie } from "@/lib/cookies";
import { apiClient } from "@/lib/api";
import { Conditional, UserFilters } from "@/lib/store/useBulkEmailsStore";

// Query Keys
export const bulkEmailsQueryKeys = {
  all: ["bulkEmails"] as const,
  usersList: (filters: UserFilters, conditionals: Conditional[]) =>
    [...bulkEmailsQueryKeys.all, "usersList", filters, conditionals] as const,
} as const;

// Types
export interface BulkEmailUser {
  user_id: string;
  user_name: string;
  email: string;
  credits: number;
  job_title: string | null;
  heard_from: string | null;
  visited_payments_plan: boolean;
  created_at: string; // ISO datetime
  projects_count: number;
  payment_visits: number;
  last_logged_in?: string;
}

export interface LunaUsersListResponse {
  users: BulkEmailUser[];
  total_count: number;
  last_logged_in_tracked: boolean;
  user_name: string;
  applied_filters: {
    filter_by_last_logged_in: string;
    credits_status: string;
    visited_payments_plan: string;
    filter_by_job_title: string;
    filter_by_heard_from: string;
    conditionals: Conditional[];
  };
}

export const getUsersList = async (
  userFilters: UserFilters,
  conditionals: Conditional[],
): Promise<LunaUsersListResponse> => {
  const token = await getCookie("luna_auth_token");

  if (!token) {
    throw new Error("Luna auth token is missing");
  }

  return await apiClient.post<LunaUsersListResponse>("/luna_users_list", {
    token,
    ...userFilters,
    conditionals,
  });
};

export const sendBulkEmail = async (
  userFilters: UserFilters,
  conditionals: Conditional[],
  templateId: string,
  users: BulkEmailUser[],
): Promise<{ success: boolean; message: string }> => {
  await getCookie("luna_auth_token");

  // Stub: Log the email send instead of making API call
  console.log("[STUB] sendBulkEmail called with:", {
    userFilters,
    conditionals,
    templateId,
    usersCount: users.length,
    users: users.map((u) => ({ email: u.email, user_name: u.user_name })),
  });

  return {
    success: true,
    message: `Email campaign would be sent to ${users.length} users`,
  };
};