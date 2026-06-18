import {
  FetchTableResponse,
  TABLE_STATUS,
  TABLE_TYPES,
  TableFormValues,
  TableStatus,
  TableType,
} from "@/types/table-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Input } from "@/components/input";
import { useEffect, useState } from "react";
import { tableSchema } from "@/Schema/tableSchema";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";

function TableDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  loading,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: FetchTableResponse | null;
  onSave: (data: TableFormValues) => void;
  loading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: "",
      type: "FAMILY",
      // status: "AVAILABLE",
      capacity: 4,
      enableTimeRate: false,
      ratePerMinute: 0,
      isActive: true,
      chargePerPerson: false,
      // guestCount: 1,
    },
  });

  useEffect(() => {
    if (!open) return;

    console.log("TableDialog opened with initial:", initial);

    if (initial) {
      reset({
        name: initial.name,
        type: initial.type,
        // status: initial.status,
        capacity: initial.capacity,
        enableTimeRate: initial.enableTimeRate,
        ratePerMinute: Number(initial.ratePerMinute) || 0,
        isActive: initial.isActive,
        chargePerPerson: initial.chargePerPerson,
        // guestCount: Number(initial.guestCount) || 0,
      });
    } else {
      reset({
        name: "",
        type: "FAMILY",
        // status: "AVAILABLE",
        capacity: 4,
        enableTimeRate: false,
        ratePerMinute: 0,
        isActive: true,
        chargePerPerson: false,
        // guestCount: 1,
      });
    }
  }, [open, initial, reset]);

  const onSubmit: SubmitHandler<TableFormValues> = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Table" : "New Table"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update table details, capacity and billing rate."
              : "Add a new dining table to your floor plan."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 overflow-y-auto px-2 no-scrollbar">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Table name</Label>
            <Input id="name" placeholder="e.g. H-1" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select
                value={watch("type")}
                onValueChange={(v) => setValue("type", v as TableType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TABLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cap">Capacity</Label>
              <Input
                id="cap"
                type="number"
                min={1}
                {...register("capacity", { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className="text-xs text-destructive">
                  {errors.capacity.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="rate">Rate / minute (₹)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min={0}
                {...register("ratePerMinute", { valueAsNumber: true })}
              />
              {errors.ratePerMinute && (
                <p className="text-xs text-destructive">
                  {errors.ratePerMinute.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Enable time rate</p>
              <p className="text-xs text-muted-foreground">
                Charge by minute occupied
              </p>
            </div>
            <Switch
              checked={watch("enableTimeRate")}
              onCheckedChange={(v) => setValue("enableTimeRate", v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Charge per person</p>
              <p className="text-xs text-muted-foreground">
                Charge a fixed amount per person
              </p>
            </div>
            <Switch
              checked={watch("chargePerPerson")}
              onCheckedChange={(v) => setValue("chargePerPerson", v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">
                Available on POS floor
              </p>
            </div>
            <Switch
              checked={watch("isActive")}
              onCheckedChange={(v) => setValue("isActive", v)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : initial ? (
              <>
                <Pencil className="h-4 w-4" />
                Save changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create table
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TableDialog;
