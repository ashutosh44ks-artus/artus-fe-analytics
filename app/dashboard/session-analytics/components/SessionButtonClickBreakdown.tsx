"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { EmptyState } from "@/app/dashboard/components/TrendCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DataTableFooter } from "@/components/DataTable/data-table-footer";
import { SessionAnalyticsTrendsPeriod } from "./utils";
import { SessionAnalyticsTrendsDataSuccessResponse } from "@/services/session-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SessionButtonClickBreakdownProps {
  period: SessionAnalyticsTrendsPeriod;
  buttonClickData:
    | SessionAnalyticsTrendsDataSuccessResponse["trends"]["button_click_breakdown"]
    | undefined;
}

type ButtonClickRow =
  SessionAnalyticsTrendsDataSuccessResponse["trends"]["button_click_breakdown"][number];

type DisplayMode = "percentages" | "counts";

const formatPercent = (numerator: number, denominator: number) => {
  if (denominator <= 0) {
    return "0%";
  }

  const percent = (numerator / denominator) * 100;
  return `${percent.toFixed(percent % 1 === 0 ? 0 : 1)}%`;
};

const SessionButtonClickBreakdown = ({
  period,
  buttonClickData,
}: SessionButtonClickBreakdownProps) => {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "event_value", desc: false },
  ]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("counts");

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const totals = useMemo(() => {
    const rows = buttonClickData ?? [];

    return rows.map((row) => ({
      event_value: row.event_value,
      total: row.s1_count + row.s2_count + row.s3_count + row.s4_count,
    }));
  }, [buttonClickData]);

  const getTotalForEvent = (eventValue: string) => {
    return totals.find((t) => t.event_value === eventValue)?.total ?? 0;
  };

  const columnHelper = useMemo(() => createColumnHelper<ButtonClickRow>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("event_value", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title="Page & Event"
          />
        ),
        cell: (info) => {
          const split = info.getValue().split("__");
          const eventName = split[1];
          const pageName = split[0];
          const displayValue =
            eventName === pageName ? eventName : `${pageName}: ${eventName}`;
          return (
            <span
              className="block break-all font-medium text-slate-100 overflow-hidden"
              title={displayValue.length > 60 ? displayValue : undefined}
            >
              {displayValue}
            </span>
          );
        },
      }),
      columnHelper.accessor("s1_count", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title={displayMode === "counts" ? "Session 1" : "Session 1 %"}
          />
        ),
        cell: (info) => {
          const value = info.getValue();
          return displayMode === "counts"
            ? value.toLocaleString()
            : formatPercent(value, getTotalForEvent(info.row.original.event_value));
        },
      }),
      columnHelper.accessor("s2_count", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title={displayMode === "counts" ? "Session 2" : "Session 2 %"}
          />
        ),
        cell: (info) => {
          const value = info.getValue();
          return displayMode === "counts"
            ? value.toLocaleString()
            : formatPercent(value, getTotalForEvent(info.row.original.event_value));
        },
      }),
      columnHelper.accessor("s3_count", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title={displayMode === "counts" ? "Session 3" : "Session 3 %"}
          />
        ),
        cell: (info) => {
          const value = info.getValue();
          return displayMode === "counts"
            ? value.toLocaleString()
            : formatPercent(value, getTotalForEvent(info.row.original.event_value));
        },
      }),
      columnHelper.accessor("s4_count", {
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            title={displayMode === "counts" ? "Session 4+" : "Session 4+ %"}
          />
        ),
        cell: (info) => {
          const value = info.getValue();
          return displayMode === "counts"
            ? value.toLocaleString()
            : formatPercent(value, getTotalForEvent(info.row.original.event_value));
        },
      }),
    ],
    [columnHelper, displayMode, totals],
  );

  const table = useReactTable({
    data: buttonClickData ?? [],
    columns,
    getRowId: (row) => row.event_value,
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
    <Card className="border-slate-800 bg-gray-900 text-slate-50">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">
            Session Button Click Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Breakdown of button and event interactions for valid sessions during the{" "}
            {period.split("_").join(" ")}.
          </CardDescription>
        </div>
        <Select
          value={displayMode}
          onValueChange={(val) => setDisplayMode(val as DisplayMode)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="percentages">Show Percentages</SelectItem>
              <SelectItem value="counts">Show Counts</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {!buttonClickData || buttonClickData.length === 0 ? (
          <EmptyState message="No button click breakdown data is available yet." />
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
      </CardContent>
    </Card>
  );
};

export default SessionButtonClickBreakdown;
