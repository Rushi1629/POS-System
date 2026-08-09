import { DiscountFormValues, discountSchema } from "@/Schema/discountSchema";
import { CreateDiscountRequest, Discount } from "@/types/discount-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Input } from "@/components/input";

const DiscountDialog = ({
  open,
  onOpenChange,
  onSubmit,
  discount,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: CreateDiscountRequest) => Promise<unknown> | void;
  discount?: Discount | null;
}) => {
  const isEditing = Boolean(discount);

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "AMOUNT",
      value: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: discount?.name ?? "",
      description: discount?.description ?? "",
      type: discount?.type ?? "AMOUNT",
      value: Number(discount?.value ?? 0),
      isActive: discount?.isActive ?? true,
    });
  }, [discount, form, open]);

  const type = form.watch("type");

  async function handleSubmit(values: DiscountFormValues) {
    try {
      await onSubmit({
        name: values.name,
        description: values.description,
        type: values.type,
        value: Number(values.value),
        isActive: values.isActive,
      });

      toast.success(isEditing ? "Discount updated" : "Discount created");
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error(isEditing ? "Could not update the discount" : "Could not create the discount");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit discount" : "Create discount"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the offer details and availability."
              : "Set up a flat amount or percentage offer for your customers."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 grid gap-5 py-2 overflow-y-auto px-2 no-scrollbar">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 50₹ OFF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AMOUNT">Flat Amount (₹)</SelectItem>
                        <SelectItem value="PERCENTAGE">
                          Percentage (%)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {type === "AMOUNT" ? "₹" : "%"}
                        </span>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          className="pl-7"
                          {...field}
                          value={field.value as number | ""} // ✅ FIX
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Optional note shown to your staff"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Make this discount available at billing.
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
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? isEditing
                    ? "Updating…"
                    : "Creating…"
                  : isEditing
                    ? "Save changes"
                    : "Create discount"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountDialog;
