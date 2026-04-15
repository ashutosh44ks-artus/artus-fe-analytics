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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAvailableTemplates,
  PostmarkBatchResponseItem,
  postmarkQueryKeys,
  sendBulkEmail,
  SendBulkEmailRequest,
  sendCustomEmail,
  SendCustomEmailRequest,
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
import { getUsersAsRecipients, supportedTemplateModelFieldValuePairs } from "./utils";
import NewEmailTabContent from "./NewEmailTabContent";
import EmailTemplateTabContent from "./EmailTemplateTabContent";

interface SendEmailCardProps {
  estimatedUserCount: number;
  selectedUserCount: number;
  selectedUsers: BulkEmailUser[];
  dynamicFilters: Conditional[];
  userFilters: UserFilters;
}

export function SendEmailCard({
  estimatedUserCount,
  selectedUserCount,
  selectedUsers,
  dynamicFilters,
  userFilters,
}: SendEmailCardProps) {
  const { selectedTemplate, setSelectedTemplate } = useBulkEmailsStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [draftSubject, setDraftSubject] = useState("Your subject line");
  const [draftBody, setDraftBody] = useState(
    '<div style="padding: 8px 4px;"><h1>Hello {{first_name}},</h1><p>Hope you are doing well!</p></div>',
  );

  // bulk
  const { mutate: templateEmailMutate, isPending: isPendingTemplateEmail } =
    useMutation<PostmarkBatchResponseItem[], AxiosError, SendBulkEmailRequest>({
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
  const handleSendTemplateEmail = async () => {
    if (!selectedTemplate) {
      toast.error("Please select an email template");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const usersAsRecipients = getUsersAsRecipients(selectedUsers);

    templateEmailMutate({
      templateId: selectedTemplate,
      recipients: usersAsRecipients,
    });
  };
  // custom
  const { mutate: customEmailMutate, isPending: isPendingCustomEmail } =
    useMutation<
      PostmarkBatchResponseItem[],
      AxiosError,
      SendCustomEmailRequest
    >({
      mutationFn: sendCustomEmail,
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
  const handleSendCustomEmail = async () => {
    if (!draftSubject || !draftBody) {
      toast.error("Please fill out the subject and body for the custom email");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const usersAsRecipients = getUsersAsRecipients(selectedUsers);

    customEmailMutate({
      subject: draftSubject,
      htmlBody: draftBody,
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
    <Tabs defaultValue="existing" className="w-full">
      <Card className="rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Send Email</CardTitle>
            <CardDescription>
              Choose a template for your email campaign or send a custom email
              for {selectedUserCount.toLocaleString()} selected user
              {selectedUserCount === 1 ? "" : "s"}
            </CardDescription>
          </div>
          <TabsList variant="default">
            <TabsTrigger value="existing">Existing template</TabsTrigger>
            <TabsTrigger value="create">Create new</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="existing" className="space-y-4">
            <EmailTemplateTabContent
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              selectedTemplateObject={selectedTemplateObject}
              emailTemplates={emailTemplates || []}
              isLoadingEmailTemplates={isLoadingEmailTemplates}
              errorEmailTemplates={errorEmailTemplates}
              setShowConfirmDialog={setShowConfirmDialog}
              selectedUserCount={selectedUserCount}
              isPending={isPendingTemplateEmail}
            />
            {/* Confirmation Dialog */}
            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Send Email Campaign?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to send this email campaign to{" "}
                    {selectedUserCount.toLocaleString()} selected user
                    {selectedUserCount === 1 ? "" : "s"}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 bg-zinc-900 px-4 rounded-lg">
                  <ul className="text-sm space-y-1">
                    <li>
                      <strong>Recipients:</strong>{" "}
                      {selectedUserCount.toLocaleString()} selected of{" "}
                      {estimatedUserCount.toLocaleString()} matched users
                    </li>
                    <li>
                      <strong>Filters Applied:</strong>{" "}
                      {Object.values(userFilters).filter((v) => v !== "all")
                        .length + dynamicFilters.length}
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
                    onClick={handleSendTemplateEmail}
                    disabled={isPendingTemplateEmail || selectedUserCount === 0}
                  >
                    {isPendingTemplateEmail ? "Sending..." : "Send Campaign"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <NewEmailTabContent
              draftSubject={draftSubject}
              setDraftSubject={setDraftSubject}
              draftBody={draftBody}
              setDraftBody={setDraftBody}
              setShowConfirmDialog={setShowConfirmDialog}
              selectedUserCount={selectedUserCount}
            />
            {/* Confirmation Dialog */}
            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Send Email Campaign?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to send this email campaign to{" "}
                    {selectedUserCount.toLocaleString()} selected user
                    {selectedUserCount === 1 ? "" : "s"}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 bg-zinc-900 px-4 rounded-lg">
                  <ul className="text-sm space-y-1">
                    <li>
                      <strong>Recipients:</strong>{" "}
                      {selectedUserCount.toLocaleString()} selected of{" "}
                      {estimatedUserCount.toLocaleString()} matched users
                    </li>
                    <li>
                      <strong>Filters Applied:</strong>{" "}
                      {Object.values(userFilters).filter((v) => v !== "all")
                        .length + dynamicFilters.length}
                    </li>
                  </ul>
                </div>
                <div className="flex gap-3 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSendCustomEmail}
                    disabled={isPendingCustomEmail || selectedUserCount === 0}
                  >
                    {isPendingCustomEmail ? "Sending..." : "Send Campaign"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
