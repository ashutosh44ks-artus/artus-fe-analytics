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
