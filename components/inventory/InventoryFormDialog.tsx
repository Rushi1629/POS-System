import { InventoryFormValues, inventorySchema } from "@/Schema/inventorySchema";
import {
  CreateInventoryRequest,
  INVENTORY_UNITS,
  InventoryItem,
} from "@/types/inventory-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../button";

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  editing: InventoryItem | null;

  onSubmit: (
    payload: CreateInventoryRequest,
    inventoryId?: string,
  ) => Promise<void>;

  isSubmitting: boolean;
}

const InventoryFormDialog = ({
  open,
  onOpenChange,
  editing,
  onSubmit,
  isSubmitting,
}: InventoryFormDialogProps) => {
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      sku: "",
      unit: "litre",
      quantity: 0,
      lowStockThreshold: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset(
      editing
        ? {
            name: editing.name,
            sku: editing.sku,
            unit: editing.unit,
            quantity: editing.quantity,
            lowStockThreshold: editing.lowStockThreshold,
            isActive: editing.isActive,
          }
        : {
            name: "",
            sku: "",
            unit: "litre",
            quantity: 0,
            lowStockThreshold: 0,
            isActive: true,
          },
    );
  }, [open, editing, form]);

  const handleSubmit = async (values: InventoryFormValues) => {
    const payload: CreateInventoryRequest = {
      name: values.name.trim(),
      sku: values.sku.trim(),
      unit: values.unit,
      quantity: Number(values.quantity),
      lowStockThreshold: Number(values.lowStockThreshold),
      isActive: values.isActive,
    };

    await onSubmit(payload, editing?.inventoryId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit inventory item" : "Add inventory item"}
          </DialogTitle>

          <DialogDescription>
            {editing
              ? "Update stock levels, unit or the low-stock threshold."
              : "Register a new ingredient or supply and set its low-stock alert."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 grid gap-5 py-2 overflow-y-auto px-2 no-scrollbar"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cooking Oil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. OIL-COOK-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {INVENTORY_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        {...field}
                        value={field.value as number | ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low at</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        {...field}
                        value={field.value as number | ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>

                    <FormDescription>
                      Inactive items stay hidden from kitchen stock checks.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Create item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;
