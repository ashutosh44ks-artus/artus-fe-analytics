import { Button } from "@/components/ui/button";
import EmailTemplateBody from "./EmailTemplateBody";
import { Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplatesApiResponse } from "@/services/postmark";

interface EmailTemplateTabContentProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (templateId: string) => void;
  selectedTemplateObject?: TemplatesApiResponse | null;
  emailTemplates: TemplatesApiResponse[];
  isLoadingEmailTemplates: boolean;
  errorEmailTemplates: Error | null;
  setShowConfirmDialog: (show: boolean) => void;
  selectedUserCount: number;
  isPending: boolean;
}
const EmailTemplateTabContent = ({
  selectedTemplate,
  setSelectedTemplate,
  selectedTemplateObject,
  emailTemplates,
  isLoadingEmailTemplates,
  errorEmailTemplates,
  setShowConfirmDialog,
  selectedUserCount,
  isPending,
}: EmailTemplateTabContentProps) => {
  return (
    <>
      <div className="flex items-center gap-4 sm:flex-row flex-col">
        <Select
          value={selectedTemplate ?? undefined}
          onValueChange={setSelectedTemplate}
        >
          <SelectTrigger className="w-full h-auto">
            <SelectValue placeholder="Choose an email template" />
          </SelectTrigger>
          <SelectContent>
            {emailTemplates?.map((template) => (
              <SelectItem
                key={template.templateId}
                value={String(template.templateId)}
              >
                <span className="text-xs">[{template.templateId}]</span>
                <span className="font-medium">{template.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => setShowConfirmDialog(true)}
          disabled={
            !selectedTemplate ||
            selectedUserCount === 0 ||
            isLoadingEmailTemplates
          }
          className="gap-2 sm:w-auto w-full"
        >
          <Mail className="w-5 h-5" />
          {isPending ? "Sending..." : "Send Campaign"}
        </Button>
      </div>
      <EmailTemplateBody
        selectedTemplate={selectedTemplateObject || null}
        isLoading={isLoadingEmailTemplates}
        error={errorEmailTemplates}
      />
    </>
  );
};

export default EmailTemplateTabContent;
