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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  AtSign,
  Lock,
  ShieldCheck,
} from "lucide-react";
import type { User, UserFormValues, UserRole } from "@/types/types";

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
    .regex(/^\+?[0-9\s-]{7,20}$/, "Invalid phone number"),
  role: z.enum(["Admin", "Manager", "Staff"]),
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialUser?: User | null;
  loading?: boolean;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

const empty: UserFormValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "Staff",
};

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  initialUser,
  loading,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<UserFormValues>(empty);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormValues, string>>
  >({});

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialUser) {
        setValues({
          name: initialUser.name,
          username: initialUser.username,
          email: initialUser.email,
          phoneNumber: initialUser.phoneNumber,
          role: initialUser.role,
          password: "",
        });
      } else {
        setValues(empty); // ✅ reset for create
      }
      setErrors({});
    } else {
      // ✅ VERY IMPORTANT: reset when dialog closes
      setValues(empty);
      setErrors({});
    }
  }, [open, mode, initialUser]);

  const update = <K extends keyof UserFormValues>(
    key: K,
    val: UserFormValues[K],
  ) => {
    setValues((v) => ({ ...v, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const schema = mode === "create" ? createSchema : editSchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof UserFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof UserFormValues;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await onSubmit(values);
  };

  const isLoadingFetch = mode === "edit" && loading && !initialUser;

  type FieldDef = {
    key: keyof Omit<UserFormValues, "role">;
    label: string;
    type?: string;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
    full?: boolean;
  };

  const fields: FieldDef[] = [
    {
      key: "name",
      label: "Full Name",
      placeholder: "Jane Doe",
      icon: UserIcon,
      full: true,
    },
    {
      key: "username",
      label: "Username",
      placeholder: "janedoe",
      icon: AtSign,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "jane@cafe.io",
      icon: Mail,
    },
    {
      key: "phoneNumber",
      label: "Phone",
      placeholder: "+1 555 123 4567",
      icon: Phone,
    },
    {
      key: "password",
      label: mode === "edit" ? "Password (leave blank to keep)" : "Password",
      type: "password",
      placeholder: "••••••••",
      icon: Lock,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden">
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
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
              {fields.map((f) => (
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
                      value={values[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
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
                    <p className="text-xs text-destructive">{errors[f.key]}</p>
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
                  value={values.role}
                  onValueChange={(v) => update("role", v as UserRole)}
                >
                  <SelectTrigger id="role" className="w-full">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin — full access</SelectItem>
                    <SelectItem value="Manager">
                      Manager — operations
                    </SelectItem>
                    <SelectItem value="Staff">
                      Staff — limited access
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-xs text-destructive">{errors.role}</p>
                )}
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
              <Button
                type="submit"
                className="bg-[#e25f28] hover:bg-[#e25f28]/90 px-4 py-2"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create User" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
