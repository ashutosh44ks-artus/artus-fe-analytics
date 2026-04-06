"use client";

import { useMemo, useState } from "react";
import type { CellContext, Header, Row } from "@tanstack/react-table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BulkEmailUser } from "@/services/bulk-emails";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserPreviewsTableProps {
  isLoading?: boolean;
  users: BulkEmailUser[];
  userCount: number;
}

export function UserPreviewsTable({
  isLoading = false,
  users,
  userCount,
}: UserPreviewsTableProps) {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const columnHelper = useMemo(() => createColumnHelper<BulkEmailUser>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("user_name", {
        header: "User Name",
        cell: (info: CellContext<BulkEmailUser, string>) => (
          <span className="font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info: CellContext<BulkEmailUser, string>) => (
          <a
            href={`mailto:${info.getValue()}`}
            className="text-blue-300 hover:underline text-sm"
          >
            {info.getValue()}
          </a>
        ),
      }),
      columnHelper.accessor("job_title", {
        header: "Job Title",
        cell: (info: CellContext<BulkEmailUser, string>) => (
          <span className="text-sm">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("credits", {
        header: "Credits",
        cell: (info: CellContext<BulkEmailUser, number>) => (
          <span className="text-sm">
            {typeof info.getValue() === "number"
              ? info.getValue().toFixed(1)
              : info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("last_logged_in", {
        header: "Last Logged In",
        cell: (info: CellContext<BulkEmailUser, string | undefined>) => {
          const date = info.getValue(); // e.g. 2026-04-06T12:42:35.647000
          const utcDate = date ? date.split(".")[0] + "Z" : null; // Ensure it's treated as UTC
          return (
            <span className="text-sm">
              {utcDate
                ? formatDistanceToNow(new Date(utcDate), { addSuffix: true })
                : "Never"}
            </span>
          );
        },
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: users,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>User Previews</CardTitle>
          <CardDescription>
            Loading users that match your filters...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>User Previews</CardTitle>
        <CardDescription>
          {userCount > 0
            ? `${userCount.toLocaleString()} users will receive this email`
            : "No users match the current filters"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-xl">
          <Table className="w-full text-sm">
            <TableHeader className="bg-slate-900 hover:bg-slate-900">
              <TableRow>
                {table
                  .getHeaderGroups()[0]
                  ?.headers.map((header: Header<BulkEmailUser, unknown>) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8"
                  >
                    No users to display
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row: Row<BulkEmailUser>) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
