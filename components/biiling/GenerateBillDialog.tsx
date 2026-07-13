"use client";

import { BillListItem, GenerateBillRequest } from "@/types/billing-types";
import { OrderAdminChef } from "@/types/order-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Plus, Receipt } from "lucide-react";
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

const GenerateBillDialog = ({
  orders,
  isGenerating,
  onClose,
  onSubmit,
}: {
  orders: OrderAdminChef[];
  isGenerating: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    tableId: number;
    mobileNumber: string;
    notes: string;
  }) => Promise<BillListItem>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GenerateBillRequest>({
    defaultValues: {
      tableId: 0,
      mobileNumber: "",
      notes: "",
    },
  });

  const selectedTableId = watch("tableId");

  // set default tableId
  useEffect(() => {
    if (orders?.length > 0) {
      setValue("tableId", Number(orders[0]?.tableId ?? 0));
    }
  }, [orders, setValue]);

  const submit = async (values: GenerateBillRequest) => {
    if (!values.tableId || values.tableId === 0) {
      toast.error("Please select table id");
      return;
    }

    try {
      const data = await onSubmit({
        tableId: Number(values.tableId), // ✅ FIX
        mobileNumber: values.mobileNumber.trim(),
        notes: values.notes.trim() || "n/a",
      });

      toast.success(`Bill ${data.billNumber} generated`);
      onClose();

      reset({
        tableId: orders[0]?.tableId ?? 0,
        mobileNumber: "",
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

          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tables available</p>
          ) : (
            <Select
              value={selectedTableId?.toString()}
              onValueChange={(value) => setValue("tableId", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select table id" />
              </SelectTrigger>

              {/* <SelectContent>
                {Array.from(new Set(orders.map((o) => String(o.tableId)))).map(
                  (id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ),
                )}
              </SelectContent> */}
              <SelectContent>
                {Array.from(
                  new Map(
                    orders.map((o) => [o.tableId, o.tableName]), // ✅ unique tableId + name
                  ).entries(),
                ).map(([tableId, tableName]) => (
                  <SelectItem key={tableId} value={String(tableId)}>
                    {tableName} {/* ✅ show name */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        {/* Footer */}
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isGenerating || orders.length === 0}
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
