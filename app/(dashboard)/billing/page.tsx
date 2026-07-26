"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Receipt,
  Search,
  IndianRupee,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  CircleDollarSign,
  Plus,
  Eye,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  BillListItem,
  PAYMENT_ICONS,
  PAYMENT_LABELS,
  PaymentStatus,
  STATUS_STYLES,
} from "@/types/billing-types";
import StatCard from "@/components/biiling/StatCard";
import GenerateBillDialog from "@/components/biiling/GenerateBillDialog";
import { fmtDate, inr } from "@/utils/utils";
import PayBillDialog from "@/components/biiling/PayBillDialog";
import ViewBillDialog from "@/components/biiling/ViewBillDialog";
import {
  useFetchAllBills,
  useGenerateBill,
  usePayBill,
} from "@/client/hooks/useBilling";
import { useFetchOrdersTableWise } from "@/client/hooks/useOrder";
import { OrderAdminChef } from "@/types/order-types";
import { useFetchTables } from "@/client/hooks/useTable";

/* ---------- Page ---------- */
export default function BillingPage() {
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"ALL" | PaymentStatus>("ALL");
  const [openGenerate, setOpenGenerate] = useState(false);
  const [payTarget, setPayTarget] = useState<BillListItem | null>(null);
  const [viewTarget, setViewTarget] = useState<BillListItem | null>(null);

  const {
    data: allBills,
    isLoading: isLoadingBills,
    error,
    refetch: refetchBills,
  } = useFetchAllBills();
  // const { data: tableWiseData } = useFetchOrdersTableWise();
  const { data: tables } = useFetchTables();
  const { mutateAsync: payBill, isPending: isPaying } = usePayBill();
  const { mutateAsync: generateBill, isPending: isGenerating } =
    useGenerateBill();

  useEffect(() => {
    if (!allBills || !Array.isArray(allBills)) return;

    setBills(allBills);
  }, [allBills]);

  const filtered = useMemo(() => {
    return bills.filter((b) => {
      if (tab !== "ALL" && b.paymentStatus !== tab) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        b.billNumber.toLowerCase().includes(q) ||
        b.mobileNumber.toLowerCase().includes(q) ||
        b.session.tableName.toLowerCase().includes(q)
      );
    });
  }, [bills, query, tab]);

  const handleGenerateBill = async ({
    tableId,
    mobileNumber,
    notes,
  }: {
    tableId: number;
    mobileNumber: string;
    notes: string;
  }) => {
    if (!tableId) {
      throw new Error("Please choose a table with a valid table id.");
    }

    const response = await generateBill({
      tableId: tableId!,
      mobileNumber,
      notes: notes || "n/a",
    });

    await refetchBills(); // 👈 IMPORTANT

    return response;
  };

  const handlePayBill = async (
    bill: BillListItem,
    method: "CASH" | "CARD" | "UPI" | "CASH_ONLINE" | "OTHER",
    notes: string,
    splitPaymentData?: { cashAmount: number; onlineAmount: number },
  ) => {
    debugger;
    try {
      const paymentRequest: any = {
        billingId: bill.billingId,
        paymentMethod: method === "CASH_ONLINE" ? "CASH_ONLINE" : method,
        notes: notes || "na",
      };

      if (splitPaymentData) {
        paymentRequest.cashAmount = splitPaymentData.cashAmount;
        paymentRequest.onlineAmount = splitPaymentData.onlineAmount;
      }

      const updated = await payBill(paymentRequest);

      setBills((prev) =>
        prev.map((item) =>
          item.billingId === bill.billingId
            ? { ...item, ...updated, order: item.order }
            : item,
        ),
      );
      setPayTarget(null);
    } catch {
      throw new Error("Payment failed");
    }
  };

  const stats = useMemo(() => {
    const paid = bills.filter((b) => b.paymentStatus === "PAID");
    const unpaid = bills.filter((b) => b.paymentStatus === "UNPAID");
    const revenue = paid.reduce((s, b) => s + Number(b.totalAmount), 0);
    const outstanding = unpaid.reduce((s, b) => s + Number(b.totalAmount), 0);
    return {
      total: bills.length,
      paid: paid.length,
      unpaid: unpaid.length,
      revenue,
      outstanding,
    };
  }, [bills]);

  return (
    <div className="">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Finance
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Billing Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate bills, record payments and track every transaction.
            </p>
          </div>

          <Dialog open={openGenerate} onOpenChange={setOpenGenerate}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-soft">
                <Plus className="h-4 w-4" />
                Generate Bill
              </Button>
            </DialogTrigger>
            <GenerateBillDialog
              // orders={availableOrders}
              tables={tables ?? []}
              isGenerating={isGenerating}
              onClose={() => setOpenGenerate(false)}
              onSubmit={handleGenerateBill}
            />
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Bills"
            value={stats.total.toString()}
            icon={FileText}
            accent="bg-accent text-accent-foreground"
          />
          <StatCard
            label="Revenue Collected"
            value={inr(stats.revenue)}
            icon={CheckCircle2}
            accent="bg-status-completed text-status-completed-foreground"
          />
          <StatCard
            label="Outstanding"
            value={inr(stats.outstanding)}
            icon={Clock}
            accent="bg-status-pending text-status-pending-foreground"
          />
          <StatCard
            label="Paid vs Unpaid"
            value={`${stats.paid} / ${stats.unpaid}`}
            icon={CircleDollarSign}
            accent="bg-primary/10 text-primary"
          />
        </div>

        {/* Toolbar */}
        <Card className="border-border/60 shadow-soft">
          <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by bill no, mobile or table…"
                className="pl-9 h-11 rounded-xl bg-muted/40 border-transparent focus-visible:border-primary/40"
              />
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="rounded-xl bg-muted/60">
                <TabsTrigger value="ALL" className="rounded-lg">
                  All
                </TabsTrigger>
                <TabsTrigger value="PAID" className="rounded-lg">
                  Paid
                </TabsTrigger>
                <TabsTrigger value="UNPAID" className="rounded-lg">
                  Unpaid
                </TabsTrigger>
                <TabsTrigger value="REFUNDED" className="rounded-lg">
                  Refunded
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Table */}
        {isLoadingBills ? (
          <>
            <Card className="border-border/60 shadow-soft overflow-hidden">
              <CardHeader className="py-16 flex justify-center items-center">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <h3 className="mt-4 text-lg font-semibold">
                  Loading table items...
                </h3>
              </CardHeader>
            </Card>
          </>
        ) : (
          <Card className="border-border/60 shadow-soft overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                All Bills
              </CardTitle>
              <CardDescription>
                Showing {filtered.length} of {bills.length} bills
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/60">
                      <TableHead className="text-xs uppercase tracking-wider text-center">
                        Bill
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider">
                        Table / Guests
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider">
                        Mobile
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider">
                        Created
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider">
                        Payment
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-16 text-center text-sm text-muted-foreground"
                        >
                          No bills match your filters.
                        </TableCell>
                      </TableRow>
                    )}
                    {filtered.map((b, index) => {
                      const PMIcon = b.paymentMethod
                        ? PAYMENT_ICONS[b.paymentMethod]
                        : Receipt;
                      return (
                        <TableRow
                          key={index}
                          className="border-border/60 hover:bg-muted/40 transition"
                        >
                          <TableCell className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Receipt className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {b.billNumber}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {b.order?.orderNumber ??
                                    `Session #${b.sessionId}`}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {b.session?.tableName}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />{" "}
                              {b.session?.guestCount} · {b.session?.tableType}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {b.mobileNumber}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {fmtDate(b.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge
                                className={cn(
                                  "w-fit gap-1 font-medium border-0",
                                  STATUS_STYLES[b.paymentStatus],
                                )}
                              >
                                {b.paymentStatus}
                              </Badge>
                              {b.paymentMethod && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <PMIcon className="h-3 w-3" />
                                  {PAYMENT_LABELS[b.paymentMethod]}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            {inr(b.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1"
                                onClick={() => setViewTarget(b)}
                              >
                                <Eye className="h-4 w-4" /> View
                              </Button>
                              {b.paymentStatus === "UNPAID" && (
                                <Button
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => setPayTarget(b)}
                                >
                                  <IndianRupee className="h-4 w-4" /> Pay
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pay dialog */}
      <Dialog open={!!payTarget} onOpenChange={(o) => !o && setPayTarget(null)}>
        {payTarget && (
          <PayBillDialog
            bill={payTarget}
            onClose={() => setPayTarget(null)}
            onPay={handlePayBill}
            isPaying={isPaying}
          />
        )}
      </Dialog>

      {/* View dialog */}
      <Dialog
        open={!!viewTarget}
        onOpenChange={(o) => !o && setViewTarget(null)}
      >
        {viewTarget && <ViewBillDialog bill={viewTarget} />}
      </Dialog>
    </div>
  );
}
