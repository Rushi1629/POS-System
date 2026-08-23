"use client";
import { ExpensesRevenueChart } from "@/components/charts/ExpensesRevenueChart";
import { InventoryStockChart } from "@/components/charts/InventoryStockChart";
import { OrderStatusChart } from "@/components/charts/OrderStatusChart";
import { PaymentMethodsChart } from "@/components/charts/PaymentMethodsChart";
import { SalesTrendChart } from "@/components/charts/SalesTrendChart";
import { TopItemsChart } from "@/components/charts/TopItemsChart";
import { KpiCard } from "@/components/KpiCard";
import { LowStockAlerts } from "@/components/LowStockAlerts";
import { RecentOrders } from "@/components/RecentOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Boxes,
  Clock,
  IndianRupee,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Utensils,
} from "lucide-react";
import React, { useState } from "react";
import { useDashboard } from "@/client/hooks/useDashboard";
import type {
  DashboardGroupBy,
  DashboardPeriod,
} from "@/types/dashboard-types";
import {
  formatCurrency,
  formatDateInput,
  formatDashboardDate,
  numberValue,
  parseDateInput,
} from "@/utils/utils";
import { useAppSelector } from "@/store/hooks";

type DatePickerFieldProps = {
  label: string;
  value: string;
  displayValue: string;
  onChange: (value: string) => void;
  disabled: (date: Date) => boolean;
};

function DatePickerField({
  label,
  value,
  displayValue,
  onChange,
  disabled,
}: DatePickerFieldProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Field className="w-36 gap-1">
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={label}
            className="w-full justify-start font-normal"
          >
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={parseDateInput(value)}
            defaultMonth={parseDateInput(value)}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) return;
              onChange(formatDateInput(date));
              setOpen(false);
            }}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

