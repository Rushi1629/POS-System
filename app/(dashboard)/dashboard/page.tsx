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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Boxes,
  IndianRupee,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Users,
  Utensils,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import { useDashboard } from "@/client/hooks/useDashboard";
import type { DashboardGroupBy, DashboardPeriod } from "@/types/dashboard-types";
import {
  formatCurrency,
  formatDateInput,
  formatDashboardDate,
  numberValue,
  parseDateInput,
} from "@/utils/utils";

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
  return (
    <div className="grid gap-1 text-xs font-medium text-muted-foreground">
      <span>{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-36 justify-start text-left font-normal">
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={parseDateInput(value)}
            onSelect={(date) => date && onChange(formatDateInput(date))}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const page = () => {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [salesGroupBy, setSalesGroupBy] = useState<DashboardGroupBy>("hour");
  const [revenueGroupBy, setRevenueGroupBy] = useState<DashboardGroupBy>("week");
  const dashboard = useDashboard("today" as DashboardPeriod, salesGroupBy, revenueGroupBy, startDate, endDate);
  const summary = dashboard.summary;
  return (
    <div className="custom-space-y">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Welcome back, Admin 👋
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monday, Nov 11 · Real-time business performance and operations
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
          delta={numberValue(summary?.revenue?.comparisonPercentage)}
          hint="vs yesterday"
          icon={IndianRupee}
          tone="primary"
        />
        <KpiCard
          label="Orders"
          value={String(numberValue(summary?.orders?.count))}
          delta={numberValue(summary?.orders?.comparisonPercentage)}
          hint="orders"
          icon={ShoppingBag}
          tone="info"
        />
        <KpiCard
          label="Active Tables"
          value={`${numberValue(summary?.activeTables?.active)} / ${numberValue(summary?.activeTables?.total)}`}
          delta={numberValue(summary?.activeTables?.occupancyPercentage)}
          hint={`${numberValue(summary?.activeTables?.occupancyPercentage)}% occupied`}
          icon={Utensils}
          tone="success"
        />
        <KpiCard
          label="Items Sold"
          value={String(numberValue(summary?.itemsSold?.quantity))}
          delta={numberValue(summary?.itemsSold?.comparisonPercentage)}
          hint="items sold"
          icon={TrendingUp}
          tone="warning"
        />
      </div>

      {/* Secondary KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Gross Profit"
          value={formatCurrency(summary?.grossProfit?.amount)}
          delta={numberValue(summary?.grossProfit?.comparisonPercentage)}
          hint={`${numberValue(summary?.grossProfit?.marginPercentage)}% margin`}
          icon={Wallet}
          tone="success"
        />
        <KpiCard
          label="Outstanding"
          value={formatCurrency(summary?.outstanding?.amount)}
          delta={numberValue(summary?.outstanding?.comparisonPercentage)}
          hint={`${numberValue(summary?.outstanding?.unpaidBills)} unpaid bills`}
          icon={Receipt}
          tone="warning"
        />
        <KpiCard
          label="New Customers"
          value={String(numberValue(summary?.newCustomers?.count))}
          delta={numberValue(summary?.newCustomers?.comparisonPercentage)}
          hint="new customers"
          icon={Users}
          tone="info"
        />
        <KpiCard
          label="Low Stock"
          value={String(numberValue(summary?.lowStock?.count))}
          hint="needs restock"
          icon={Boxes}
          tone="warning"
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
            <Tabs value={salesGroupBy} onValueChange={(value) => setSalesGroupBy(value as DashboardGroupBy)}>
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
