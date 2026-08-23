import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { RecentOrder } from "@/types/dashboard-types";
import { formatCurrency } from "@/utils/utils";

const tone: Record<string, string> = {
  served: "bg-success/10 text-success border-success/20",
  preparing: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/15 text-warning border-warning/25",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
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
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id} className="border-border/40">
                  <TableCell className="font-medium text-foreground">{o.id}</TableCell>
                  <TableCell className="text-muted-foreground">{o.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{o.table}</TableCell>
                  <TableCell className="text-right">{o.items}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(o.total)}</TableCell>
                  <TableCell className="text-muted-foreground">{o.payment}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tone[o.status.toLowerCase()] ?? tone.pending}>{o.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}