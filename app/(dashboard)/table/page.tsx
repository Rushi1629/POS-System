"use client";
import { useEffect, useMemo, useState } from "react";
import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  Users,
  Table2,
  MoreHorizontal,
  Timer,
  Power,
  X,
  Rotate3D,
  RotateCcw,
  RotateCw,
  Check,
  TimerIcon,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  FetchTableResponse,
  TABLE_STATUS,
  TABLE_TYPES,
  TableFormValues,
  TableStatus,
  TableType,
} from "@/types/table-types";
import TableThumb from "@/components/TableThumb";
import TypeBadge from "@/components/TypeBadge";
import StatCard from "@/components/StatCard";
import TableDialog from "@/components/TableDialog";
import {
  useCreateTable,
  useDeleteTable,
  useEditTable,
  useFetchTables,
} from "@/client/hooks/useTable";
import { isEqual } from "lodash-es";
import TableStatusCustom from "@/components/TableStatus";

function Tables() {
  const { data: tables = [] } = useFetchTables();
  console.log(tables, "tables");

  const { mutateAsync: createTable, isPending: isCreating } = useCreateTable();

  const { mutateAsync: updateTable, isPending: isEditing } = useEditTable();
  const { mutateAsync: deleteTable, isPending: isDeleting } = useDeleteTable();

  // const [items, setItems] = useState<FetchTableResponse[]>(seed);
  const items = tables;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TableType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TableStatus>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FetchTableResponse | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const filtered = useMemo(() => {
    return items
      .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
      .filter((t) =>
        statusFilter === "all" ? true : t.tableStatus === statusFilter,
      )
      .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search, typeFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: items.length,
      available: items.filter((t) => t.tableStatus === "AVAILABLE").length,
      active: items.filter((t) => t.isActive).length,
    }),
    [items],
  );

  const columns = useMemo<ColumnDef<FetchTableResponse>[]>(
    () => [
      {
        id: "name",
        header: "Table",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <TableThumb name={row.original.name} type={row.original.type} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {row.original.name}
                </span>
                <TypeBadge type={row.original.type} />
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
            {row.original.capacity}
          </span>
        ),
      },
      {
        id: "rate",
        header: "Rate / min",
        cell: ({ row }) =>
          row.original.enableTimeRate ? (
            <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-foreground">
              <Timer className="h-4 w-4 text-primary" />₹
              {Number(row.original.ratePerMinute).toFixed(2)}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <TableStatusCustom status={row.original.tableStatus} />
        ),
      },
      {
        accessorKey: "chargePerPerson",
        header: "Charge per Person",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              row.original.chargePerPerson ? "text-chart-2" : "text-chart-5"
            }`}
          >
            <User2 className="h-3.5 w-3.5" />
            {row.original.chargePerPerson ? "True" : "False"}
          </span>
        ),
      },
      {
        accessorKey: "enableTimeRate",
        header: "Enable Time Rate",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              row.original.enableTimeRate ? "text-chart-2" : "text-chart-5"
            }`}
          >
            <TimerIcon className="h-3.5 w-3.5" />
            {row.original.enableTimeRate ? "True" : "False"}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Active",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              row.original.isActive ? "text-chart-2" : "text-chart-5"
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            {row.original.isActive ? "Enabled" : "Disabled"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => openEdit(row.original)}
              aria-label="Edit"
              className="h-9 w-9"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDeleteId(row.original.id)}
              aria-label="Delete"
              className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(t: FetchTableResponse) {
    setEditing(t);
    setDialogOpen(true);
  }

  function resetFilters() {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
  }

  async function handleSave(data: TableFormValues) {
    try {
      if (editing) {
        const payload = {
          name: data.name,
          type: data.type,
          capacity: data.capacity,
          enableTimeRate: data.enableTimeRate,
          ratePerMinute: data.ratePerMinute,
          isActive: data.isActive,
          chargePerPerson: data.chargePerPerson,
        };

        const isSame = isEqual(
          {
            name: editing.name,
            type: editing.type,
            capacity: editing.capacity,
            enableTimeRate: editing.enableTimeRate,
            ratePerMinute: editing.ratePerMinute,
            isActive: editing.isActive,
            chargePerPerson: editing.chargePerPerson,
          },
          payload,
        );

        if (isSame) {
          toast.info("No changes detected 🤔");
          setDialogOpen(false);
          return;
        }

        console.log("Updating menu...");
        await updateTable({
          id: Number(editing.id),
          data: data,
        });

        toast.success("Table updated 👍");
      } else {
        console.log("Creating new table...");
        await createTable(data);
        console.log("Table created successfully");
        toast.success("Table created 🥳");
      }

      setDialogOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("handleSave error:", err);
      toast.error("Something went wrong while saving ❌");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await deleteTable(Number(deleteId));

      toast.success("Table Deleted Sucessfully 🗑  ️");
      setDeleteId(null);
    } catch {
      toast.error("Delete failed ❌");
    }
  }

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Table Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Configure dining tables, capacity, status and time-based billing
            rates.
          </p>
        </div>
        <Button
          size="lg"
          onClick={openCreate}
          className="gap-2 bg-primary text-primary-foreground shadow-[--shadow-elegant] hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Table
        </Button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          label="TOTAL TABLES"
          value={stats.total}
          icon={<Table2 className="h-5 w-5" />}
          tint="primary"
        />
        <StatCard
          label="AVAILABLE"
          value={stats.available}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tint="emerald"
        />
        <StatCard
          label="ACTIVE"
          value={stats.active}
          icon={<Power className="h-5 w-5" />}
          tint="muted"
        />
      </div>

      <Card className="mt-7 border-border/70 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by table name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full border-border bg-background pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
            >
              <SelectTrigger className="h-11 w-42.5 rounded-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {TABLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="h-11 w-42.5 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                {TABLE_STATUS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-11 rounded-full px-6 py-3 bg-transparent hover:bg-muted/10 text-muted-foreground font-semibold"
              onClick={resetFilters}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Table2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No tables found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters, or create your first table.
            </p>
            <Button onClick={openCreate} className="mt-5 gap-2">
              <Plus className="h-4 w-4" /> New Table
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 overflow-hidden border-border/70 shadow-sm">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="bg-muted/40 hover:bg-muted/40">
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-4 text-xs uppercase tracking-wider text-muted-foreground"
                    >
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
                <TableRow key={row.id} className="hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
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

          <div className="flex flex-col items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-3">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {filtered.length === 0 ? 0 : startIndex + 1}
                </strong>
                –<strong className="text-foreground">{endIndex}</strong> of{" "}
                <strong className="text-foreground">{filtered.length}</strong>
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="h-8 w-27.5 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs">
                Page{" "}
                <strong className="text-foreground">{pageIndex + 1}</strong> of{" "}
                <strong className="text-foreground">
                  {Math.max(1, pageCount)}
                </strong>
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => table.setPageIndex(pageCount - 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <TableDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        initial={editing}
        onSave={handleSave}
        loading={isCreating || isEditing}
      />

      <AlertDialog
        open={deleteId != null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this table?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can't be undone. The table will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Tables;
