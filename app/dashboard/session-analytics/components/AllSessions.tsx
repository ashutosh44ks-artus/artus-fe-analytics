"use client";

import { useMemo, useState } from "react";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DataTableFooter } from "@/components/DataTable/data-table-footer";
import { formatMsToTime } from "@/lib/utils";
import type { SessionAnalyticsTrendsPeriod } from "./utils";
import type {
  AggregatedSessionObject,
  SessionAnalyticsAllDataSuccessResponse,
} from "@/services/session-analytics";

interface AllSessionsProps {
  period: SessionAnalyticsTrendsPeriod;
  userSessions: SessionAnalyticsAllDataSuccessResponse["sessions"] | undefined;
}

const AllSessions = ({ userSessions }: AllSessionsProps) => {
  const [selectedSession, setSelectedSession] =
    useState<AggregatedSessionObject | null>(null);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const columnHelper = useMemo(
    () => createColumnHelper<AggregatedSessionObject>(),
    [],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("user_name", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="User Name"
          />
        ),
        cell: (info) => (
          <span className="font-mono text-xs text-slate-100">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("session_number_for_this_user", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="Session #"
          />
        ),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("total_time_this_session", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="Duration"
          />
        ),
        cell: (info) => {
          const value = formatMsToTime(info.getValue());
          return value === "0s" ? "~0s" : value;
        },
      }),
      columnHelper.accessor((row) => row.session_details.length, {
        id: "events",
        header: ({ column, table }) => (
          <DataTableColumnHeader table={table} column={column} title="Events" />
        ),
        cell: (info) => info.getValue(),
      }),
    ],
    [columnHelper],
  );

  const sessions = useMemo(
    () => (userSessions ?? []).filter((s) => s.session_details.length >= 3),
    [userSessions],
  );

  const table = useReactTable({
    data: sessions,
    columns,
    getRowId: (row) => `${row.user_id}-${row.session_number_for_this_user}`,
    state: { pagination, sorting, columnFilters },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Card className="border-slate-800 bg-gray-900 text-slate-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Sessions</CardTitle>
          <CardDescription className="mt-1 text-xs text-slate-400">
            List of all user sessions with at least 3 events and their journeys
            through the product. Click on a session to see detailed event
            information in a side panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No session data is available yet.
            </p>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Search by user name..."
                value={
                  (table
                    .getColumn("user_name")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table
                    .getColumn("user_name")
                    ?.setFilterValue(e.target.value)
                }
                className="max-w-xs border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
              />
              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <Table className="w-full text-sm">
                  <TableHeader className="bg-slate-900 hover:bg-slate-900">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-slate-800"
                        onClick={() => setSelectedSession(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTableFooter table={table} />
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
      >
        <SheetContent
          side="right"
          className="w-120 sm:max-w-120 bg-gray-900 border-slate-700 text-slate-50"
        >
          <SheetHeader>
            <SheetTitle className="text-slate-50">Session Details</SheetTitle>
            {selectedSession && (
              <SheetDescription className="text-slate-400">
                User{" "}
                <span className="font-mono text-xs">
                  {selectedSession.user_id}
                </span>{" "}
                &middot; Session #{selectedSession.session_number_for_this_user}{" "}
                &middot;{" "}
                {formatMsToTime(selectedSession.total_time_this_session) ===
                "0s"
                  ? "~0s"
                  : formatMsToTime(
                      selectedSession.total_time_this_session,
                    )}{" "}
                total
              </SheetDescription>
            )}
          </SheetHeader>

          {selectedSession && (
            <ScrollArea className="h-0 flex-1 px-4 pb-4">
              <div className="space-y-2">
                {selectedSession.session_details.map((event, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-slate-100 break-all">
                        {event.event_name}
                      </span>
                      <span className="shrink-0 text-xs text-slate-500">
                        {new Date(event.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    {event.event_value !== null && (
                      <p className="mt-1 break-all text-xs text-slate-400">
                        {event.event_value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AllSessions;
