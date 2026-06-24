import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const EmptyEmptyState = ({ tab }: { tab: "active" | "past" }) => {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center">
      <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60" />
      <p className="mt-4 text-sm font-medium text-foreground">
        {tab === "active" ? "No active orders right now" : "No past orders yet"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {tab === "active"
          ? "Place an order and track it live here."
          : "Your order history will appear here once you complete an order."}
      </p>
      <Button asChild className="mt-5 rounded-full">
        <Link href="/customer">Browse Menu</Link>
      </Button>
    </div>
  );
};

export default EmptyEmptyState;
