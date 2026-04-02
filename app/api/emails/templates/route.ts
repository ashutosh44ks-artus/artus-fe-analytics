import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PostmarkListTemplate = {
	TemplateId: number;
	Name: string;
	TemplateType: string;
};

type PostmarkListResponse = {
	Templates: PostmarkListTemplate[];
};
type PostmarkTemplateDetailResponse = {
    Name: string;
    TemplateId: number;
    Alias: string;
    Subject: string;
    HtmlBody: string;
    TextBody: string;
    AssociatedServerId: number;
    Active: boolean;
    TemplateType: string;
    LayoutTemplate: string;
};

type TemplateWithModel = {
	name: string;
	templateId: number;
	templateModel: string[];
    subject: string;
    body: string;
};

const PLACEHOLDER_REGEX = /{{\s*([^}\s]+)\s*}}/g;
const TEMPLATE_COUNT = 50;

function extractTemplateModel(htmlBody: string): string[] {
	const templateModel: string[] = [];

	PLACEHOLDER_REGEX.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = PLACEHOLDER_REGEX.exec(htmlBody)) !== null) {
		if (match[1].startsWith("pm:")) {
			continue;
		}

		templateModel.push(match[1]);
	}

	return [...new Set(templateModel)];
}

export async function GET() {
	const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

	if (!postmarkToken) {
		return NextResponse.json(
			{ error: "POSTMARK_SERVER_TOKEN is not set." },
			{ status: 500 }
		);
	}

	const cookieStore = await cookies();
    const authToken = cookieStore.get('luna_auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

	const apiClient = axios.create({
		baseURL: "https://api.postmarkapp.com",
		headers: {
			"X-Postmark-Server-Token": postmarkToken,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	try {
		const listResponse = await apiClient.get<PostmarkListResponse>(
			`/templates?count=${TEMPLATE_COUNT}&offset=0`
		);

		const basicTemplates = listResponse.data.Templates.filter(
			(template) => template.TemplateType === "Standard"
		);

		const detailedTemplates: TemplateWithModel[] = await Promise.all(
			basicTemplates.map(async (template) => {
				const detailResponse = await apiClient.get<PostmarkTemplateDetailResponse>(
					`/templates/${template.TemplateId}`
				);
				return {
					name: template.Name,
					templateId: template.TemplateId,
					templateModel: extractTemplateModel(detailResponse.data.HtmlBody ?? ""),
                    subject: detailResponse.data.Subject,
                    body: detailResponse.data.HtmlBody,
				};
			})
		);

		return NextResponse.json(detailedTemplates);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error: "Failed to fetch templates from Postmark.",
					details: error.response?.data ?? error.message,
				},
				{ status: error.response?.status ?? 500 }
			);
		}

		return NextResponse.json(
			{ error: "Unexpected error while fetching templates." },
			{ status: 500 }
		);
	}
}
