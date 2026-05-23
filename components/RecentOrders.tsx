import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const orders = [
  { id: "#10248", customer: "Priya Sharma", table: "T-04", items: 3, total: 642, status: "Served", payment: "UPI" },
  { id: "#10247", customer: "Walk-in", table: "T-12", items: 5, total: 1280, status: "Preparing", payment: "Cash" },
  { id: "#10246", customer: "Rahul Mehta", table: "T-02", items: 2, total: 318, status: "Pending", payment: "Card" },
  { id: "#10245", customer: "Aditi Roy", table: "T-09", items: 4, total: 904, status: "Served", payment: "UPI" },
  { id: "#10244", customer: "Walk-in", table: "T-07", items: 1, total: 129, status: "Cancelled", payment: "—" },
];

const tone: Record<string, string> = {
  Served: "bg-success/10 text-success border-success/20",
  Preparing: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-warning/15 text-warning border-warning/25",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentOrders() {
  return (
    <Card className="border-border/60 shadow-[--shadow-card]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <p className="text-xs text-muted-foreground">Live feed from all active tables</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View all <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Table</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} className="border-border/40">
                <TableCell className="font-medium text-foreground">{o.id}</TableCell>
                <TableCell className="text-muted-foreground">{o.customer}</TableCell>
                <TableCell className="text-muted-foreground">{o.table}</TableCell>
                <TableCell className="text-right">{o.items}</TableCell>
                <TableCell className="text-right font-semibold">₹{o.total}</TableCell>
                <TableCell className="text-muted-foreground">{o.payment}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={tone[o.status]}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}