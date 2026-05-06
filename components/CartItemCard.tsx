"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { CartItem } from "@/types/cart-types";

interface CartItemCardProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) => {
  const total = item.price * item.quantity;

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block h-4 w-4 rounded-sm border-2 ${item.isVeg ? "border-[#30a661]" : "border-[#dc2828]"}`}
            >
              <span
                className={`block h-2 w-2 rounded-full m-[2px] ${item.isVeg ? "bg-[#30a661]" : "bg-[#dc2828]"}`}
              />
            </span>
            {item.isBest && (
              <Badge className="bg-[#f36f16] text-primary-foreground text-[10px] px-2 py-0 font-semibold tracking-wide">
                ★ Best
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-base text-foreground leading-tight">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {item.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-foreground">₹{total}</p>
          {item.quantity > 1 && (
            <p className="text-xs text-muted-foreground">
              ₹{item.price} × {item.quantity}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
        <button
          onClick={onRemove}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium flex items-center gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>

        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-md hover:bg-[#e66b19] hover:text-primary-foreground transition-colors"
            onClick={onDecrement}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-8 text-center text-sm font-semibold text-foreground">
            {item.quantity}
          </span>
          <Button
            size="icon"
            className="h-8 w-8 rounded-md bg-[#e66b19] text-primary-foreground hover:bg-primary/90"
            onClick={onIncrement}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CartItemCard);
