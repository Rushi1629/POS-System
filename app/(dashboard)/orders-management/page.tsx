"use client";
import { Button } from "@/components/ui/button";
import { Order, STATUS_META } from "@/types/order-types";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Receipt,
  Search,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import orderStatusCard from "@/components/orderStatusCard";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderCard from "@/components/OrderCard";
import OrderDetailDialog from "@/components/OrderDetailDialog";
import StatCard from "@/components/StatCard";
import { fmt } from "@/utils/utils";
import OrderStatusCard from "@/components/orderStatusCard";

const SAMPLE: Order[] = [
  {
    id: 1,
    tableId: 2090002,
    orderNumber: "ORD-1780233494254",
    orderType: "DINE_IN",
    status: "PENDING",
    paymentStatus: "UNPAID",
    subtotal: "387.75",
    taxAmount: "0",
    discountAmount: "0",
    serviceCharge: "0",
    timeChargeAmount: null,
    totalAmount: "387.75",
    notes: "Need Fast Service",
    items: [
      {
        id: 1,
        orderId: 1,
        quantity: 2,
        unitPrice: "129.25",
        totalPrice: "258.5",
        notes: "Low Sugar",
        isCancelled: false,
        menuItem: {
          id: 30001,
          name: "Veg Cheese Burger",
          price: "129.25",
          menuType: "Veg",
        },
        subMenuItem: null,
      },
      {
        id: 2,
        orderId: 1,
        quantity: 1,
        unitPrice: "129.25",
        totalPrice: "129.25",
        notes: null,
        isCancelled: false,
        menuItem: {
          id: 60001,
          name: "Non Veg Cheese Burger",
          price: "129.25",
          menuType: "Non Veg",
        },
        subMenuItem: null,
      },
    ],
  },
  {
    id: 2,
    tableId: 2090005,
    orderNumber: "ORD-1780233512881",
    orderType: "TAKEAWAY",
    status: "PREPARING",
    paymentStatus: "PAID",
    subtotal: "540.00",
    taxAmount: "27.00",
    discountAmount: "0",
    serviceCharge: "0",
    timeChargeAmount: null,
    totalAmount: "567.00",
    notes: null,
    items: [
      {
        id: 3,
        orderId: 2,
        quantity: 2,
        unitPrice: "180.00",
        totalPrice: "360.00",
        notes: "Extra cheese",
        isCancelled: false,
        menuItem: {
          id: 40001,
          name: "Margherita Pizza",
          price: "180.00",
          menuType: "Veg",
        },
        subMenuItem: {
          id: 1,
          name: "Extra Cheese",
          price: "10.50",
          menuType: "Veg",
        },
      },
      {
        id: 4,
        orderId: 2,
        quantity: 3,
        unitPrice: "60.00",
        totalPrice: "180.00",
        notes: null,
        isCancelled: false,
        menuItem: {
          id: 70001,
          name: "Cold Coffee",
          price: "60.00",
          menuType: "Veg",
        },
        subMenuItem: null,
      },
    ],
  },
  {
    id: 3,
    tableId: 2090001,
    orderNumber: "ORD-1780233601122",
    orderType: "DINE_IN",
    status: "COMPLETED",
    paymentStatus: "PAID",
    subtotal: "950.00",
    taxAmount: "47.50",
    discountAmount: "50",
    serviceCharge: "20",
    timeChargeAmount: "15.00",
    totalAmount: "982.50",
    notes: "Birthday celebration",
    items: [
      {
        id: 5,
        orderId: 3,
        quantity: 1,
        unitPrice: "450.00",
        totalPrice: "450.00",
        notes: null,
        isCancelled: false,
        menuItem: {
          id: 80001,
          name: "Paneer Tikka Platter",
          price: "450.00",
          menuType: "Veg",
        },
        subMenuItem: null,
      },
      {
        id: 6,
        orderId: 3,
        quantity: 2,
        unitPrice: "250.00",
        totalPrice: "500.00",
        notes: "Spicy",
        isCancelled: false,
        menuItem: {
          id: 90001,
          name: "Chicken Biryani",
          price: "250.00",
          menuType: "Non Veg",
        },
        subMenuItem: null,
      },
    ],
  },
  {
    id: 4,
    tableId: 2090003,
    orderNumber: "ORD-1780233699871",
    orderType: "DELIVERY",
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    subtotal: "220.00",
    taxAmount: "11.00",
    discountAmount: "0",
    serviceCharge: "0",
    timeChargeAmount: null,
    totalAmount: "231.00",
    notes: null,
    items: [
      {
        id: 7,
        orderId: 4,
        quantity: 1,
        unitPrice: "220.00",
        totalPrice: "220.00",
        notes: null,
        isCancelled: true,
        menuItem: {
          id: 30001,
          name: "Veg Cheese Burger Combo",
          price: "220.00",
          menuType: "Veg",
        },
        subMenuItem: null,
      },
    ],
  },
];

const page = () => {
  const [orders] = useState<Order[]>(SAMPLE);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [detail, setDetail] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (typeFilter !== "all" && o.orderType !== typeFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchOrder = o.orderNumber.toLowerCase().includes(q);
        const matchTable = String(o.tableId).includes(q);
        const matchItem = o.items.some((i) =>
          i.menuItem.name.toLowerCase().includes(q),
        );
        if (!matchOrder && !matchTable && !matchItem) return false;
      }
      return true;
    });
  }, [orders, query, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) =>
        ["PENDING", "PREPARING", "READY"].includes(o.status),
      ).length,
      revenue: orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((s, o) => s + Number(o.totalAmount), 0),
      completed: orders.filter((o) => o.status === "COMPLETED").length,
    };
  }, [orders]);
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Orders Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track every customer order, status, and payment in real time.
          </p>
        </div>
        <Button className="rounded-lg shadow-md shadow-primary/20">
          <Receipt className="mr-1 h-4 w-4" /> New Order
        </Button>
      </div>
      <div className="mt-7">
        {/* Stat cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OrderStatusCard
            label="TOTAL ORDERS"
            value={stats.total}
            icon={<Receipt className="h-5 w-5" />}
            tone="primary"
          />
          <OrderStatusCard
            label="ACTIVE"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            tone="amber"
          />
          <OrderStatusCard
            label="COMPLETED"
            value={stats.completed}
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="emerald"
          />
          <OrderStatusCard
            label="REVENUE"
            value={fmt(stats.revenue)}
            icon={<CircleDollarSign className="h-5 w-5" />}
            tone="violet"
          />
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order #, table or item..."
              className="h-10 rounded-lg border-border pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10 w-full rounded-lg sm:w-44">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="DINE_IN">Dine In</SelectItem>
              <SelectItem value="TAKEAWAY">Takeaway</SelectItem>
              <SelectItem value="DELIVERY">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full rounded-lg sm:w-44">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {Object.keys(STATUS_META).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_META[s as Order["status"]].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-10 rounded-lg"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          >
            Reset
          </Button>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center">
              <Receipt className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <p className="mt-4 text-sm font-medium">No orders found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your filters.
              </p>
            </div>
          ) : (
            filtered.map((o) => (
              <OrderCard key={o.id} order={o} onView={() => setDetail(o)} />
            ))
          )}
        </div>
      </div>

      <OrderDetailDialog
        order={detail}
        onOpenChange={(v) => !v && setDetail(null)}
      />
    </div>
  );
};

export default page;
