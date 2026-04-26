import { AtSign, Mail, Phone, Lock, User as UserIcon } from "lucide-react";
import { FieldDef } from "@/types/types";

export const getUserFields = (mode: "create" | "edit"): FieldDef[] => [
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
    label:
      mode === "edit"
        ? "Password (leave blank to keep)"
        : "Password",
    type: "password",
    placeholder: "••••••••",
    icon: Lock,
  },
];