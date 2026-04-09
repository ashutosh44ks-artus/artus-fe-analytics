"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import TrendCard, { EmptyState } from "@/app/dashboard/components/TrendCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPercentLabel } from "@/app/dashboard/components/utils";
import type { SessionAnalyticsTrendsPeriod } from "./utils";
import type { SessionAnalyticsTrendsDataSuccessResponse } from "@/services/session-analytics";
import { formatMsToTime } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DataTableFooter } from "@/components/DataTable/data-table-footer";

type PageVisitRow =
  SessionAnalyticsTrendsDataSuccessResponse["trends"]["page_visits_over_time"][number];

interface PageVisitsTableCardProps {
  pageVisitData: PageVisitRow[];
  period: SessionAnalyticsTrendsPeriod;
}

const PageVisitsTableCard = ({
  pageVisitData,
  period,
}: PageVisitsTableCardProps) => {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const columnHelper = useMemo(() => createColumnHelper<PageVisitRow>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("page", {
        header: ({ column, table }) => (
          <DataTableColumnHeader table={table} column={column} title="Page URL" />
        ),
        cell: (info) => {
          const value = info.getValue();
          const reverseTruncatedValue = (x: string, n = 50) =>
            x.length > n ? `...${x.slice(-n)}` : x;
          return (
            <span
              className="block break-all font-medium text-slate-100 overflow-hidden"
              title={value.length > 50 ? value : undefined}
            >
              {reverseTruncatedValue(value)}
            </span>
          );
        },
      }),
      columnHelper.accessor("total_visits", {
        header: ({ column, table }) => (
          <DataTableColumnHeader table={table} column={column} title="Total Visits" />
        ),
        cell: (info) => info.getValue().toLocaleString(),
      }),
      columnHelper.accessor("unique_visitors", {
        header: ({ column, table }) => (
          <DataTableColumnHeader table={table} column={column} title="Unique Visits" />
        ),
        cell: (info) => info.getValue().toLocaleString(),
      }),
      columnHelper.accessor("session_ends", {
        header: ({ column, table }) => (
          <DataTableColumnHeader table={table} column={column} title="Session Ends" />
        ),
        cell: (info) => {
          const exitRate = formatPercentLabel(
            info.getValue(),
            info.row.original.total_visits,
          );

          return (
            <div className="flex flex-col">
              <span>{info.getValue().toLocaleString()}</span>
              {exitRate ? (
                <span className="text-[11px] text-slate-400">
                  {exitRate} exit rate
                </span>
              ) : null}
            </div>
          );
        },
      }),
      columnHelper.accessor("avg_duration", {
        header: ({ column, table }) => (
          <DataTableColumnHeader table={table} column={column} title="Avg Duration" />
        ),
        cell: (info) => {
          const value = formatMsToTime(info.getValue());
          return value === "0s" ? "~0s" : value;
        },
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: pageVisitData,
    columns,
    getRowId: (row) => row.page,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TrendCard
      title="Page Visits Over Time"
      description={`Number of page visits across all sessions that happened during the ${period.split("_").join(" ")}.`}
    >
      {pageVisitData.length === 0 ? (
        <EmptyState message="No page visit data is available yet." />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border">
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
                ))}
              </TableBody>
            </Table>
          </div>
          <DataTableFooter table={table} />
        </div>
      )}
    </TrendCard>
  );
};

export default PageVisitsTableCard;
