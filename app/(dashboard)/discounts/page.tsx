"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  IndianRupee,
  Pencil,
  Percent,
  Plus,
  Search,
  Sparkles,
  Tag,
  ToggleLeft,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
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
  CreateDiscountRequest,
  Discount,
  formatDiscountValue,
} from "@/types/discount-types";
import DiscountDialog from "@/components/discounts/discountDialog";
import {
  useCreateDiscount,
  useDeleteDiscount,
  useEditDiscount,
  useFetchDiscounts,
} from "@/client/hooks/useDiscount";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function DiscountsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const queryClient = useQueryClient();

  const { data: discounts = [], isLoading } = useFetchDiscounts();
  const { mutateAsync: createDiscount, isPending: isCreating } =
    useCreateDiscount();
  const { mutateAsync: updateDiscount, isPending: isUpdating } =
    useEditDiscount();
  const { mutateAsync: deleteDiscountMutation, isPending: isDeleting } =
    useDeleteDiscount();
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);

  const stats = useMemo(() => {
    const active = discounts.filter((d) => d.isActive).length;
    return {
      total: discounts.length,
      active,
      amount: discounts.filter((d) => d.type === "AMOUNT").length,
      percentage: discounts.filter((d) => d.type === "PERCENTAGE").length,
    };
  }, [discounts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return discounts.filter((d) => {
      const matchesTab =
        tab === "ALL" || (tab === "ACTIVE" ? d.isActive : !d.isActive);
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [discounts, query, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [query, tab]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedDiscounts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);

  async function handleToggle(discount: Discount) {
    const next = !discount.isActive;
    const previous = discounts;

    queryClient.setQueryData<Discount[]>(["Discounts"], (current = []) =>
      current.map((d) =>
        d.id === discount.id
          ? { ...d, isActive: next, updatedAt: new Date().toISOString() }
          : d,
      ),
    );

    try {
      await updateDiscount({ id: discount.id, data: { isActive: next } });
      toast.success(
        `"${discount.name}" is now ${next ? "active" : "inactive"}`,
      );
    } catch {
      queryClient.setQueryData<Discount[]>(["Discounts"], previous);
      toast.error("Could not update the discount");
    }
  }

  async function handleSubmitDiscount(data: CreateDiscountRequest) {
    if (editingDiscount) {
      await updateDiscount({ id: editingDiscount.id, data });
      return;
    }

    await createDiscount(data);
  }

  function openDeleteDialog(discount: Discount) {
    setDeleteTarget(discount);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteDiscountMutation(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" was deleted`);
    } catch {
      toast.error("Could not delete the discount");
    } finally {
      setDeleteTarget(null);
    }
  }

  function openCreateDialog() {
    setEditingDiscount(null);
    setOpen(true);
  }

  function openEditDialog(discount: Discount) {
    setEditingDiscount(discount);
    setOpen(true);
  }

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Offers &amp; Promotions
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Discounts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create flat amount or percentage offers and control which ones are
            live.
          </p>
        </div>

        <Button size="lg" className="gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New Discount
        </Button>
        <DiscountDialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setEditingDiscount(null);
          }}
          onSubmit={handleSubmitDiscount}
          discount={editingDiscount}
        />
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Discounts"
          value={stats.total}
          icon={Tag}
          tone="primary"
        />
        <StatCard
          label="Active"
          value={stats.active}
          icon={ToggleLeft}
          tone="success"
        />
        <StatCard
          label="Flat Amount"
          value={stats.amount}
          icon={IndianRupee}
          tone="info"
        />
        <StatCard
          label="Percentage"
          value={stats.percentage}
          icon={Percent}
          tone="warning"
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
                placeholder="Search discounts by name or description…"
                className="pl-9"
              />
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList>
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                <TabsTrigger value="INACTIVE">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[36%]">Discount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-14 text-center">
                    <BadgePercent className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <p className="mt-3 text-sm font-medium text-foreground">
                      No discounts found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try a different search, or create a new discount.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDiscounts.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            d.type === "AMOUNT"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent text-accent-foreground",
                          )}
                        >
                          {d.type === "AMOUNT" ? (
                            <IndianRupee className="h-4 w-4" />
                          ) : (
                            <Percent className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {d.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {d.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {d.type === "AMOUNT" ? "Flat Amount" : "Percentage"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {formatDiscountValue(d)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          d.isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            d.isActive
                              ? "bg-primary"
                              : "bg-muted-foreground/60",
                          )}
                        />
                        {d.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={d.isActive}
                          onCheckedChange={() => handleToggle(d)}
                          aria-label={`Toggle ${d.name}`}
                          disabled={isUpdating || isDeleting}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(d)}
                          aria-label={`Edit ${d.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(d)}
                          aria-label={`Delete ${d.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-27.5 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 8, 10, 20].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-4">
                <span className="text-xs">
                  Page <strong className="text-foreground">{page}</strong> of{" "}
                  <strong className="text-foreground">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    aria-label="First page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    aria-label="Last page"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this discount?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected discount will be
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

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: "primary" | "success" | "info" | "warning";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-secondary text-secondary-foreground",
    info: "bg-accent text-accent-foreground",
    warning: "bg-muted text-foreground",
  };
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
