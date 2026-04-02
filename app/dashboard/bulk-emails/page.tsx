"use client";

import { useBulkEmailsStore } from "@/lib/store/useBulkEmailsStore";
import { bulkEmailsQueryKeys, getUsersList } from "@/services/bulk-emails";
import { useQuery } from "@tanstack/react-query";
import { UserFilters } from "./components/UserFilters";
import { DynamicFilters } from "./components/DynamicFilters";
import { UserPreviewsTable } from "./components/UserPreviewsTable";
import { EmailTemplateSelector } from "./components/EmailTemplateSelector";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function BulkEmailsPage() {
  const { userFilters, dynamicFilters } = useBulkEmailsStore();
  const { data: usersListData, isLoading: isUsersLoading } = useQuery({
    queryKey: bulkEmailsQueryKeys.usersList(userFilters, dynamicFilters),
    queryFn: () => getUsersList(userFilters, dynamicFilters),
  });

  const users = usersListData?.users ?? [];
  const estimatedUserCount = usersListData?.total_count ?? 0;

  return (
    <div className="min-h-0 flex-1 flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="font-semibold">Bulk Email</span>
        </div>
        {/* add filters here in the future */}
      </header>
      {/* Main Content */}
      <main className="p-4 flex-1 space-y-8">
        {/* User & Dynamic Filters Section */}
        <UserFilters />
        <DynamicFilters />

        <Separator />

        {/* User Previews Section */}
        <UserPreviewsTable
          isLoading={isUsersLoading}
          users={users}
          userCount={estimatedUserCount}
        />
        <Separator />

        {/* Email Template Section */}
        <EmailTemplateSelector
          estimatedUserCount={estimatedUserCount}
          users={users}
          dynamicFilters={dynamicFilters}
          userFilters={userFilters}
        />
      </main>
    </div>
  );
}
