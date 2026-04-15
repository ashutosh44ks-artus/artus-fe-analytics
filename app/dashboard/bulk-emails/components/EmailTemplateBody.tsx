import { TemplatesApiResponse } from "@/services/postmark";
import ShadowEmailPreview from "./ShadowEmailPreview";

interface EmailTemplateBodyProps {
  selectedTemplate: TemplatesApiResponse | null;
  isLoading: boolean;
  error: Error | null;
}

const EmailTemplateBody = ({
  selectedTemplate,
  isLoading,
  error,
}: EmailTemplateBodyProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-400">
          Error loading templates: {error.message}
        </p>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="text-center py-12">
        <p className="text-sm">No template selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Subject Line */}
      <div>
        <p className="text-xs font-semibold mb-1">Subject:</p>
        <p className="text-sm bg-slate-900 px-3 py-2 rounded-md border">
          {selectedTemplate.subject}
        </p>
      </div>

      {/* Email Preview */}
      <div>
        <p className="text-xs font-semibold mb-2">Email Preview:</p>
        <div className="border rounded-xl p-4 bg-slate-900">
          <ShadowEmailPreview html={selectedTemplate.body} />
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateBody;
