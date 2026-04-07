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
import EmailTemplateBody from "./EmailTemplateBody";

interface EmailTemplateSelectorProps {
  estimatedUserCount: number;
  selectedUserCount: number;
  selectedUsers: BulkEmailUser[];
  dynamicFilters: Conditional[];
  userFilters: UserFilters;
}

export function EmailTemplateSelector({
  estimatedUserCount,
  selectedUserCount,
  selectedUsers,
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
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const usersAsRecipients = selectedUsers.map((user) => ({
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
      recipients: usersAsRecipients,
    });
  };

  const {
    data: emailTemplates,
    isFetching: isLoadingEmailTemplates,
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
        const result = template.templateModel.every((field) => {
          // need to support {{/if field}} and {{#if field}} conditionals and {{^field}}
          const formattedField = field.replace(/^[\/#^]+/, "");
          const temp = supportedTemplateModelFields.includes(formattedField);
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
  const selectedTemplateObject = selectedTemplate
    ? getTemplateById(selectedTemplate)
    : null;

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Email Template </CardTitle>
        <CardDescription>
          Choose a template for your email campaign for {selectedUserCount.toLocaleString()} selected user{selectedUserCount === 1 ? "" : "s"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4 sm:flex-row flex-col">
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
          selectedTemplate={selectedTemplateObject}
          isLoading={isLoadingEmailTemplates}
          error={errorEmailTemplates}
        />
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Email Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this email campaign to{" "}
              {selectedUserCount.toLocaleString()} selected user{selectedUserCount === 1 ? "" : "s"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 bg-zinc-900 px-4 rounded-lg">
            <ul className="text-sm space-y-1">
              <li>
                <strong>Recipients:</strong>{" "}
                {selectedUserCount.toLocaleString()} selected of {estimatedUserCount.toLocaleString()} matched users
              </li>
              <li>
                <strong>Filters Applied:</strong>{" "}
                {Object.values(userFilters).filter((v) => v !== "all").length +
                  dynamicFilters.length}
              </li>
              <li>
                <strong>Template:</strong> [{selectedTemplate}]{" "}
                {selectedTemplateObject?.name}
              </li>
            </ul>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendCampaign}
              disabled={isPending || selectedUserCount === 0}
            >
              {isPending ? "Sending..." : "Send Campaign"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
