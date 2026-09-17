"use client";
import { Fragment, useState } from "react";
import {
  ChevronDown,
  CircleAlert,
  Clock3,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Field from "@/components/logs/Field";
import Meta from "@/components/logs/Meta";
import Json from "@/components/logs/Json";
import { formatDate, methodTone, statusTone } from "@/utils/utils";
import {
  ALL,
  emptyFilters,
  LogFilters,
  METHODS,
  MODULES,
  STATUSES,
} from "@/types/logs-types";
import { useApplicationLogs } from "@/client/hooks/useLogs";

export default function LogsPage() {
  const [filters, setFilters] = useState<LogFilters>(emptyFilters);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const set = (patch: Partial<LogFilters>) =>
    setFilters((prev: any) => ({ ...prev, page: 1, ...patch }));

  const { data, isFetching } = useApplicationLogs(filters);

  const logs = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: filters.limit,
    total: 0,
    totalPages: 1,
  };
  const errorCount = logs.filter((l) => l.statusCode >= 400).length;
  const avgDuration = logs.length
    ? Math.round(logs.reduce((a, l) => a + l.durationMs, 0) / logs.length)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Log Explorer</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Inspect every API request with payloads, latency and error details.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Logs",
            value: pagination.total,
            icon: FileText,
          },
          {
            label: "Errors On Page",
            value: errorCount,
            icon: CircleAlert,
          },
          {
            label: "Avg Latency",
            value: `${avgDuration}ms`,
            icon: Clock3,
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </CardTitle>

                <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <Field label="Search" className="lg:col-span-2">
            <Input
              value={filters.search ?? ""}
              onChange={(e) => set({ search: e.target.value || undefined })}
              placeholder="Path, payload, request id…"
            />
          </Field>

          <Field label="Module">
            <Select
              value={filters.moduleName ?? ALL}
              onValueChange={(v) =>
                set({ moduleName: v === ALL ? undefined : v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All modules</SelectItem>
                {MODULES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Method">
            <Select
              value={filters.method ?? ALL}
              onValueChange={(v) => set({ method: v === ALL ? undefined : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All methods</SelectItem>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Path">
            <Input
              value={filters.path ?? ""}
              onChange={(e) => set({ path: e.target.value || undefined })}
              placeholder="Path contains"
            />
          </Field>

          <Field label="Status code">
            <Select
              value={filters.statusCode ?? ALL}
              onValueChange={(v) =>
                set({ statusCode: v === ALL ? undefined : v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All status codes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All status codes</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Request ID">
            <Input
              value={filters.requestId ?? ""}
              onChange={(e) => set({ requestId: e.target.value || undefined })}
              placeholder="req_…"
            />
          </Field>

          <Field label="User ID">
            <Input
              value={filters.userId ?? ""}
              onChange={(e) => set({ userId: e.target.value || undefined })}
              placeholder="uuid"
            />
          </Field>

          <Field label="IP address">
            <Input
              value={filters.ip ?? ""}
              onChange={(e) => set({ ip: e.target.value || undefined })}
              placeholder="103.50.23.47"
            />
          </Field>

          <Field label="From">
            <Input
              type="date"
              value={filters.from ?? ""}
              onChange={(e) => set({ from: e.target.value || undefined })}
            />
          </Field>

          <Field label="To">
            <Input
              type="date"
              value={filters.to ?? ""}
              onChange={(e) => set({ to: e.target.value || undefined })}
            />
          </Field>

          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={() => {
                setOpenRow(null);
                setFilters(emptyFilters);
              }}
            >
              <RotateCcw />
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <div className="overflow-x-auto">
          <Table className="min-w-225">
            <TableHeader>
              <TableRow className="bg-secondary/60">
                <TableHead className="w-8" />
                <TableHead>Timestamp</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 && !isFetching && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No logs match these filters.
                  </TableCell>
                </TableRow>
              )}
              {logs.map((log) => {
                const open = openRow === log.logId;
                return (
                  <Fragment key={log.logId}>
                    <TableRow
                      onClick={() => setOpenRow(open ? null : log.logId)}
                      className="cursor-pointer"
                      data-state={open ? "selected" : undefined}
                    >
                      <TableCell>
                        <ChevronDown
                          className={cn(
                            "size-4 text-muted-foreground transition-transform",
                            open && "rotate-180",
                          )}
                        />
                      </TableCell>
                      <TableCell className=" text-xs text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell>{log.moduleName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("ring-1", methodTone(log.method))}
                        >
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell className=" text-xs">{log.path}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("ring-1", statusTone(log.statusCode))}
                        >
                          {log.statusCode}
                        </Badge>
                      </TableCell>
                      <TableCell className=" text-xs text-muted-foreground">
                        {log.ip}
                      </TableCell>
                      <TableCell className="text-right  text-xs text-muted-foreground">
                        {log.durationMs}ms
                      </TableCell>
                    </TableRow>
                    {open && (
                      <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                        <TableCell colSpan={8} className="p-5">
                          <div className="mb-4 grid gap-3 sm:grid-cols-3">
                            <Meta label="Log ID" value={log.logId} />
                            <Meta label="Request ID" value={log.requestId} />
                            <Meta label="User ID" value={log.userId ?? "—"} />
                          </div>
                          <div className="grid gap-4 lg:grid-cols-2">
                            <Json
                              title="Request Body"
                              value={log.requestBody}
                            />
                            <Json
                              title={
                                log.error ? "Error Response" : "Response Body"
                              }
                              value={log.error ?? log.responseBody}
                              danger={Boolean(log.error)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-secondary/40 px-5 py-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>
              Page{" "}
              <strong className="text-foreground">{pagination.page}</strong> of{" "}
              {pagination.totalPages} · {pagination.total} logs
            </span>
            <Select
              value={String(filters.limit)}
              onValueChange={(v) => set({ limit: Number(v) })}
            >
              <SelectTrigger className="w-27.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isFetching && <span className="text-xs">Loading…</span>}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((n) => Math.abs(n - pagination.page) <= 2)
              .map((n) => (
                <Button
                  key={n}
                  size="icon"
                  variant={n === pagination.page ? "default" : "outline"}
                  className="size-8 text-xs"
                  onClick={() => setFilters((f) => ({ ...f, page: n }))}
                >
                  {n}
                </Button>
              ))}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
