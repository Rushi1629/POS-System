import { BillListItem, STATUS_STYLES } from "@/types/billing-types";
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Receipt } from "lucide-react";
import InfoTile from "../InfoTile";
import { fmtDate, inr } from "@/utils/utils";
import Row from "./Row";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const ViewBillDialog = ({ bill }: { bill: BillListItem }) => {
  return (
    <DialogContent className="sm:max-w-lg flex flex-col max-h-[80vh]">
      <DialogHeader className="pb-2">
        <DialogTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" /> {bill.billNumber}
        </DialogTitle>
        <DialogDescription>
          Full breakdown of the customer bill.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoTile
            label="Table"
            value={`${bill?.session?.tableName} (${bill?.session?.tableType})`}
          />
          <InfoTile label="Guests" value={String(bill.session?.guestCount)} />
          <InfoTile label="Mobile" value={bill.mobileNumber} />
          <InfoTile label="Created" value={fmtDate(bill.createdAt)} />
          <InfoTile label="Paid At" value={fmtDate(bill.paidAt)} />
          <InfoTile label="Method" value={bill.paymentMethod ?? "—"} />
        </div>

        {bill.order && bill.order.items.length > 0 && (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order Items · {bill.order.orderNumber}
            </div>
            <div className="divide-y divide-border/60">
              {bill.order.items.map((it,index) => (
                <div key={index} className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {it.menuItemName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {it.quantity} × {inr(it.unitPrice)}
                        {it.notes && it.notes !== "n/a" ? ` · ${it.notes}` : ""}
                      </div>
                    </div>
                    <div className="font-semibold">{inr(it.totalPrice)}</div>
                  </div>
                  {it.subMenuItems.length > 0 && (
                    <div className="pl-3 border-l-2 border-primary/30 space-y-0.5">
                      {it.subMenuItems.map((s,index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs text-muted-foreground"
                        >
                          <span>
                            + {s.subMenuItemName} × {s.quantity}
                          </span>
                          <span>{inr(s.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2 text-sm">
          <Row label="Subtotal" value={inr(bill.subtotal)} />
          <Row
            label="Time Charge Amount"
            value={inr(bill.timeChargeAmount ?? 0)}
          />
          <Row label="Tax" value={inr(bill.taxAmount)} />
          <Row label="Discount" value={`- ${inr(bill.discountAmount)}`} />
          <Row label="Service Charge" value={inr(bill.serviceCharge)} />
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">
              {inr(bill.totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">Status</span>
            <Badge
              className={cn("border-0", STATUS_STYLES[bill.paymentStatus])}
            >
              {bill.paymentStatus}
            </Badge>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ViewBillDialog;
