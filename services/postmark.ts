import { supportedTemplateModelFieldValuePairs } from "@/app/dashboard/bulk-emails/components/utils";
import { getCookie } from "@/lib/cookies";
import axios from "axios";

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

  const { data: templates } = await axios.get<TemplatesApiResponse[]>(
    "/api/emails/templates",
  );

  return templates;
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
  await getCookie("luna_auth_token");
  const token = await getCookie("luna_auth_token");

  if (!token) {
    throw new Error("Luna auth token is missing");
  }

  const { data } = await axios.post<PostmarkBatchResponseItem[]>(
    "/api/emails/templates/send/bulk",
    {
      templateId,
      templateData: supportedTemplateModelFieldValuePairs,
      recipients: recipients.map((user) => ({
        email: user.email,
        name: user.name,
        templateData: user.templateData,
      })),
    },
  );

  return data;
};
