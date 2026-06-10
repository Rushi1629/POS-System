"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Users as UsersIcon,
  Loader2,
  UserPlus,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { UsersTable } from "@/components/UsersTable";
import { UserFormDialog } from "@/components/userFormDialog";
import {
  roleMap,
  roleReverseMap,
  type User,
  type UserFormValues,
} from "@/types/types";
import {
  useCreateUser,
  useDeleteUser,
  useEditUser,
  useFetchRoles,
  useFetchUsers,
} from "@/client/hooks/useUser";
import ApiLoader from "@/components/ApiLoader";

import { isEqual } from "lodash-es";
import { delay } from "@/utils/utils";

export default function UsersPage() {
  // const [users, setUsers] = useState<User[]>(seedUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<User | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { mutateAsync: createUserMutation } = useCreateUser();

  const { data: users = [], isLoading, error } = useFetchUsers();

  const { data: roles = [] } = useFetchRoles();

  const { mutate: deleteUser } = useDeleteUser();

  const { mutateAsync: editUser } = useEditUser();

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === "Admin").length;

    const recent = users.filter(
      (u) =>
        Date.now() - new Date(u.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7,
    ).length;

    return { total: users.length, admins, recent };
  }, [users]);

  // console.log(users, "users in page");

  const openCreate = () => {
    setFormMode("create");
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = async (user: User) => {
    setFormMode("edit");
    setEditing(null);
    setFormOpen(true);
    setLoadingForm(true);
    await delay(400);
    const fresh = users.find((u) => u.id === user.id) ?? user;
    setEditing(fresh);
    setLoadingForm(false);
  };

  if (isLoading) {
    return <ApiLoader message="Loading users..." />;
  }

  const handleCreate = async (values: UserFormValues) => {
    debugger;
    try {
      const role = roles.find((r) => r.name === values.role);

      if (!role) {
        toast.error("Invalid role selected");
        return;
      }
      const payload = {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        roleId: role.id,
        isActive: values.isActive,
        ...(values.password && { password: values.password }),
      };

      await createUserMutation(payload);

      toast.success("User created successfully - welcome to the team! 🎉");
      setFormOpen(false);
    } catch (err) {
      toast.error("Failed to create user");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteUser(deleteTarget.id);

      toast.success("User deleted successfully - goodbye! 👋");
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSubmit = async (values: UserFormValues) => {
    try {
      if (!editing) return;

      const role = roles.find((r) => r.name === values.role);

      if (!role) {
        toast.error("Invalid role selected");
        return;
      }

      // 🔥 CHECK IF ANYTHING CHANGED
      const isSame =
        editing.name === values.name &&
        editing.username === values.username &&
        editing.email === values.email &&
        editing.phoneNumber === values.phoneNumber &&
        editing.role === values.role &&
        editing.isActive === values.isActive; // ✅ ADD THIS

      if (isSame) {
        toast.info("No changes detected - nothing to update 🤔");
        setFormOpen(false);
        return; // 🚫 STOP API CALL
      }

      const payload = {
        name: values.name,
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        roleId: role.id,
        isActive: values.isActive,
      };

      await editUser({
        id: editing.id,
        data: payload,
      });

      toast.success("User updated successfully - welcome back! 🎉");
      setFormOpen(false);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const handleSubmit = async (values: UserFormValues) => {
    if (formMode === "create") {
      await handleCreate(values);
    } else {
      await handleEditSubmit(values);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: UsersIcon,
      tint: "bg-[#cd4805]/10 text-[#cd4805]",
    },
    {
      label: "Administrators",
      value: stats.admins,
      icon: ShieldCheck,
      tint: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Joined this week",
      value: stats.recent,
      icon: UserCheck,
      tint: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              User Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, edit and manage cafe team members and their access.
            </p>
          </div>
          <Button
            onClick={openCreate}
            size="lg"
            className="shadow-sm px-8 bg-[#f77f00] hover:bg-[#f77f00]/90 text-white"
          >
            <UserPlus className="h-4 w-4" />
            New User
          </Button>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((s) => (
            <Card key={s.label} className="border-border/60 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tint}`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/60 shadow-sm p-0">
          <CardContent className="p-0">
            <UsersTable
              users={users}
              roles={roles}
              onEdit={openEdit}
              onDelete={(u) => setDeleteTarget(u)}
              onCreate={openCreate}
            />
          </CardContent>
        </Card>
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={(o: any) => {
          if (!loadingForm) setFormOpen(o);
        }}
        roles={roles}
        mode={formMode}
        initialUser={editing}
        loading={loadingForm}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && !deleting && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete(); // 👈 HERE
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
