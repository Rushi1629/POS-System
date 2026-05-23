"use client";
import { ExpensesRevenueChart } from "@/components/charts/ExpensesRevenueChart";
import { InventoryStockChart } from "@/components/charts/InventoryStockChart";
import { OrderStatusChart } from "@/components/charts/OrderStatusChart";
import { PaymentMethodsChart } from "@/components/charts/PaymentMethodsChart";
import { SalesTrendChart } from "@/components/charts/SalesTrendChart";
import { TopItemsChart } from "@/components/charts/TopItemsChart";
import { FilterBar } from "@/components/FilterBar";
import { KpiCard } from "@/components/KpiCard";
import { LowStockAlerts } from "@/components/LowStockAlerts";
import { RecentOrders } from "@/components/RecentOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const page = () => {
  const [range, setRange] = useState("today");
  const [category, setCategory] = useState("all");
  const [shift, setShift] = useState("all");
  const [payment, setPayment] = useState("all");
  const [query, setQuery] = useState("");
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
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full">
            Reports
          </Button>
          <Button className="rounded-full bg-primary hover:bg-primary/90">
            + New Order
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        range={range}
        onRangeChange={setRange}
        category={category}
        onCategoryChange={setCategory}
        shift={shift}
        onShiftChange={setShift}
        payment={payment}
        onPaymentChange={setPayment}
        query={query}
        onQueryChange={setQuery}
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Today's Revenue"
          value="₹48,920"
          delta={12.4}
          hint="vs yesterday"
          icon={IndianRupee}
          tone="primary"
        />
        <KpiCard
          label="Orders"
          value="184"
          delta={8.1}
          hint="avg ₹486"
          icon={ShoppingBag}
          tone="info"
        />
        <KpiCard
          label="Active Tables"
          value="14 / 24"
          delta={-3.2}
          hint="58% occupied"
          icon={Utensils}
          tone="success"
        />
        <KpiCard
          label="Items Sold"
          value="612"
          delta={5.6}
          hint="Burger leads"
          icon={TrendingUp}
          tone="warning"
        />
      </div>

      {/* Secondary KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Gross Profit"
          value="₹18,240"
          delta={4.2}
          hint="37% margin"
          icon={Wallet}
          tone="success"
        />
        <KpiCard
          label="Outstanding"
          value="₹2,140"
          delta={-1.8}
          hint="6 unpaid bills"
          icon={Receipt}
          tone="warning"
        />
        <KpiCard
          label="New Customers"
          value="42"
          delta={14.0}
          hint="vs last week"
          icon={Users}
          tone="info"
        />
        <KpiCard
          label="Low Stock"
          value="3"
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
            <Tabs defaultValue="hour">
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
            <SalesTrendChart />
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
            <OrderStatusChart />
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
            <TopItemsChart />
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
            <PaymentMethodsChart />
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
            <InventoryStockChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + Low stock */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <LowStockAlerts />
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
          <ExpensesRevenueChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
