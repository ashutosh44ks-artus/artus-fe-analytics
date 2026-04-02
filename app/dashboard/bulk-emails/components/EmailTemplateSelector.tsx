"use client";

import {
  Conditional,
  useBulkEmailsStore,
  UserFilters,
} from "@/lib/store/useBulkEmailsStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAvailableTemplates,
  PostmarkBatchResponseItem,
  postmarkQueryKeys,
  sendBulkEmail,
  SendBulkEmailRequest,
} from "@/services/postmark";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { BulkEmailUser } from "@/services/bulk-emails";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { supportedTemplateModelFieldValuePairs } from "./utils";

interface EmailTemplateSelectorProps {
  estimatedUserCount: number;
  users: BulkEmailUser[];
  dynamicFilters: Conditional[];
  userFilters: UserFilters;
}

export function EmailTemplateSelector({
  estimatedUserCount,
  users,
  dynamicFilters,
  userFilters,
}: EmailTemplateSelectorProps) {
  const { selectedTemplate, setSelectedTemplate } = useBulkEmailsStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { mutate, isPending } = useMutation<
    PostmarkBatchResponseItem[],
    AxiosError,
    SendBulkEmailRequest
  >({
    mutationFn: sendBulkEmail,
    onSuccess: () => {
      toast.success("Email campaign sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending campaign:", error);
      toast.error("Error sending campaign. Check console for details.");
    },
    onSettled: () => {
      setShowConfirmDialog(false);
    },
  });
  const handleSendCampaign = async () => {
    if (!selectedTemplate) {
      toast.error("Please select an email template");
      return;
    }
    if (users.length === 0) {
      toast.error("No users match the current filters");
      return;
    }

    const usersAsRecepients = users.map((user) => ({
      email: user.email,
      name: user.user_name,
      templateData: {
        // user specific template data will go here
        name: user.user_name,
        first_name: user.user_name.split(" ")[0],
      },
    }));

    mutate({
      templateId: selectedTemplate,
      recipients: usersAsRecepients,
    });
  };

  const {
    data: emailTemplates,
    isLoading: isLoadingEmailTemplates,
    error: errorEmailTemplates,
  } = useQuery({
    queryKey: postmarkQueryKeys.templates(),
    queryFn: getAvailableTemplates,
    placeholderData: [],
    select: (data) => {
      const supportedTemplateModelFields = [
        ...Object.keys(supportedTemplateModelFieldValuePairs),
        "name",
        "first_name",
      ];
      // only return templates where all model fields are in the supported list
      return data.filter((template) => {
        // const unsupportedFields = []
        const result = template.templateModel.every((field) =>{
          // need to support {{/if field}} and {{#if field}} conditionals and {{^field}}
          const formattedField = field.replace(/^[\/#^]+/, "");
          const temp =  supportedTemplateModelFields.includes(formattedField);
          if (!temp) {
            // unsupportedFields.push(field);
          }
          return temp;
        });
        // console.log(`Template "${template.name}" model fields:`, template.templateModel, 
        //   `Supported: ${result}`,
        //   unsupportedFields.length > 0 ? `Unsupported fields: ${unsupportedFields.join(", ")}` : "All fields supported"
        // );
        return result;
      });
    },
  });

  const getTemplateById = (id: string) => {
    return (
      emailTemplates?.find((template) => String(template.templateId) === id) ||
      null
    );
  };
  const template = selectedTemplate ? getTemplateById(selectedTemplate) : null;

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Email Template</CardTitle>
        <CardDescription>
          Choose a template for your email campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Select
            value={selectedTemplate ?? undefined}
            onValueChange={setSelectedTemplate}
          >
            <SelectTrigger className="w-full h-auto min-h-10">
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
            size="lg"
            onClick={() => setShowConfirmDialog(true)}
            disabled={
              !selectedTemplate ||
              estimatedUserCount === 0 ||
              isLoadingEmailTemplates
            }
            className="gap-2"
          >
            <Mail className="w-5 h-5" />
            {isPending ? "Sending..." : "Send Campaign"}
          </Button>
        </div>
        {!template && (
          <div className="text-center py-12">
            <p className="text-sm">No template selected</p>
          </div>
        )}
        {errorEmailTemplates && (
          <div className="text-center py-12">
            <p className="text-sm text-red-500">
              Error loading templates: {errorEmailTemplates.message}
            </p>
          </div>
        )}
        {isLoadingEmailTemplates && (
          <div className="text-center py-12">
            <p className="text-sm">Loading templates...</p>
          </div>
        )}
        {template && (
          <div className="space-y-4">
            {/* Subject Line */}
            <div>
              <p className="text-xs font-semibold mb-1">Subject:</p>
              <p className="text-sm bg-slate-900 px-3 py-2 rounded-md border">
                {template.subject}
              </p>
            </div>

            {/* Email Preview */}
            <div>
              <p className="text-xs font-semibold mb-2">Email Preview:</p>
              <div className="border rounded-xl p-4 bg-slate-900">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: template.body }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Email Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will send an email to {estimatedUserCount.toLocaleString()}{" "}
              users. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 bg-zinc-900 px-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Campaign Details:</p>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Recipients:</strong>{" "}
                {estimatedUserCount.toLocaleString()} users
              </li>
              <li>
                <strong>Template:</strong>{" "}
                {selectedTemplate
                  ? `Template "${selectedTemplate}"`
                  : "Not selected"}
              </li>
              <li>
                <strong>Filters Applied:</strong>{" "}
                {Object.values(userFilters).filter((v) => v !== "all").length +
                  dynamicFilters.length}
              </li>
            </ul>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendCampaign}
              disabled={isPending || estimatedUserCount === 0}
            >
              {isPending ? "Sending..." : "Send Campaign"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
