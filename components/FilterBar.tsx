import { CalendarDays, Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  range: string;
  onRangeChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  shift: string;
  onShiftChange: (v: string) => void;
  payment: string;
  onPaymentChange: (v: string) => void;
  query: string;
  onQueryChange: (v: string) => void;
};

export function FilterBar(p: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-[var(--shadow-card)] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={p.query}
            onChange={(e) => p.onQueryChange(e.target.value)}
            placeholder="Search orders, items, customers..."
            className="h-10 rounded-full border-border/70 bg-background pl-9"
          />
        </div>
        <Tabs value={p.range} onValueChange={p.onRangeChange}>
          <TabsList className="h-10 rounded-full bg-muted/60">
            <TabsTrigger value="today" className="rounded-full text-xs">Today</TabsTrigger>
            <TabsTrigger value="7d" className="rounded-full text-xs">7d</TabsTrigger>
            <TabsTrigger value="30d" className="rounded-full text-xs">30d</TabsTrigger>
            <TabsTrigger value="ytd" className="rounded-full text-xs">YTD</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={p.category} onValueChange={p.onCategoryChange}>
          <SelectTrigger className="h-10 w-[140px] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="burger">Burger</SelectItem>
            <SelectItem value="pizza">Pizza</SelectItem>
            <SelectItem value="beverage">Beverage</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
          </SelectContent>
        </Select>
        <Select value={p.shift} onValueChange={p.onShiftChange}>
          <SelectTrigger className="h-10 w-[120px] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All shifts</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>
        <Select value={p.payment} onValueChange={p.onPaymentChange}>
          <SelectTrigger className="h-10 w-[130px] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-10 rounded-full">
          <CalendarDays className="mr-1 h-4 w-4" /> Custom
        </Button>
        <Button variant="outline" size="sm" className="h-10 rounded-full">
          <Filter className="mr-1 h-4 w-4" /> More
        </Button>
        <Button size="sm" className="h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="mr-1 h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
}