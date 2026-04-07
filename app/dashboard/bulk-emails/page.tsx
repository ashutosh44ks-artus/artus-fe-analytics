"use client";

import { useMemo, useState } from "react";
import { useBulkEmailsStore } from "@/lib/store/useBulkEmailsStore";
import { bulkEmailsQueryKeys, getUsersList } from "@/services/bulk-emails";
import { useQuery } from "@tanstack/react-query";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
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

  const users = useMemo(() => usersListData?.users ?? [], [usersListData]);
  const estimatedUserCount = usersListData?.total_count ?? 0;
  const selectionKey = useMemo(
    () => users.map((user) => user.user_id).join("|"),
    [users],
  );
  const [selectionState, setSelectionState] = useState<{
    key: string;
    rowSelection: RowSelectionState;
  }>({
    key: "",
    rowSelection: {},
  });

  const rowSelection = useMemo<RowSelectionState>(() => {
    if (selectionState.key === selectionKey) {
      return selectionState.rowSelection;
    }

    return Object.fromEntries(users.map((user) => [user.user_id, true]));
  }, [selectionKey, selectionState.key, selectionState.rowSelection, users]);

  const handleRowSelectionChange = useMemo<OnChangeFn<RowSelectionState>>(
    () => (updaterOrValue) => {
      const nextRowSelection =
        typeof updaterOrValue === "function"
          ? updaterOrValue(rowSelection)
          : updaterOrValue;

      setSelectionState({
        key: selectionKey,
        rowSelection: nextRowSelection,
      });
    },
    [rowSelection, selectionKey],
  );

  const selectedUsers = useMemo(
    () => users.filter((user) => rowSelection[user.user_id]),
    [rowSelection, users],
  );
  const selectedUserCount = selectedUsers.length;

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
          rowSelection={rowSelection}
          onRowSelectionChange={handleRowSelectionChange}
        />
        <Separator />

        {/* Email Template Section */}
        <EmailTemplateSelector
          estimatedUserCount={estimatedUserCount}
          selectedUserCount={selectedUserCount}
          selectedUsers={selectedUsers}
          dynamicFilters={dynamicFilters}
          userFilters={userFilters}
        />
      </main>
    </div>
  );
}
