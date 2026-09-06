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
  ImagePlus,
  LayoutGrid,
  List as ListIcon,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  Tags,
  UtensilsCrossed,
  Users,
  Table2,
  Receipt,
  Package,
  BarChart3,
  Bell,
  Settings,
  Clock,
  LogOut,
  Coffee,
  MoreHorizontal,
  Type,
  AlignLeft,
  IndianRupee,
  Leaf,
  Drumstick,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import MenuDialog from "@/components/MenuDialog";
import StatusPill from "@/components/StatusPill";
import VegBadge from "@/components/VegBadge";
import Thumb from "@/components/Thumb";
import { Category } from "@/types/types";
import StatCard from "@/components/StatCard";
import MenuCard from "@/components/MenuCard";
import {
  useCreateMenu,
  useDeleteMenu,
  useFetchMenus,
  useUpdateMenu,
} from "@/client/hooks/useMenu";
import { useFetchCategories } from "@/client/hooks/useCategory";
import { isEqual } from "lodash-es";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { allCategory, FetchMenuResponse } from "@/types/menu-types";

function MenuPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [search, setSearch] = useState("");

  const { data: menusResponse, isLoading: isMenuLoading } = useFetchMenus(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search,
  );

  const menus = menusResponse?.data ?? [];
  const serverPagination = menusResponse?.pagination;
  const { mutateAsync: createMenu, isPending: isCreating } = useCreateMenu();
  const { mutateAsync: updateMenu, isPending: isUpdating } = useUpdateMenu();
  const { mutateAsync: deleteMenu } = useDeleteMenu();

  const {
    data: categoryResponse,
    isPending: isFetchingCategories,
    isFetching,
    isError: categoryError,
  } = useFetchCategories(1, 1000, "", "all");

  const allCategory = categoryResponse?.data ?? [];

  useEffect(() => {
    if (categoryError) {
      toast.error("Failed to load categories");
    }
  }, [categoryError]);

  const [view, setView] = useState<"grid" | "table">("table");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FetchMenuResponse | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return menus
      .filter((m) =>
        statusFilter === "all"
          ? true
          : statusFilter === "available"
            ? m.available
            : !m.available,
      )
      .filter((m) =>
        categoryFilter === "all"
          ? true
          : String(m.category?.id) === categoryFilter,
      )
      .filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          (m.description || "").toLowerCase().includes(search.toLowerCase()),
      );
  }, [menus, search, statusFilter, categoryFilter]);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search, categoryFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: serverPagination?.total ?? menus.length,
      available: menus.filter((m) => m.available).length,
      veg: menus.filter((m) => m.menuType === "Veg").length,
      nonVeg: menus.filter((m) => m.menuType === "NonVeg").length,
    }),
    [menus, serverPagination?.total],
  );

  const columns = useMemo<ColumnDef<FetchMenuResponse>[]>(
    () => [
      {
        id: "image",
        header: "Item",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Thumb
              src={row.original.imageUrl ?? undefined}
              name={row.original.name}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {row.original.name}
                </span>
                {/* <VegBadge type={row.original.menuType} /> */}
                <VegBadge isVeg={row.original.menuType === "Veg"} />
              </div>
              <p className="max-w-xs truncate text-xs text-muted-foreground">
                {row.original.description || "—"}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="secondary" className="rounded-full font-medium">
            {row.original.category.name}
          </Badge>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-foreground">
            ₹{Number(row.original.price).toFixed(2)}
          </span>
        ),
      },
      {
        id: "submenu",
        header: "Add-ons",
        cell: ({ row }) => {
          const subs = row.original.subMenuItems;
          const count = subs.length;
          if (count === 0) {
            return <span className="text-sm text-muted-foreground">—</span>;
          }
          return (
            <HoverCard openDelay={120} closeDelay={80}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                  {count} add-on{count === 1 ? "" : "s"}
                </button>
              </HoverCardTrigger>
              <HoverCardContent side="top" align="start" className="w-72 p-0">
                <div className="border-b px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Add-ons for {row.original.name}
                  </p>
                </div>
                <ul className="max-h-64 divide-y overflow-auto">
                  {subs.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-start justify-between gap-3 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-foreground">
                            {s.name}
                          </span>
                          <span
                            className={`inline-block h-1.5 w-1.5 rounded-full ${
                              s.available
                                ? "bg-emerald-500"
                                : "bg-muted-foreground/40"
                            }`}
                            aria-label={
                              s.available ? "Available" : "Unavailable"
                            }
                          />
                        </div>
                        {s.description ? (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {s.description}
                          </p>
                        ) : null}
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                        ₹{Number(s.price).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          );
        },
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
    data: menus,
    columns,

    state: {
      pagination,
    },

    onPaginationChange: setPagination,

    manualPagination: true,

    pageCount: serverPagination?.totalPages ?? 0,

    getCoreRowModel: getCoreRowModel(),

    autoResetPageIndex: false,
  });

  const pageCount = serverPagination?.totalPages ?? 0;
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const totalItems = serverPagination?.total ?? 0;

  const startIndex = totalItems === 0 ? 0 : pageIndex * pageSize + 1;

  const endIndex = Math.min((pageIndex + 1) * pageSize, totalItems);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(m: FetchMenuResponse) {
    setEditing(m);
    setDialogOpen(true);
  }

  async function handleSave(formData: FormData) {
    try {
      if (editing) {
        const data = JSON.parse(String(formData.get("data") || "{}"));

        const normalizeSubmenu = (
          items: Array<{ subMenuItemId?: string }> = [],
        ) =>
          [...items]
            .filter(
              (item) =>
                item?.subMenuItemId !== undefined &&
                item?.subMenuItemId !== null &&
                String(item.subMenuItemId).trim() !== "",
            )
            .map((item) => String(item.subMenuItemId))
            .sort();

        const payload = {
          name: data.name,
          description: data.description,
          price: data.price,
          menuType: data.menuType,
          available: data.available,
          categoryId: data.categoryId,
          submenu: normalizeSubmenu(data.submenu),
        };

        const isSame = isEqual(
          {
            name: editing.name,
            description: editing.description,
            price: Number(editing.price),
            menuType: editing.menuType,
            available: editing.available,
            categoryId: editing.category?.id,
            submenu: normalizeSubmenu(
              (editing.subMenuItems || []).map((item) => ({
                subMenuItemId: item.id,
              })),
            ),
          },
          payload,
        );

        const hasImageChanged = formData.get("imageFile") instanceof File;

        if (isSame && !hasImageChanged) {
          toast.info("No changes detected 🤔");
          setDialogOpen(false);
          return;
        }

        await updateMenu({
          id: String(editing.id),
          formData: formData,
        });

        toast.success("Menu updated 👍");
      } else {
        await createMenu(formData);
        toast.success("Menu created 🥳");
      }

      setDialogOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error("Something went wrong while saving ❌");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await deleteMenu(String(deleteId));

      toast.success("Menu Deleted Sucessfully 🗑  ️");
      setDeleteId(null);
    } catch {
      toast.error("Delete failed ❌");
    } finally {
      setDialogOpen(false);
    }
  }

  const mapCategoryToAllCategory = (c: Category): allCategory => ({
    id: String(c.id), // ✅ UUID remains string
    name: c.name,
  });

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Menu Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create, edit and manage menu items, pricing and add-ons.
          </p>
        </div>
        <Button
          size="lg"
          onClick={openCreate}
          className="gap-2 bg-primary text-primary-foreground shadow-(--shadow-elegant) hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Menu Item
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
        <StatCard
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
        />
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
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v)}
            >
              <SelectTrigger className="h-11 w-42.5 rounded-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>

                {isFetchingCategories || isFetching ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : allCategory.length > 0 ? (
                  allCategory.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    No categories
                  </SelectItem>
                )}
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

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
            {isMenuLoading ? (
              <>
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <h3 className="mt-4 text-lg font-semibold">
                  Loading menu items...
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
                  Try adjusting your filters, or create your first menu item.
                </p>
                <Button onClick={openCreate} className="mt-5 gap-2">
                  <Plus className="h-4 w-4" /> New Menu Item
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <MenuCard
              key={m.id}
              item={m}
              onEdit={() => openEdit(m)}
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
                  {totalItems === 0 ? 0 : startIndex}
                </strong>
                –<strong className="text-foreground">{endIndex}</strong> of{" "}
                <strong className="text-foreground">{totalItems}</strong>
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

      <MenuDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        allCategory={allCategory.map(mapCategoryToAllCategory)}
        initial={editing}
        onSave={handleSave}
        loading={isCreating || isUpdating}
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

export default MenuPage;
