"use client";
import React, { useState } from "react";
import {
  ShoppingBag,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";

const couponSchema = z
  .string()
  .trim()
  .min(1, "Enter a coupon code")
  .max(30, "Code too long")
  .regex(/^[A-Za-z0-9_-]+$/, "Invalid characters");

const AVAILABLE_COUPONS = [
  {
    code: "MANGO20",
    label: "20% off on mango items",
    discount: 20,
    type: "percent" as const,
  },
  {
    code: "FLAT100",
    label: "Flat ₹100 off on orders above ₹999",
    discount: 100,
    type: "flat" as const,
    minOrder: 999,
  },
  {
    code: "NEWUSER",
    label: "15% off for new users",
    discount: 15,
    type: "percent" as const,
  },
];

interface OrderSummaryProps {
  itemCount: number;
  subtotal: number;
  gstRate?: number;
  orderNotes?: string;
  onOrderNotesChange?: (notes: string) => void;
  isPlacingOrder?: boolean;
  onPlaceOrder?: () => void;
}

const OrderSummary = (props: OrderSummaryProps) => {
  const {
    itemCount,
    subtotal,
    gstRate = 0,
    orderNotes = "",
    onOrderNotesChange,
    isPlacingOrder = false,
    onPlaceOrder,
  } = props;

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<
    (typeof AVAILABLE_COUPONS)[0] | null
  >(null);
  const [error, setError] = useState("");

  const applyCoupon = (code: string) => {
    const result = couponSchema.safeParse(code);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    const found = AVAILABLE_COUPONS.find(
      (c) => c.code.toLowerCase() === result.data.toLowerCase(),
    );
    if (!found) {
      setError("Invalid coupon code");
      return;
    }
    if (found.minOrder && subtotal < found.minOrder) {
      setError(`Minimum order ₹${found.minOrder} required`);
      return;
    }
    setAppliedCoupon(found);
    setError("");
    setShowCoupon(false);
    setCouponInput("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setError("");
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.discount) / 100)
      : appliedCoupon.discount
    : 0;

  const afterDiscount = subtotal - discountAmount;
  const gst = Math.round((afterDiscount * gstRate) / 100);
  const total = afterDiscount + gst;

  return (
    <div className="rounded-xl border border-border bg-card p-6 sticky top-6">
      <h2 className="font-display text-xl font-semibold text-foreground mb-5">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({itemCount} items)</span>
          <span className="text-foreground font-medium">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Order notes
          </label>
          <Textarea
            value={orderNotes ?? ""}
            onChange={(e) => onOrderNotesChange?.(e.target.value)}
            placeholder="Add order note"
            className="mt-2"
            rows={3}
          />
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-center text-success">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {appliedCoupon.code}
              <button
                onClick={removeCoupon}
                className="text-muted-foreground hover:text-destructive ml-1 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
            <span className="font-medium">-₹{discountAmount}</span>
          </div>
        )}

      </div>

      <Separator className="my-4" />

      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold font-display text-foreground">
          ₹{total.toLocaleString()}
        </span>
      </div>

      <Button
        className="w-full mt-5 h-12 text-base font-semibold rounded-xl bg-[#e66b19] text-primary-foreground hover:bg-[#e66b19]/90 shadow-lg shadow-[#e66b19]/20"
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || itemCount === 0 || !onPlaceOrder}
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        {isPlacingOrder ? "Placing order..." : "Place Order"}
      </Button>
    </div>
  );
};

export default React.memo(OrderSummary);
