import React, { useEffect } from "react";
import { IndianRupee, Loader2, Plus, Pencil, Type } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submenuSchema, SubmenuFormValues } from "@/Schema/submenuSchema";
import { SubmenuDialogProps } from "@/types/submenu-types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Button } from "../button";

function SubmenuDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  loading,
}: SubmenuDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmenuFormValues>({
    // ✅ FIX HERE
    resolver: zodResolver(submenuSchema),
    defaultValues: {
      name: "",
      price: 0,
      available: true,
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (initial) {
      // EDIT MODE
      reset({
        name: initial.name,
        price: initial.price,
        available: initial.available,
        description: initial.description || "",
      });
    } else {
      // CREATE MODE
      reset({
        name: "",
        price: 0,
        available: true,
        description: "",
      });
    }
  }, [open, initial, reset]);

  const onSubmit = async (values: SubmenuFormValues) => {
    try {
      const parsed = submenuSchema.parse(values);

      await onSave({
        ...parsed,
        price: String(parsed.price), // ✅ match backend
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save submenu");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Add-on" : "Create Add-on"}</DialogTitle>
          <DialogDescription>
            Add extra items like sauces, toppings, etc.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3 overflow-y-auto px-2 no-scrollbar">
          {/* Name */}
          <div className="grid gap-2">
            <Label>Name</Label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input {...register("name")} className="pl-9" />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label>Price</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="number" {...register("price")} className="pl-9" />
            </div>
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea placeholder="Description" {...register("description")} rows={3} />
          </div>

          {/* Available */}
          <div
            className="flex items-center justify-between border p-3 rounded-lg cursor-pointer"
            onClick={() => setValue("available", !watch("available"))}
          >
            <div>
              <Label className="text-sm">Available</Label>
              <p className="text-xs text-muted-foreground">
                Toggle availability
              </p>
            </div>

            <Switch
              checked={watch("available")}
              onCheckedChange={(v) => setValue("available", v)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : initial ? (
              <>
                <Pencil className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SubmenuDialog;
