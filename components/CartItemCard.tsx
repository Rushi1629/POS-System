"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import React from "react";
import { CartItem } from "@/types/cart-types";

interface CartItemCardProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onNoteChange?: (notes: string) => void;
}

const CartItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onNoteChange,
}: CartItemCardProps) => {
  // const total = item.price * item.quantity;

  const extrasTotal =
    item.extras?.reduce((sum, e) => sum + e.price * e.quantity, 0) || 0;

  const total = (item.price + extrasTotal) * item.quantity;

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex items-start gap-4">
        {/* ✅ IMAGE */}
        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
          {item.imageUrl ? (
            <img
              src={item.imageUrl || "/placeholder.png"}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <span className="text-2xl font-bold text-primary/50">
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base text-foreground leading-tight">
                  {item.name}
                </h3>

                {/* <span
                  className={`inline-block h-4 w-4 rounded-sm border-2 ${
                    item.menuType === "Veg" ? "border-[#30a661]" : "border-[#dc2828]"
                  }`}
                >
                  <span
                    className={`block h-2 w-2 rounded-full m-[2px] ${
                      item.menuType === "Veg" ? "bg-[#30a661]" : "bg-[#dc2828]"
                    }`}
                  /> */}

                <span
                  className={`inline-flex items-center justify-center w-4 h-4 border-2 rounded-sm ${
                    item.menuType === "Veg"
                      ? "border-[#30a661]"
                      : "border-[#dc2828]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.menuType === "Veg" ? "bg-[#30a661]" : "bg-[#dc2828]"
                    } `}
                  />
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {item.description}
                {item.extras && item.extras.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {item.extras.map((extra: any) => (
                      <div
                        key={extra.id}
                        className="flex justify-between text-sm text-muted-foreground"
                      >
                        <span>+ {extra.name}</span>
                        <span>₹{extra.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </p>
              <div className="mt-3">
                <label className="block text-sm font-medium text-muted-foreground">
                  Item notes
                </label>
                <Input
                  value={item.notes ?? ""}
                  onChange={(e) => onNoteChange?.(e.target.value)}
                  placeholder="Add note for this item"
                  className="mt-2"
                />
              </div>
            </div>

            {/* PRICE */}
            <div className="text-right shrink-0">
              <p className="text-lg font-bold tabular-nums text-primary">
                {/* ₹{item.price * item.quantity} */}
                ₹{total}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-muted-foreground">
                  ₹{item.price} × {item.quantity}
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
            <button
              onClick={onRemove}
              className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>

            <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-md hover:bg-[#e66b19] hover:text-white"
                onClick={onDecrement}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>

              <span className="w-8 text-center text-sm font-semibold">
                {item.quantity}
              </span>

              <Button
                size="icon"
                className="h-8 w-8 rounded-md bg-[#e66b19] text-white"
                onClick={onIncrement}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CartItemCard);
