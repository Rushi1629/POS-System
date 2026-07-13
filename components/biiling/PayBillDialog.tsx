import {
  BillListItem,
  PAYMENT_ICONS,
  PAYMENT_LABELS,
  PaymentMethod,
} from "@/types/billing-types";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CheckCircle2, IndianRupee } from "lucide-react";
import Row from "./Row";
import { Separator } from "../ui/separator";
import { inr } from "@/utils/utils";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../input";

interface PayBillFormData {
  method: PaymentMethod;
  notes: string;
  cashAmount: string;
  onlineAmount: string;
}

const PayBillDialog = ({
  bill,
  onClose,
  onPay,
  isPaying,
}: {
  bill: BillListItem;
  onClose: () => void;
  onPay: (
    bill: BillListItem,
    method: PaymentMethod,
    notes: string,
    splitPaymentData?: { cashAmount: number; onlineAmount: number },
  ) => Promise<void>;
  isPaying: boolean;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<PayBillFormData>({
    mode: "onChange",
    defaultValues: {
      method: "CASH",
      notes: bill.notes ?? "",
      cashAmount: "",
      onlineAmount: "",
    },
  });

  const method = watch("method");
  const notes = watch("notes");
  const cashAmount = watch("cashAmount");
  const onlineAmount = watch("onlineAmount");

  const totalAmount = parseFloat(bill.totalAmount);
  const cashAmt = parseFloat(cashAmount) || 0;
  const onlineAmt = parseFloat(onlineAmount) || 0;
  const isSplitPayment = method === "CASH_ONLINE";
  const isValidSplitPayment =
    isSplitPayment && Math.abs(cashAmt + onlineAmt - totalAmount) < 0.01;
  const isValidPayment = !isSplitPayment || isValidSplitPayment;

  const submit = async (data: PayBillFormData) => {
    try {
      if (isSplitPayment) {
        if (!isValidSplitPayment) {
          toast.error(
            `Split amounts must total ${totalAmount.toFixed(2)} (Cash: ${data.cashAmount}, Online: ${data.onlineAmount})`,
          );
          return;
        }
        await onPay(bill, data.method, data.notes || "na", {
          cashAmount: cashAmt,
          onlineAmount: onlineAmt,
        });
      } else {
        await onPay(bill, data.method, data.notes || "na");
      }
      toast.success(`Payment recorded via ${data.method}`);
    } catch {
      toast.error("Payment failed");
    }
  };
  return (
    <DialogContent className="sm:max-w-lg flex flex-col max-h-[80vh]">
      <DialogHeader className="pb-2">
        <DialogTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" /> Settle Bill
        </DialogTitle>
        <DialogDescription>
          Record payment for{" "}
          <span className="font-medium text-foreground">{bill.billNumber}</span>
          .
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(submit)} className="flex-1 overflow-y-auto px-1 py-3 space-y-4 no-scrollbar">
        <div className="">
        <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-2 text-sm">
          <Row
            label="Table"
            value={`${bill.session?.tableName} · ${bill.session?.guestCount} guests`}
          />
          <Row label="Subtotal" value={inr(bill.subtotal)} />
          <Row label="Time Charge Amount" value={inr(bill.timeChargeAmount)} />
          <Row label="Tax" value={inr(bill.taxAmount)} />
          <Row label="Discount" value={`- ${inr(bill.discountAmount)}`} />
          <Row label="Service" value={inr(bill.serviceCharge)} />
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Due</span>
            <span className="text-lg font-semibold text-primary">
              {inr(bill.totalAmount)}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["CASH", "CARD", "UPI", "CASH_ONLINE"] as PaymentMethod[]).map(
                (m) => {
                  const Icon = PAYMENT_ICONS[m];
                  const active = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setValue("method", m);
                        if (m !== "CASH_ONLINE") {
                          setValue("cashAmount", "");
                          setValue("onlineAmount", "");
                        }
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition",
                        active
                          ? "border-primary bg-primary/10 text-primary shadow-soft"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {PAYMENT_LABELS[m]}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {method === "CASH_ONLINE" && (
            <div className="grid gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
              <div className="text-sm font-medium text-amber-900 dark:text-amber-200">
                Enter split payment amounts (Total: {inr(totalAmount)})
              </div>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="cash-amount">Cash Amount</Label>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cash-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={totalAmount}
                      {...register("cashAmount")}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="online-amount">Online Amount</Label>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="online-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={totalAmount}
                      {...register("onlineAmount")}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white p-2 dark:bg-slate-900">
                  <span className="text-sm font-medium">Total Split</span>
                  <span
                    className={cn(
                      "font-semibold",
                      isValidSplitPayment
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    {inr(cashAmt + onlineAmt)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="pay-notes">Notes</Label>
            <Textarea
              id="pay-notes"
              rows={2}
              {...register("notes")}
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPaying || !isValidPayment}
          className="gap-1"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isPaying ? "Processing…" : `Pay ${inr(bill.totalAmount)}`}
        </Button>
      </DialogFooter>
    </form>
    </DialogContent>
  );
};

export default PayBillDialog;
