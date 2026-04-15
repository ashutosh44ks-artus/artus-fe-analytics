import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ShadowEmailPreview from "./ShadowEmailPreview";
import { useMemo } from "react";
import { supportedTemplateModelFieldValuePairs } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewEmailTabContentProps {
  draftSubject: string;
  setDraftSubject: (subject: string) => void;
  draftBody: string;
  setDraftBody: (body: string) => void;
  setShowConfirmDialog: (show: boolean) => void;
  selectedUserCount: number;
}
const NewEmailTabContent = ({
  draftSubject,
  setDraftSubject,
  draftBody,
  setDraftBody,
  setShowConfirmDialog,
  selectedUserCount,
}: NewEmailTabContentProps) => {
  const flaggedTemplateModel = useMemo<string[]>(() => {
    const allowedList = Object.keys(
      supportedTemplateModelFieldValuePairs,
    ).concat(["name", "first_name"]);
    // This regex matches ANY {{...}} pattern to inspect it
    const regex = /{{(.*?)}}/g;
    const foundPlaceholders = new Set<string>();
    let match;

    while ((match = regex.exec(draftBody)) !== null) {
      const fullContent = match[1]; // Everything inside the brackets

      // Check if there are any spaces OR if the content isn't in the allowedList
      // A simple way to check "no spaces" is to see if the content matches its trimmed self
      // and contains no internal whitespace.
      const hasWhitespace = /\s/.test(fullContent);

      if (hasWhitespace || !allowedList.includes(fullContent)) {
        foundPlaceholders.add(fullContent.trim());
      }
    }
    return Array.from(foundPlaceholders);
  }, [draftBody]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold">Subject</p>
          <Input
            value={draftSubject}
            onChange={(event) => setDraftSubject(event.target.value)}
            placeholder="Your subject line"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold">HTML body</p>
          <Textarea
            value={draftBody}
            onChange={(event) => setDraftBody(event.target.value)}
            className="min-h-64 font-mono text-sm"
            placeholder="<p>Hello {{first_name}},</p>"
          />
          <div className="text-sm text-muted-foreground">
            Supported template model fields include:{" "}
            {Object.keys(supportedTemplateModelFieldValuePairs).join(", ")}
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => setShowConfirmDialog(true)}
          disabled={flaggedTemplateModel.length > 0 || selectedUserCount === 0}
        >
          Send Custom Email
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold">Estimated Preview</p>
        <div className="bg-slate-900 border rounded-lg overflow-hidden">
          <ShadowEmailPreview html={draftBody} />
        </div>
        {flaggedTemplateModel.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Usage of unsupported or misspelled template model fields can lead
              to rendering issues. Please review the below fields:
            </div>
            <div className="flex gap-2">
              {flaggedTemplateModel.map((field) => (
                <Badge key={field} variant="destructive">
                  {field}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewEmailTabContent;
