import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShieldCheck } from "lucide-react";
import { AddUserProps, UserFormValues, UserRole, empty } from "@/types/types";
import { getUserFields } from "@/types/user/config/userFields";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const baseSchema = {
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only"),
  email: z.string().trim().email("Invalid email").max(255),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  role: z.enum(["Super Admin", "Admin", "Chef", "Waiter", "Customer"]),
  isActive: z.boolean(),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const editSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .max(72)
    .optional()
    .refine(
      (v) => !v || v.length >= 6,
      "Password must be at least 6 characters",
    ),
});

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  roles,
  initialUser,
  loading,
  onSubmit,
}: AddUserProps) {
  // const [values, setValues] = useState<UserFormValues>(empty);
  // const [errors, setErrors] = useState<
  //   Partial<Record<keyof UserFormValues, string>>
  // >({});

  const schema = mode === "create" ? createSchema : editSchema;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: empty,
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialUser) {
        reset({
          name: initialUser.name,
          username: initialUser.username,
          email: initialUser.email,
          phoneNumber: initialUser.phoneNumber,
          role: initialUser.role,
          password: "",
          isActive: initialUser.isActive,
        });
      } else {
        reset(empty);
      }
    }
  }, [open, mode, initialUser, reset]);

  console.log(initialUser, "INITIAL USER");

  const onSubmitForm = async (data: UserFormValues) => {
    await onSubmit({
      ...data,
    });
  };

  const isLoadingFetch = mode === "edit" && loading && !initialUser;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[560px] p-0 overflow-hidden max-h-[85vh] flex flex-col"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="border-b bg-muted/30 px-6 py-5">
          <DialogTitle className="text-lg">
            {mode === "create" ? "Create New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new team member to your cafe workspace."
              : "Update account details and access level."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingFetch ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading user details...
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            autoComplete="off"
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {getUserFields(mode).map((f) => (
                  <div
                    key={f.key}
                    className={`space-y-1.5 ${f.full ? "sm:col-span-2" : ""}`}
                  >
                    <Label
                      htmlFor={f.key}
                      className="text-xs font-medium text-foreground"
                    >
                      {f.label}
                    </Label>
                    <div className="relative">
                      <f.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={f.key}
                        type={f.type ?? "text"}
                        placeholder={f.placeholder}
                        {...register(f.key)}
                        autoComplete={
                          f.key === "password"
                            ? "new-password"
                            : f.key === "email"
                              ? "new-email"
                              : "off"
                        }
                        aria-invalid={!!errors[f.key]}
                        className="pl-9"
                      />
                    </div>
                    {errors[f.key] && (
                      <p className="text-xs text-destructive">
                        {errors[f.key]?.message}
                      </p>
                    )}
                  </div>
                ))}

                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="role"
                    className="text-xs font-medium text-foreground"
                  >
                    Role
                  </Label>
                  <Select
                    value={watch("role")}
                    onValueChange={(v) => {
                      setValue("role", v as UserRole, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger id="role" className="w-full">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Role" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role: any) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-xs text-destructive">
                      {errors.role?.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 sm:col-span-2">
                  <div>
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Active
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable this user account.
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={watch("isActive")}
                    onCheckedChange={(val) =>
                      setValue("isActive", Boolean(val), {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="border-t bg-muted/30 px-4 py-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {(isSubmitting || loading) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "Create User" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
