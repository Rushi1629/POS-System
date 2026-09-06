"use client";

import {
  BillListItem,
  Discount,
  GenerateBillRequest,
} from "@/types/billing-types";
import { OrderAdminChef } from "@/types/order-types";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Check, ChevronsUpDown, Plus, Receipt } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FetchTableResponse } from "@/types/table-types";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const GenerateBillDialog = ({
  tables,
  discounts,
  isGenerating,
  onClose,
  onSubmit,
}: {
  tables: FetchTableResponse[];
  discounts: Discount[];
  isGenerating: boolean;
  onClose: () => void;
  onSubmit: (payload: GenerateBillRequest) => Promise<BillListItem>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<GenerateBillRequest>({
    defaultValues: {
      tableId: "0",
      mobileNumber: "",
      discounts: [],
      notes: "",
    },
  });

  const selectedTableId = watch("tableId");
  const occupiedTables = tables.filter(
    (table) => table.tableStatus === "OCCUPIED",
  );

  // set default tableId
  // useEffect(() => {
  //   if (tables?.length > 0) {
  //     setValue("tableId", tables[0].id);
  //   }
  // }, [tables, setValue]);

  const submit = async (values: GenerateBillRequest) => {
    if (!values.tableId || values.tableId === "0") {
      toast.error("Please select table id");
      return;
    }

    try {
      const data = await onSubmit({
        tableId: values.tableId, // ✅ FIX
        mobileNumber: values.mobileNumber.trim(),
        discounts: (values.discounts ?? []).map((discount, index) => ({
          discountId: discount.discountId,
          sequence: index + 1,
        })),
        notes: values.notes.trim() || "n/a",
      });

      toast.success(`Bill ${data.billNumber} generated`);
      onClose();

      reset({
        tableId: tables[0]?.id ?? 0,
        mobileNumber: "",
        discounts: [],
        notes: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate bill",
      );
    }
  };

  return (
    <DialogContent className="sm:max-w-lg flex flex-col max-h-[80vh]">
      <DialogHeader className="pb-2">
        <DialogTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Generate Bill
        </DialogTitle>
        <DialogDescription>
          Enter the details to generate a bill.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(submit)}
        className="space-y-4 py-2 px-3 overflow-y-auto no-scrollbar"
      >
        {/* Table ID */}
        <div className="grid gap-2">
          <Label>Table ID</Label>

          {occupiedTables.length === 0 ? (
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              No occupied tables available for billing.
            </p>
          ) : (
            <Controller
              name="tableId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(val) => field.onChange(val)}
                  disabled={occupiedTables.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an occupied table" />
                  </SelectTrigger>

                  <SelectContent>
                    {occupiedTables.map((table) => (
                        <SelectItem key={table.id} value={String(table.id)}>
                          {table.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </div>

        {/* Mobile */}
        <div className="grid gap-2">
          <Label>Mobile Number</Label>
          <Input
            {...register("mobileNumber", {
              required: "Mobile number is required",
            })}
            placeholder="9167939647"
          />
          {errors.mobileNumber && (
            <p className="text-sm text-red-500">
              {errors.mobileNumber.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="grid gap-2">
          <Label>Notes</Label>
          <Textarea {...register("notes")} placeholder="Optional notes" />
        </div>

        {/* Discounts */}
        <div className="grid gap-2">
          <Label>Discounts</Label>

          <Controller
            name="discounts"
            control={control}
            render={({ field }) => {
              const selectedDiscounts = field.value ?? [];

              const toggleDiscount = (discountId: string) => {
                const exists = selectedDiscounts.some(
                  (item) => item.discountId === discountId,
                );

                if (exists) {
                  // Remove discount
                  const updated = selectedDiscounts
                    .filter((item) => item.discountId !== discountId)
                    .map((item, index) => ({
                      ...item,
                      sequence: index + 1,
                    }));

                  field.onChange(updated);
                } else {
                  // Add discount
                  field.onChange([
                    ...selectedDiscounts,
                    {
                      discountId,
                      sequence: selectedDiscounts.length + 1,
                    },
                  ]);
                }
              };

              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      {selectedDiscounts.length === 0
                        ? "Select discounts"
                        : `${selectedDiscounts.length} discount${
                            selectedDiscounts.length > 1 ? "s" : ""
                          } selected`}

                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-2"
                    align="start"
                  >
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {discounts.filter((d) => d.isActive).length === 0 ? (
                        <p className="p-2 text-sm text-muted-foreground">
                          No discounts available
                        </p>
                      ) : (
                        discounts
                          .filter((discount) => discount.isActive)
                          .map((discount) => {
                            const selected = selectedDiscounts.some(
                              (item) => item.discountId === discount.id,
                            );

                            return (
                              <div
                                key={discount.id}
                                className="flex items-center gap-2 rounded-md p-2 hover:bg-muted cursor-pointer"
                                onClick={() => toggleDiscount(discount.id)}
                              >
                                <Checkbox
                                  checked={selected}
                                  onCheckedChange={() =>
                                    toggleDiscount(discount.id)
                                  }
                                />

                                <div className="flex flex-1 flex-col">
                                  <span className="text-sm font-medium">
                                    {discount.name}
                                  </span>

                                  <span className="text-xs text-muted-foreground">
                                    {discount.type === "AMOUNT"
                                      ? `₹${discount.value} OFF`
                                      : `${discount.value}% OFF`}
                                  </span>
                                </div>

                                {selected && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            );
                          })
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isGenerating || occupiedTables.length === 0}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            {isGenerating ? "Generating…" : "Generate Bill"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default GenerateBillDialog;
