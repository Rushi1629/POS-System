"use client";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";
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
import Link from "next/link";
import MenuDialog from "@/components/MenuDialog";
import StatusPill from "@/components/StatusPill";
import VegBadge from "@/components/VegBadge";
import Thumb from "@/components/Thumb";
import { menuSchema } from "@/Schema/menuScheme";
import { MenuFormData, MenuItem } from "@/types/types";
import StatCard from "@/components/StatCard";
import MenuCard from "@/components/MenuCard";

const categoryList: Array<{ id: number; name: string }> = [
  { id: 1, name: "Pizza" },
  { id: 3, name: "Burger" },
  { id: 4, name: "Small Burger" },
  { id: 5, name: "Beverages" },
];

const seed: MenuItem[] = [
  {
    id: 8,
    name: "Veg Cheese Burger",
    price: 129.25,
    menuType: "Veg",
    description: "Veg cheese Burger with some sauces and toppings.",
    available: true,
    imageUrl: null,
    category: { id: 3, name: "Burger" },
    subMenuItems: [
      { id: 11, name: "Extra cheese.", price: 4.5, available: true, description: "Extra cheese." },
      { id: 12, name: "Extra sauce.", price: 2.5, available: true, description: "Extra sauce." },
    ],
  },
  {
    id: 9,
    name: "Veg Cheese Burger",
    price: 129.25,
    menuType: "Veg",
    description: "Veg cheese Burger with some sauces and toppings.",
    available: true,
    imageUrl: null,
    category: { id: 4, name: "Small Burger" },
    subMenuItems: [
      { id: 13, name: "Extra cheese.", price: 4.5, available: true, description: "Extra cheese." },
      { id: 14, name: "Extra sauce.", price: 2.5, available: true, description: "Extra sauce." },
    ],
  },
];

function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(seed);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("table");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const filtered = useMemo(() => {
    return items
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
          : String(m.category.id) === categoryFilter,
      )
      .filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase()),
      );
  }, [items, search, statusFilter, categoryFilter]);

  const stats = useMemo(
    () => ({
      total: items.length,
      available: items.filter((m) => m.available).length,
      veg: items.filter((m) => m.menuType === "Veg").length,
    }),
    [items],
  );

  const columns = useMemo<ColumnDef<MenuItem>[]>(
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
            ₹{row.original.price.toFixed(2)}
          </span>
        ),
      },
      {
        id: "submenu",
        header: "Add-ons",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.subMenuItems.length} item
            {row.original.subMenuItems.length === 1 ? "" : "s"}
          </span>
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
            <Button
              size="icon"
              variant="ghost"
              aria-label="More"
              className="h-9 w-9"
            >
              <MoreHorizontal className="h-4 w-4" />
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

  function openEdit(m: MenuItem) {
    setEditing(m);
    setDialogOpen(true);
  }

  function handleSave(data: MenuFormData) {
    const cat = categoryList.find((c) => c.id === data.categoryId);
    if (!cat) {
      toast.error("Invalid category");
      return;
    }
    if (editing) {
      setItems((prev) =>
        prev.map((m) =>
          m.id === editing.id
            ? {
                ...m,
                name: data.name,
                price: data.price,
                menuType: data.menuType,
                description: data.description ?? "",
                available: data.available,
                category: cat,
                subMenuItems: data.submenu.map((s, i) => ({
                  id: m.subMenuItems[i]?.id ?? Date.now() + i,
                  name: s.name,
                  price: s.price,
                  available: s.available,
                  description: s.description ?? "",
                })),
              }
            : m,
        ),
      );
      toast.success("Menu item updated");
    } else {
      setItems((prev) => [
        {
          id: Date.now(),
          name: data.name,
          price: data.price,
          menuType: data.menuType,
          description: data.description ?? "",
          available: data.available,
          imageUrl: null,
          category: cat,
          subMenuItems: data.submenu.map((s, i) => ({
            id: Date.now() + i + 1,
            name: s.name,
            price: s.price,
            available: s.available,
            description: s.description ?? "",
          })),
        },
        ...prev,
      ]);
      toast.success("Menu item created");
    }
    setDialogOpen(false);
    setEditing(null);
  }

  function confirmDelete() {
    if (deleteId == null) return;
    setItems((prev) => prev.filter((m) => m.id !== deleteId));
    toast.success("Menu item deleted");
    setDeleteId(null);
  }

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
          className="gap-2 bg-primary text-primary-foreground shadow-[var(--shadow-elegant)] hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Menu Item
        </Button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
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
              <SelectTrigger className="h-11 w-[170px] rounded-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categoryList.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="h-11 w-[170px] rounded-full">
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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No menu items found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters, or create your first menu item.
            </p>
            <Button onClick={openCreate} className="mt-5 gap-2">
              <Plus className="h-4 w-4" /> New Menu Item
            </Button>
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
                  {filtered.length === 0 ? 0 : startIndex + 1}
                </strong>
                –<strong className="text-foreground">{endIndex}</strong> of{" "}
                <strong className="text-foreground">{filtered.length}</strong>
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="h-8 w-[110px] rounded-full">
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
        initial={editing}
        onSave={handleSave}
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
