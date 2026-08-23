import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { roleStyles, userProps, type User, type UserRole } from "@/types/types";

function initials(name?: string) {
  if (!name) return "NA"; // fallback

  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UsersTable({ users, onEdit, onDelete, roles }: userProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredData = useMemo(
    () =>
      roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter),
    [users, roleFilter],
  );

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-[#cd4805]/10 text-[#cd4805] text-xs font-semibold">
                  {initials(u.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {u.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  @{u.username}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Contact",
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-foreground">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{row.original.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{row.original.phoneNumber}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={`rounded-full ${roleStyles[row.original.role]}`}
          >
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Joined <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-2">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(row.original)}
              aria-label={`Edit ${row.original.name}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(row.original)}
              aria-label={`Delete ${row.original.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard?.writeText(row.original.email)
                  }
                >
                  <Mail className="h-3.5 w-3.5" /> Copy email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(row.original)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, username..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.roleId} value={role.name}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader className="bg-muted/40">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className="h-11 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-border/60">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {table.getRowModel().rows.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {filteredData.length}
          </span>{" "}
          users
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="px-2 text-xs text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {table.getPageCount() || 1}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
