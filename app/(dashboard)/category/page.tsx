"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ImagePlus,
  LayoutGrid,
  List as ListIcon,
  CheckCircle2,
  XCircle,
  Tags,
  MoreHorizontal,
  ChevronsRight,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
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
import { Category } from "@/types/types";
import StatusPill from "@/components/StatusPill";
import CategoryDialog from "@/components/categoryDialog";
import StatCard from "@/components/StatCard";
import CategoryCard from "@/components/CategoryCard";
import Thumb from "@/components/Thumb";
import {
  useCreateCategory,
  useDeleteCategory,
  useEditCategory,
  useFetchCategories,
} from "@/client/hooks/useCategory";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { isEqual } from "lodash-es";

function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("table");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, error } = useFetchCategories(
    pagination.pageIndex + 1,
    pagination.pageSize,
    debouncedSearch,
    statusFilter,
  );

  const categories = data?.data ?? [];

  const total = data?.pagination.total ?? 0;

  const totalPages = data?.pagination.totalPages ?? 0;

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [search, statusFilter, view]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);

      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();

  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useEditCategory();

  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const openEdit = useCallback((cat: Category) => {
    setEditing(cat);
    setDialogOpen(true);
  }, []);

  // const filtered = useMemo(() => {
  //   return categories
  //     .filter((c) =>
  //       statusFilter === "all"
  //         ? true
  //         : statusFilter === "active"
  //           ? c.isActive
  //           : !c.isActive,
  //     )
  //     .filter(
  //       (c) =>
  //         (c.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
  //         (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  //     )
  //     .sort(
  //       (a, b) =>
  //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //     );
  // }, [categories, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c) => c.isActive).length,
      inactive: categories.filter((c) => !c.isActive).length,
    }),
    [categories],
  );

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        id: "image",
        header: "Image",
        cell: ({ row }) => (
          <Thumb src={row.original.imageUrl} name={row.original.name} />
          // <img
          //   src={row.original.imageUrl || "/placeholder.png"}
          //   alt={row.original.name}
          //   className="h-11 w-11 rounded-lg object-cover ring-1 ring-border"
          // />
        ),
      },
      {
        accessorKey: "name",
        header: "Category",
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="block max-w-md truncate text-sm text-muted-foreground">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => <StatusPill active={row.original.isActive} />,
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
              onClick={() => setDeleteTarget(row.original)}
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
            ></Button>
          </div>
        ),
      },
    ],
    [openEdit, setDeleteTarget],
  );

  const table = useReactTable({
    data: categories,
    columns,

    getCoreRowModel: getCoreRowModel(),
  });

  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;

  const pageCount = totalPages;

  const startIndex = total === 0 ? 0 : pageIndex * pageSize + 1;

  const endIndex = Math.min((pageIndex + 1) * pageSize, total);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  async function handleSave(formData: FormData, imageFile: File | null) {
    try {
      if (editing) {
        const payload = {
          name: String(formData.get("name") ?? ""),
          description: String(formData.get("description") ?? ""),
          isActive: formData.get("isActive") === "true",
        };

        const isSame = isEqual(
          {
            name: editing.name,
            description: editing.description,
            isActive: editing.isActive,
          },
          payload,
        );

        const hasImageChanged = formData.get("imageFile") instanceof File;

        if (isSame && !hasImageChanged) {
          toast.info("No changes detected 🤔");
          setDialogOpen(false);
          return;
        }

        await updateCategory({
          id: editing.id,
          data: formData,
        });

        toast.success("Category updated 👍");
      } else {
        await createCategory(formData);
        toast.success("Category created 🥳");
      }

      setDialogOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error("Something went wrong ❌");
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCategory(deleteTarget.id);

      toast.success("Category deleted successfully 👋");
      setDeleteTarget(null);
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="">
      {/* Title row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Category Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create, edit and organize your cafe menu categories.
          </p>
        </div>
        <Button
          size="lg"
          onClick={openCreate}
          className="gap-2 px-8 rounded-md bg-[#f77f00] hover:bg-[#f77f00]/90 text-white"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          label="TOTAL CATEGORIES"
          value={stats.total}
          icon={<Tags className="h-5 w-5" />}
          tint="primary"
        />
        <StatCard
          label="ACTIVE"
          value={stats.active}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tint="emerald"
        />
        <StatCard
          label="INACTIVE"
          value={stats.inactive}
          icon={<XCircle className="h-5 w-5" />}
          tint="muted"
        />
      </div>

      {/* Toolbar card */}
      <Card className="mt-7 border-border/70 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full border-border bg-[#fcf5f6] pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="h-11 w-40 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-full border p-1">
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

      {/* Content */}
      {categories.length === 0 ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            {isLoading ? (
              <>
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <h3 className="mt-4 text-lg font-semibold">
                  Loading menu items...
                </h3>
              </>
            ) : error ? (
              <>
                <XCircle className="h-14 w-14 text-destructive" />
                <h3 className="mt-4 text-lg font-semibold">
                  Something went wrong
                </h3>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No categories found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your search, or create your first category.
                </p>
                <Button
                  onClick={openCreate}
                  className="mt-5 gap-2 bg-[#f77f00] hover:bg-[#f77f00]/90 text-white px-6 py-2 rounded-md"
                >
                  <Plus className="h-4 w-4" /> New Category
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={() => openEdit(c)}
              onDelete={() => setDeleteTarget(c)}
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
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(value),
                  });
                }}
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
              <span>
                Showing{" "}
                <strong className="text-foreground">{startIndex}</strong>
                {" – "}
                <strong className="text-foreground">{endIndex}</strong> of{" "}
                <strong className="text-foreground">{total}</strong>
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: 0,
                    }))
                  }
                  disabled={pageIndex === 0}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: Math.max(prev.pageIndex - 1, 0),
                    }))
                  }
                  disabled={pageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: prev.pageIndex + 1,
                    }))
                  }
                  disabled={pageIndex >= pageCount - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: pageCount - 1,
                    }))
                  }
                  disabled={pageIndex >= pageCount - 1}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        initial={editing}
        onSave={handleSave}
        loading={isCreating || isUpdating}
      />
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can't be undone. The category will be permanently
              removed from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CategoriesPage;
