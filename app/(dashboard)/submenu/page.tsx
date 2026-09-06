"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Pencil,
  Trash2,
  UtensilsCrossed,
  CheckCircle2,
  Leaf,
  Drumstick,
  ChevronsRight,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import SubmenuDialog from "@/components/submenu/SubmenuDialog";
import { toast } from "sonner";
import { FetchSubmenuItem, SubmenuItemPayload } from "@/types/submenu-types";
import {
  useCreateSubmenu,
  useDeleteSubMenu,
  useFetchSubMenus,
  useUpdateSubMenu,
} from "@/client/hooks/useSubmenu";
import StatCard from "@/components/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import StatusPill from "@/components/StatusPill";
import SubMenuCard from "@/components/submenu/submenuCard";

function SubmenuPage() {
  const { mutateAsync: createSubmenu, isPending: isCreatingSubmenu } =
    useCreateSubmenu();
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: submenuResponse, isLoading } = useFetchSubMenus(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
  );
  const items = submenuResponse?.data ?? [];
  const { mutateAsync: updateSubmenu, isPending: isUpdating } =
    useUpdateSubMenu();
  const { mutateAsync: deleteSubmenu } = useDeleteSubMenu();

  const [view, setView] = useState<"grid" | "table">("table");
  const [submenuDialogOpen, setSubmenuDialogOpen] = useState(false);
  const [submenuEditing, setSubmenuEditing] = useState<FetchSubmenuItem | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const filtered = items;

  useEffect(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, [search]);

  function openCreateSubmenu() {
    setSubmenuEditing(null);
    setSubmenuDialogOpen(true);
  }
  function openEditSubmenu(m: FetchSubmenuItem) {
    setSubmenuEditing(m);
    setSubmenuDialogOpen(true);
  }

  async function handleSaveSubmenu(data: SubmenuItemPayload): Promise<void> {
    try {
      if (submenuEditing) {
        // ✅ UPDATE
        await updateSubmenu({
          id: submenuEditing.id,
          data: {
            name: data.name,
            price: String(data.price),
            available: data.available,
            description: data.description || "",
          },
        });

        toast.success("Submenu updated ✏️");
      } else {
        // ✅ CREATE
        await createSubmenu({
          name: data.name,
          price: String(data.price),
          available: data.available,
          description: data.description || "",
        });

        toast.success("Submenu created 🥳");
      }

      setSubmenuDialogOpen(false);
      setSubmenuEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed ❌");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await deleteSubmenu(deleteId);

      toast.success("Submenu Deleted Sucessfully 🗑  ️");
      setDeleteId(null);
    } catch {
      toast.error("Delete failed ❌");
    }
  }

  const stats = useMemo(
    () => ({
      total: submenuResponse?.pagination?.total ?? items.length,
      available: items.filter((m) => m.available).length,
      // veg: items.filter((m) => m.menuType === "Veg").length,
      // nonVeg: items.filter((m) => m.menuType === "NonVeg").length,
    }),
    [items, submenuResponse?.pagination?.total],
  );

  // ✅ TABLE COLUMNS
  const columns = useMemo<ColumnDef<FetchSubmenuItem>[]>(
    () => [
      {
        accessorKey: "name", // ✅ FIX
        header: "Name",
        cell: ({ row }) => (
          <Badge variant="secondary" className="rounded-full font-medium">
            {row.original.name}
          </Badge>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <span>{row.original.description || "-"}</span>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span>₹{Number(row.original.price).toFixed(2)}</span>
        ),
      },
      {
        accessorKey: "available",
        header: "Status",
        cell: ({ row }) => <StatusPill active={row.original.available} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            {/* EDIT */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => openEditSubmenu(row.original)}
              className="h-9 w-9"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {/* DELETE */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDeleteId(row.original.id)}
              className="h-9 w-9 text-destructive hover:bg-destructive/10"
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const pageCount = submenuResponse?.pagination?.totalPages ?? 1;
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + filtered.length, submenuResponse?.pagination?.total ?? 0);

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Submenu Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create, edit and manage menu items, pricing and add-ons.
          </p>
        </div>
        <Button
          size="lg"
          onClick={openCreateSubmenu}
          className="gap-2 bg-primary text-primary-foreground shadow-(--shadow-elegant) hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Submenu Item
        </Button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-4">
        <StatCard
          label="TOTAL ITEMS"
          value={stats.total}
          icon={<UtensilsCrossed className="h-5 w-5" />}
          tint="primary"
        />
        <StatCard
          label="AVAILABLE"
          value={stats.available}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tint="emerald"
        />
        {/* <StatCard
          label="VEGETARIAN"
          value={stats.veg}
          icon={<Leaf className="h-5 w-5" />}
          tint="muted"
        />
        <StatCard
          label="NON-VEGETARIAN"
          value={stats.nonVeg}
          icon={<Drumstick className="h-5 w-5" />}
          tint="nonveg"
        /> */}
      </div>

      <Card className="mt-7 border-border/70 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full border-border bg-background pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border bg-background p-1">
              <Button
                size="sm"
                variant={view === "table" ? "default" : "ghost"}
                onClick={() => setView("table")}
                className="h-8 rounded-full px-3"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={view === "grid" ? "default" : "ghost"}
                onClick={() => setView("grid")}
                className="h-8 rounded-full px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            {isLoading ? (
              <>
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <h3 className="mt-4 text-lg font-semibold">
                  Loading Submenu items...
                </h3>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No menu items found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your filters, or create your first Submenu item.
                </p>
                <Button onClick={openCreateSubmenu} className="mt-5 gap-2">
                  <Plus className="h-4 w-4" /> New SubMenu Item
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <SubMenuCard
              key={m.id}
              item={m}
              onEdit={() => openEditSubmenu(m)}
              onDelete={() => setDeleteId(m.id)}
            />
          ))}
        </div>
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
                <strong className="text-foreground">
                  {submenuResponse?.pagination?.total ?? 0}
                </strong>
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) =>
                  setPagination({ pageIndex: 0, pageSize: Number(v) })
                }
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
                  onClick={() =>
                    setPagination((current) => ({ ...current, pageIndex: 0 }))
                  }
                  disabled={pageIndex === 0 || isLoading}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setPagination((current) => ({
                      ...current,
                      pageIndex: Math.max(0, current.pageIndex - 1),
                    }))
                  }
                  disabled={pageIndex === 0 || isLoading}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setPagination((current) => ({
                      ...current,
                      pageIndex: Math.min(pageCount - 1, current.pageIndex + 1),
                    }))
                  }
                  disabled={pageIndex >= pageCount - 1 || isLoading}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setPagination((current) => ({
                      ...current,
                      pageIndex: Math.max(0, pageCount - 1),
                    }))
                  }
                  disabled={pageIndex >= pageCount - 1 || isLoading}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <SubmenuDialog
        open={submenuDialogOpen}
        onOpenChange={(o) => {
          setSubmenuDialogOpen(o);
          if (!o) setSubmenuEditing(null);
        }}
        initial={submenuEditing}
        onSave={handleSaveSubmenu} // ✅ FIXED
        loading={isCreatingSubmenu}
      />

      <AlertDialog
        open={deleteId != null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can't be undone. The menu item and its add-ons will be
              permanently removed.
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

export default SubmenuPage;
