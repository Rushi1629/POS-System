"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Package,
  PackageX,
  Pencil,
  Plus,
  Search,
  Trash2,
  Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  apiDeleteInventory,
  apiUpdateInventory,
  CreateInventoryRequest,
  InventoryItem,
  MOCK_INVENTORY,
  stockState,
} from "@/types/inventory-types";
import StatCard from "@/components/inventory/StatCard";
import StockBadge from "@/components/inventory/StockBadge";
import InventoryFormDialog from "@/components/inventory/InventoryFormDialog";
import ViewItemDialog from "@/components/inventory/ViewItemDialog";
import {
  useCreateInventory,
  useDeleteInventory,
  useFetchAllInventory,
  useUpdateInventory,
} from "@/client/hooks/useInventory";

const PAGE_SIZES = [5, 10, 20];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"ALL" | "LOW" | "OUT" | "INACTIVE">("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [viewing, setViewing] = useState<InventoryItem | null>(null);
  const [deleting, setDeleting] = useState<InventoryItem | null>(null);

  const { data, isLoading, isError, refetch } = useFetchAllInventory(
    page,
    limit,
  );

  const { mutateAsync: createInventory, isPending: isCreating } =
    useCreateInventory();

  const { mutateAsync: updateInventory, isPending: isUpdating } =
    useUpdateInventory();

  const { mutateAsync: deleteInventory, isPending: isDeleting } =
    useDeleteInventory();

  useEffect(() => {
    if (!data) return;

    setItems(data.data.items);
    setPagination(data.data.pagination);
  }, [data]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      active: items.filter((i) => i.isActive).length,
      low: items.filter((i) => stockState(i) === "LOW").length,
      out: items.filter((i) => stockState(i) === "OUT").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const state = stockState(i);
      const matchesTab =
        tab === "ALL"
          ? true
          : tab === "LOW"
            ? state === "LOW"
            : tab === "OUT"
              ? state === "OUT"
              : !i.isActive;
      const matchesQuery =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [items, query, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  useEffect(() => {
    setPage(1);
  }, [query, tab, limit]);

  const handleFormSubmit = async (
    payload: CreateInventoryRequest,
    inventoryId?: string,
  ): Promise<void> => {
    try {
      if (inventoryId) {
        const res = await updateInventory({
          id: inventoryId,
          data: payload,
        });

        toast.success(res.message);
      } else {
        const res = await createInventory(payload);

        toast.success(res.message);
      }

      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : inventoryId
            ? "Failed to update inventory item"
            : "Failed to create inventory item",
      );

      throw error;
    }
  };

  async function handleToggleActive(item: InventoryItem) {
    const next = !item.isActive;

    try {
      const res = await updateInventory({
        id: item.inventoryId,
        data: {
          isActive: next,
        },
      });

      toast.success(`"${item.name}" is now ${next ? "active" : "inactive"}`);

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the item",
      );
    }
  }

  async function handleDelete() {
    if (!deleting) return;

    const target = deleting;

    try {
      const res = await deleteInventory(target.inventoryId);

      toast.success(res.message);

      setDeleting(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete the item",
      );
    }
  }

  return (
    <div className="">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Warehouse className="h-3.5 w-3.5 text-primary" />
            Stock &amp; Supplies
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of every ingredient and supply with live low-stock
            alerts.
          </p>
        </div>

        <Button
          size="lg"
          className="gap-2"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Items"
          value={stats.total}
          icon={Boxes}
          tone="primary"
        />
        <StatCard
          label="Active"
          value={stats.active}
          icon={Package}
          tone="success"
        />
        <StatCard
          label="Low Stock"
          value={stats.low}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Out of Stock"
          value={stats.out}
          icon={PackageX}
          tone="danger"
        />
      </section>

      <Card className="mt-6 overflow-hidden border-border/70 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by item name or SKU…"
                className="pl-9"
              />
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList>
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="LOW">Low</TabsTrigger>
                <TabsTrigger value="OUT">Out</TabsTrigger>
                <TabsTrigger value="INACTIVE">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30%]">Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-14 text-center">
                      <Boxes className="mx-auto h-8 w-8 text-muted-foreground/60" />
                      <p className="mt-3 text-sm font-medium text-foreground">
                        No inventory items found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try a different search, or add a new item.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((item) => {
                    const state = stockState(item);
                    return (
                      <TableRow key={item.inventoryId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                state === "OUT"
                                  ? "bg-destructive/10 text-destructive"
                                  : state === "LOW"
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-primary/10 text-primary",
                              )}
                            >
                              <Package className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {item.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                Updated{" "}
                                {new Date(item.updatedAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                            {item.sku}
                          </code>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {item.quantity}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            {item.unit}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.lowStockThreshold} {item.unit}
                        </TableCell>
                        <TableCell>
                          <StockBadge state={state} />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleActive(item)}
                            aria-label={`Toggle ${item.name}`}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open actions"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => setViewing(item)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditing(item);
                                  setFormOpen(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleting(item)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {pageItems.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filtered.length}
                </span>{" "}
                items
              </span>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span>Rows</span>
                <Select
                  value={String(limit)}
                  onValueChange={(v) => setLimit(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[72px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-9"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <InventoryFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setEditing(null);
          }
        }}
        editing={editing}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <ViewItemDialog
        item={viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the item and its stock record. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
