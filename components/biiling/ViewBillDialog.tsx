"use client";

import { BillListItem, STATUS_STYLES } from "@/types/billing-types";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Printer as PrinterIcon, Receipt } from "lucide-react";
import InfoTile from "../InfoTile";
import { fmtDate, inr } from "@/utils/utils";
import Row from "./Row";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

type ThermalSerialPort = {
  open: (options: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  writable?: {
    getWriter: () => {
      write: (data: Uint8Array) => Promise<void>;
      releaseLock: () => void;
    };
  };
};

type ThermalSerial = {
  requestPort: () => Promise<ThermalSerialPort>;
};

const receiptAmount = (value: string | number | null | undefined) =>
  `Rs. ${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ReceiptPreviewRow = ({
  left,
  right,
  bold = false,
}: {
  left: string;
  right: string;
  bold?: boolean;
}) => (
  <div className={`flex justify-between gap-2 ${bold ? "font-bold" : ""}`}>
    <span className="min-w-0 break-words">{left}</span>
    <span className="shrink-0 text-right">{right}</span>
  </div>
);

const ThermalReceiptPreview = ({ bill }: { bill: BillListItem }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="w-full max-w-[320px] bg-white px-4 py-5 font-mono text-[11px] leading-relaxed text-black shadow-md">
      <div className="text-center">
        <div className="text-sm font-bold">BILL RECEIPT</div>
        <div>{"=".repeat(32)}</div>
      </div>
      <div className="space-y-1">
        <ReceiptPreviewRow left="Bill No." right={bill.billNumber} />
        <ReceiptPreviewRow left="Date" right={fmtDate(bill.createdAt)} />
        <ReceiptPreviewRow
          left="Table"
          right={`${bill.session?.tableName ?? "—"} (${
            bill.session?.tableType ?? "—"
          })`}
        />
        <ReceiptPreviewRow
          left="Guests"
          right={String(bill.session?.guestCount ?? "—")}
        />
        <ReceiptPreviewRow left="Mobile" right={bill.mobileNumber || "—"} />
      </div>

      <div className="my-2 border-t border-dashed border-black" />
      <div className="mb-1 font-bold">ITEMS</div>
      <div className="space-y-2">
        {bill.order?.items.map((item, itemIndex) => (
          <div key={`preview-item-${itemIndex}`}>
            <ReceiptPreviewRow
              left={`${item.quantity} x ${item.menuItemName}`}
              right={receiptAmount(item.totalPrice)}
            />
            {item.subMenuItems.map((subItem, subItemIndex) => (
              <ReceiptPreviewRow
                key={`preview-item-${itemIndex}-sub-${subItemIndex}`}
                left={`  + ${subItem.subMenuItemName} x ${subItem.quantity}`}
                right={receiptAmount(subItem.totalPrice)}
              />
            ))}
            {item.notes && item.notes !== "n/a" && (
              <div className="break-words">Note: {item.notes}</div>
            )}
          </div>
        ))}
      </div>

      <div className="my-2 border-t border-dashed border-black" />
      <div className="space-y-1">
        <ReceiptPreviewRow
          left="Subtotal"
          right={receiptAmount(bill.subtotal)}
        />
        <ReceiptPreviewRow
          left="Time Charge"
          right={receiptAmount(bill.timeChargeAmount)}
        />
        <ReceiptPreviewRow left="Tax" right={receiptAmount(bill.taxAmount)} />
        <ReceiptPreviewRow
          left="Discount"
          right={`- ${receiptAmount(bill.discountAmount)}`}
        />
        <ReceiptPreviewRow
          left="Service Charge"
          right={receiptAmount(bill.serviceCharge)}
        />
      </div>
      <div className="my-2 border-t border-dashed border-black" />
      <ReceiptPreviewRow
        left="TOTAL"
        right={receiptAmount(bill.totalAmount)}
        bold
      />
      <ReceiptPreviewRow left="Status" right={bill.paymentStatus} />
      <ReceiptPreviewRow left="Payment" right={bill.paymentMethod ?? "—"} />
      <div className="mt-3 text-center">Thank you</div>
    </div>
    <p className="max-w-[320px] text-center text-xs text-muted-foreground">
      Preview of the 80 mm receipt. Printing sends ESC/POS data over Web Serial
      at 9600 baud. Choose the paired printer port (for example, COM3) in the
      browser prompt, then select Connect.
    </p>
  </div>
);

const ViewBillDialog = ({ bill }: { bill: BillListItem }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  const printBill = async () => {
    const serial = (navigator as Navigator & { serial?: ThermalSerial }).serial;
    if (!serial) {
      toast.error(
        "Thermal printing requires a browser with Web Serial support.",
      );
      return;
    }

    setIsPrinting(true);
    let port: ThermalSerialPort | undefined;
    let writer:
      | ReturnType<NonNullable<ThermalSerialPort["writable"]>["getWriter"]>
      | undefined;

    try {
      port = await serial.requestPort();
      await port.open({ baudRate: 9600 });
      if (!port.writable) {
        throw new Error(
          "The selected printer does not provide a writable connection.",
        );
      }
      writer = port.writable.getWriter();

      const { Br, Cut, Line, Printer, Row, Text, render } = await import(
        "react-thermal-printer"
      );
      const data = await render(
        <Printer type="epson" width={42}>
          <Text align="center" bold>
            BILL RECEIPT
          </Text>
          <Line />
          <Row left="Bill No." right={bill.billNumber} />
          <Row left="Date" right={fmtDate(bill.createdAt)} />
          <Row
            left="Table"
            right={`${bill.session?.tableName ?? "—"} (${
              bill.session?.tableType ?? "—"
            })`}
          />
          <Row left="Guests" right={String(bill.session?.guestCount ?? "—")} />
          <Row left="Mobile" right={bill.mobileNumber || "—"} />
          <Line />
          <Text bold>ITEMS</Text>
          {bill.order?.items.map((item, itemIndex) => (
            <div key={`item-${itemIndex}`}>
              <Row
                left={`${item.quantity} x ${item.menuItemName}`}
                right={receiptAmount(item.totalPrice)}
              />
              {item.subMenuItems.map((subItem, subItemIndex) => (
                <Row
                  key={`item-${itemIndex}-sub-${subItemIndex}`}
                  left={`  + ${subItem.subMenuItemName} x ${subItem.quantity}`}
                  right={receiptAmount(subItem.totalPrice)}
                />
              ))}
              {item.notes && item.notes !== "n/a" && (
                <Text>{`  Note: ${item.notes}`}</Text>
              )}
            </div>
          ))}
          <Line />
          <Row left="Subtotal" right={receiptAmount(bill.subtotal)} />
          <Row
            left="Time Charge"
            right={receiptAmount(bill.timeChargeAmount)}
          />
          <Row left="Tax" right={receiptAmount(bill.taxAmount)} />
          <Row
            left="Discount"
            right={`- ${receiptAmount(bill.discountAmount)}`}
          />
          <Row
            left="Service Charge"
            right={receiptAmount(bill.serviceCharge)}
          />
          <Line />
          <Row
            left={<Text bold>TOTAL</Text>}
            right={<Text bold>{receiptAmount(bill.totalAmount)}</Text>}
          />
          <Row left="Status" right={bill.paymentStatus} />
          <Row left="Payment" right={bill.paymentMethod ?? "—"} />
          <Br />
          <Text align="center">Thank you</Text>
          <Cut />
        </Printer>,
      );

      await writer.write(data);
      toast.success("Bill sent to the printer.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not print bill.",
      );
    } finally {
      writer?.releaseLock();
      if (port) {
        await port.close().catch(() => undefined);
      }
      setIsPrinting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-lg flex flex-col max-h-[80vh]">
      <DialogHeader className="pb-2">
        <DialogTitle className="flex items-center gap-2">
          {showReceiptPreview ? (
            <PrinterIcon className="h-5 w-5 text-primary" />
          ) : (
            <Receipt className="h-5 w-5 text-primary" />
          )}
          {showReceiptPreview ? "Thermal receipt preview" : bill.billNumber}
        </DialogTitle>
        <DialogDescription>
          {showReceiptPreview
            ? "Review the receipt copy before sending it to the thermal printer."
            : "Full breakdown of the customer bill."}
        </DialogDescription>
      </DialogHeader>

      {showReceiptPreview ? (
        <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
          <ThermalReceiptPreview bill={bill} />
        </div>
      ) : (
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
                {bill.order.items.map((it, index) => (
                  <div key={index} className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">
                          {it.menuItemName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {it.quantity} × {inr(it.unitPrice)}
                          {it.notes && it.notes !== "n/a"
                            ? ` · ${it.notes}`
                            : ""}
                        </div>
                      </div>
                      <div className="font-semibold">{inr(it.totalPrice)}</div>
                    </div>
                    {it.subMenuItems.length > 0 && (
                      <div className="pl-3 border-l-2 border-primary/30 space-y-0.5">
                        {it.subMenuItems.map((s, index) => (
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
      )}

      <DialogFooter className="flex-col sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowReceiptPreview((show) => !show)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          {showReceiptPreview ? "Back to bill" : "Preview receipt"}
        </Button>
        <Button
          type="button"
          onClick={printBill}
          disabled={isPrinting}
          className="gap-2"
        >
          <PrinterIcon className="h-4 w-4" />
          {isPrinting ? "Printing…" : "Print bill"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ViewBillDialog;