const page = () => {
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [salesGroupBy, setSalesGroupBy] = useState<DashboardGroupBy>("hour");
  const [revenueGroupBy, setRevenueGroupBy] =
    useState<DashboardGroupBy>("week");
  const currentRole = useAppSelector(
    (state) => state.auth.user?.role,
  ) as unknown;
  const roleName =
    typeof currentRole === "string"
      ? currentRole
      : currentRole && typeof currentRole === "object" && "name" in currentRole
        ? String(currentRole.name)
        : "Admin";
  const dashboard = useDashboard(
    "today" as DashboardPeriod,
    salesGroupBy,
    revenueGroupBy,
    startDate,
    endDate,
  );
  const summary = dashboard.summary;
  const comparisonValue = (value: number | null | undefined) =>
    value == null ? undefined : numberValue(value);
  return (
    <div className="custom-space-y">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Welcome back, {roleName} 👋
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Live overview of your cafe&apos;s sales, operations, and performance
          </p>
        </div>
        <div className="flex items-end gap-2">
          <DatePickerField
            label="Start date"
            value={startDate}
            displayValue={formatDashboardDate(startDate)}
            onChange={setStartDate}
            disabled={(date) => date > parseDateInput(endDate)}
          />
          <DatePickerField
            label="End date"
            value={endDate}
            displayValue={formatDashboardDate(endDate)}
            onChange={setEndDate}
            disabled={(date) => date < parseDateInput(startDate)}
          />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Today's Revenue"
          value={formatCurrency(summary?.revenue?.amount)}
          delta={comparisonValue(summary?.revenue?.comparisonPercentage)}
          hint="vs yesterday"
          icon={IndianRupee}
          tone="primary"
        />
        <KpiCard
          label="Orders"
          value={String(numberValue(summary?.orders?.count))}
          delta={comparisonValue(summary?.orders?.comparisonPercentage)}
          hint="orders"
          icon={ShoppingBag}
          tone="primary"
        />
        <KpiCard
          label="Active Tables"
          value={`${numberValue(summary?.activeTables?.active)} / ${numberValue(summary?.activeTables?.total)}`}
          hint={`${numberValue(summary?.activeTables?.occupancyPercentage)}% occupied`}
          icon={Utensils}
          tone="primary"
        />
        <KpiCard
          label="Items Sold"
          value={String(numberValue(summary?.itemsSold?.quantity))}
          delta={comparisonValue(summary?.itemsSold?.comparisonPercentage)}
          hint="items sold"
          icon={TrendingUp}
          tone="primary"
        />
      </div>

      {/* Secondary KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Time Charges"
          value={formatCurrency(summary?.timeCharges?.amount)}
          delta={comparisonValue(summary?.timeCharges?.comparisonPercentage)}
          hint="service charges"
          icon={Clock}
          tone="primary"
        />
        <KpiCard
          label="Outstanding"
          value={formatCurrency(summary?.outstanding?.amount)}
          delta={comparisonValue(summary?.outstanding?.comparisonPercentage)}
          hint={`${numberValue(summary?.outstanding?.billCount)} unpaid bills`}
          icon={Receipt}
          tone="primary"
        />
        <KpiCard
          label="Average Bill"
          value={formatCurrency(summary?.avgBill?.averageAmount)}
          delta={comparisonValue(summary?.avgBill?.comparisonPercentage)}
          hint={`${numberValue(summary?.avgBill?.billCount)} bills`}
          icon={IndianRupee}
          tone="primary"
        />
        <KpiCard
          label="Low Stock"
          value={String(numberValue(summary?.lowStock?.count))}
          hint="needs restock"
          icon={Boxes}
          tone="primary"
        />
      </div>

      {/* Sales + Orders */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-[--shadow-card]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Sales Trend</CardTitle>
              <p className="text-xs text-muted-foreground">
                Hourly revenue and order volume
              </p>
            </div>
            <Tabs
              value={salesGroupBy}
              onValueChange={(value) =>
                setSalesGroupBy(value as DashboardGroupBy)
              }
            >
              <TabsList className="h-8 rounded-full bg-muted/60">
                <TabsTrigger value="hour" className="rounded-full text-xs">
                  Hour
                </TabsTrigger>
                <TabsTrigger value="day" className="rounded-full text-xs">
                  Day
                </TabsTrigger>
                <TabsTrigger value="week" className="rounded-full text-xs">
                  Week
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <SalesTrendChart data={dashboard.salesTrend} />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[--shadow-card]">
          <CardHeader>
            <CardTitle className="text-base">Order Status</CardTitle>
            <p className="text-xs text-muted-foreground">
              Live distribution across stages
            </p>
          </CardHeader>
          <CardContent>
            <OrderStatusChart data={dashboard.orderStatus} />
          </CardContent>
        </Card>
      </div>

      {/* Top items + Payments + Inventory */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 shadow-[--shadow-card]">
          <CardHeader>
            <CardTitle className="text-base">Top-Selling Items</CardTitle>
            <p className="text-xs text-muted-foreground">
              Best performers this period
            </p>
          </CardHeader>
          <CardContent>
            <TopItemsChart data={dashboard.topItems} />
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-[--shadow-card]">
          <CardHeader>
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <p className="text-xs text-muted-foreground">
              Share by transaction count
            </p>
          </CardHeader>
          <CardContent>
            <PaymentMethodsChart data={dashboard.paymentMethods} />
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-[--shadow-card]">
          <CardHeader>
            <CardTitle className="text-base">Inventory Levels</CardTitle>
            <p className="text-xs text-muted-foreground">
              Current stock health
            </p>
          </CardHeader>
          <CardContent>
            <InventoryStockChart data={dashboard.inventory} />
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + Low stock */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={dashboard.recentOrders} />
        </div>
        <LowStockAlerts items={dashboard.lowStock} />
      </div>

      {/* Expenses vs Revenue */}
      <Card className="border-border/60 shadow-[--shadow-card]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Revenue vs Expenses</CardTitle>
            <p className="text-xs text-muted-foreground">
              Last 7 days · in thousands (₹)
            </p>
          </div>
          <Tabs defaultValue="week">
            <TabsList className="h-8 rounded-full bg-muted/60">
              <TabsTrigger value="week" className="rounded-full text-xs">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="rounded-full text-xs">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="rounded-full text-xs">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ExpensesRevenueChart data={dashboard.revenueVsOrders} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
