import {
  apiPayBill,
  BillListItem,
  PAYMENT_ICONS,
  PaymentMethod,
} from "@/types/billing-types";
import React, { useState } from "react";
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

const PayBillDialog = ({
  bill,
  onClose,
  onPaid,
}: {
  bill: BillListItem;
  onClose: () => void;
  onPaid: (b: BillListItem) => void;
}) => {
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [notes, setNotes] = useState(bill.notes ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const data = await apiPayBill({
        billingId: bill.id,
        paymentMethod: method,
        notes: notes || "na",
      });
      onPaid({ ...bill, ...data });
      toast.success(`Payment recorded via ${method}`);
    } catch {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent className="sm:max-w-lg flex flex-col max-h-[80vh]">
      <DialogHeader className="sticky top-0 z-10 pb-2">
        <DialogTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" /> Settle Bill
        </DialogTitle>
        <DialogDescription>
          Record payment for{" "}
          <span className="font-medium text-foreground">{bill.billNumber}</span>
          .
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
        <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-2 text-sm">
          <Row
            label="Table"
            value={`${bill.session.tableName} · ${bill.session.guestCount} guests`}
          />
          <Row label="Subtotal" value={inr(bill.subtotal)} />
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
            <div className="grid grid-cols-4 gap-2">
              {(["CASH", "CARD", "UPI", "WALLET"] as PaymentMethod[]).map(
                (m) => {
                  const Icon = PAYMENT_ICONS[m];
                  const active = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition",
                        active
                          ? "border-primary bg-primary/10 text-primary shadow-soft"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {m}
                    </button>
                  );
                },
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pay-notes">Notes</Label>
            <Textarea
              id="pay-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={loading} className="gap-1">
          <CheckCircle2 className="h-4 w-4" />
          {loading ? "Processing…" : `Pay ${inr(bill.totalAmount)}`}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PayBillDialog;
