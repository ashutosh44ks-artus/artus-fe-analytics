import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const FROM_EMAIL = "community@mail.artusai.co";
const MESSAGE_STREAM = "feedback-broadcast-1";
const BATCH_SIZE = 20;

type SendBulkTemplateRequestBody = {
  templateId?: number;
  templateData?: Record<string, unknown>;
  recipients?: BulkRecipient[];
};

type BulkRecipient = {
  email?: string;
  name?: string;
  templateData?: Record<string, unknown>;
};

type PostmarkBatchTemplateMessage = {
  From: string;
  To: string;
  TemplateId: number;
  TemplateModel: Record<string, unknown>;
  TrackOpens: boolean;
  MessageStream: string;
};

type PostmarkBatchResponseItem = {
  ErrorCode: number;
  Message: string;
  // optional fields returned on success
  MessageID?: string;
  To?: string;
  SubmittedAt?: string;
};

const chunkArray = <T>(items: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
};

export async function POST(request: NextRequest) {
  try {
    const {
      templateId,
      templateData,
      recipients,
    }: SendBulkTemplateRequestBody = await request.json();
    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
    if (!postmarkToken) {
      return NextResponse.json(
        { error: "POSTMARK_SERVER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    const authToken = cookieStore.get("luna_auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "recipients is required and must be a non-empty array" },
        { status: 400 },
      );
    }

    const invalidRecipient = recipients.find((recipient) => !recipient.email);
    if (invalidRecipient) {
      return NextResponse.json(
        { error: "Each recipient must include an email" },
        { status: 400 },
      );
    }

    const recipientBatches = chunkArray(recipients, BATCH_SIZE);
    const batchResults: PostmarkBatchResponseItem[] = [];

    for (const batch of recipientBatches) {
      const messages: PostmarkBatchTemplateMessage[] = batch.map(
        (recipient) => ({
          From: FROM_EMAIL,
          To: recipient.email as string,
          TemplateId: templateId,
          TemplateModel: {
            email: recipient.email,
            name: recipient.name,
            ...templateData,
            ...recipient.templateData,
          },
          TrackOpens: true,
          MessageStream: MESSAGE_STREAM,
        }),
      );
      
      const response = await fetch(
        "https://api.postmarkapp.com/email/batchWithTemplates",
        {
          method: "POST",
          headers: {
            "X-Postmark-Server-Token": postmarkToken,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Messages: messages }),
        },
      );

      const data = (await response.json()) as PostmarkBatchResponseItem[];

      if (!response.ok) {
        const errorMessage = Array.isArray(data)
          ? "Failed to send one of the email batches"
          : "Failed to send bulk email batch";
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status },
        );
      }

      if (Array.isArray(data)) {
        batchResults.push(...data);
      }
    }

    const failed = batchResults.filter(
      (result) => (result.ErrorCode ?? 0) !== 0,
    );
    return NextResponse.json({
      success: failed.length === 0,
      totalRecipients: recipients.length,
      batchSize: BATCH_SIZE,
      batchesProcessed: recipientBatches.length,
      delivered: recipients.length - failed.length,
      failedCount: failed.length,
      failed,
    });
  } catch (error) {
    console.error("Error sending template email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
