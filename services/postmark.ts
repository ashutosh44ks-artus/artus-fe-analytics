import { supportedTemplateModelFieldValuePairs } from "@/app/dashboard/bulk-emails/components/utils";
import { apiClient } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

// Query Keys
export const postmarkQueryKeys = {
  all: ["postmark"] as const,
  templates: () => [...postmarkQueryKeys.all, "templates"] as const,
} as const;

// Types
export interface TemplatesApiResponse {
  name: string;
  templateId: number;
  templateModel: string[];
  subject: string;
  body: string;
}

export const getAvailableTemplates = async (): Promise<
  TemplatesApiResponse[]
> => {
  const token = await getCookie("luna_auth_token");

  if (!token) {
    throw new Error("Luna auth token is missing");
  }

  return await apiClient.post<TemplatesApiResponse[]>(
    "/emails/templates",
    {
      token,
    },
    {
      timeout: 60000, // Set a timeout of 60 seconds for this request
    },
  );
};

export interface PostmarkBatchResponseItem {
  success: boolean;
  totalRecipients: number;
  batchSize: number;
  batchesProcessed: number;
  delivered: number;
  failedCount: number;
  failed: {
    ErrorCode: number;
    Message: string;
    // optional fields returned on success
    MessageID?: string;
    To?: string;
    SubmittedAt?: string;
  }[];
}
interface BulkRecipient {
  email?: string;
  name?: string;
  templateData?: Record<string, unknown>;
}
export interface SendBulkEmailRequest {
  templateId: string;
  recipients: BulkRecipient[];
}
export const sendBulkEmail = async ({
  templateId,
  recipients,
}: SendBulkEmailRequest): Promise<PostmarkBatchResponseItem[]> => {
  const token = await getCookie("luna_auth_token");

  if (!token) {
    throw new Error("Luna auth token is missing");
  }

  return await apiClient.post<PostmarkBatchResponseItem[]>(
    "/emails/templates/send/bulk",
    {
      templateId,
      templateData: supportedTemplateModelFieldValuePairs,
      recipients: recipients.map((user) => ({
        email: user.email,
        name: user.name,
        templateData: user.templateData,
      })),
      token,
    },
    {
      timeout: 60000, // Set a timeout of 60 seconds for this request
    },
  );
};

export interface SendCustomEmailRequest {
  subject: string;
  htmlBody: string;
  recipients: BulkRecipient[];
}
export const sendCustomEmail = async ({
  subject,
  htmlBody,
  recipients,
}: SendCustomEmailRequest): Promise<PostmarkBatchResponseItem[]> => {
  const token = await getCookie("luna_auth_token");

  if (!token) {
    throw new Error("Luna auth token is missing");
  }

  return await apiClient.post<PostmarkBatchResponseItem[]>(
    "/emails/custom/send",
    {
      subject,
      body: htmlBody,
      templateData: supportedTemplateModelFieldValuePairs,
      recipients: recipients.map((user) => ({
        email: user.email,
        name: user.name,
        templateData: user.templateData,
      })),
      token,
    },
    {
      timeout: 60000, // Set a timeout of 60 seconds for this request
    },
  );
};
