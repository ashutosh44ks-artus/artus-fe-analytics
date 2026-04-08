"use client";

import { useMemo, useState } from "react";
import type {
  CellContext,
  Header,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableFooter } from "@/components/DataTable/data-table-footer";
import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";

interface UserPreviewsTableProps {
  isLoading?: boolean;
  users: BulkEmailUser[];
  userCount: number;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
}

export function UserPreviewsTable({
  isLoading = false,
  users,
  userCount,
  rowSelection,
  onRowSelectionChange,
}: UserPreviewsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
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
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      }),
      columnHelper.accessor("user_name", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="User Name"
          />
        ),
        cell: (info: CellContext<BulkEmailUser, string>) => (
          <span className="font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: ({ column, table }) => (
          <DataTableColumnHeader table={table} column={column} title="Email" />
        ),
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
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="Job Title"
          />
        ),
        cell: (info: CellContext<BulkEmailUser, string>) => (
          <span className="text-sm">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("credits", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="Credits"
          />
        ),
        cell: (info: CellContext<BulkEmailUser, number>) => (
          <span className="text-sm">
            {typeof info.getValue() === "number"
              ? info.getValue().toFixed(1)
              : info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("last_logged_in", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="Last Logged In"
          />
        ),
        cell: (info: CellContext<BulkEmailUser, string | undefined>) => {
          const date = info.getValue(); // e.g. 2026-04-07 06:50:05
          const utcDate = date ? date + "Z" : null; // Ensure it's treated as UTC
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
    getRowId: (row) => row.user_id,
    state: {
      pagination,
      rowSelection,
      sorting,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange,
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
            ? `${userCount.toLocaleString()} users match the current filters`
            : "No users match the current filters"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
          <DataTableFooter table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
