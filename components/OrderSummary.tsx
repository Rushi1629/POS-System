"use client";
import React, { useState } from "react";
import {
  Percent,
  ChevronRight,
  ShoppingBag,
  X,
  Tag,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
    gstRate = 5,
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

        <div className="flex justify-between text-muted-foreground">
          <span>GST ({gstRate}%)</span>
          <span className="text-foreground font-medium">₹{gst}</span>
        </div>
      </div>

      {/* Coupon Section */}
      {!appliedCoupon && (
        <>
          {!showCoupon ? (
            <button
              onClick={() => setShowCoupon(true)}
              className="w-full mt-4 flex items-center gap-2 text-sm text-[#e66b19] font-medium hover:bg-[#e66b19]/5 rounded-lg px-3 py-2.5 transition-colors -mx-3"
            >
              <Percent className="h-4 w-4" />
              <span>Apply coupon or promo code</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
          ) : (
            <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              {/* Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter code"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setError("");
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && applyCoupon(couponInput)
                    }
                    className="pl-9 h-10 text-sm uppercase tracking-wider font-medium border-border focus-visible:ring-1 focus-visible:ring-[#e66b19]"
                    maxLength={30}
                  />
                </div>
                <Button
                  size="sm"
                  className="h-10 px-4 bg-[#e66b19] text-primary-foreground hover:bg-[#e66b19]/90"
                  onClick={() => applyCoupon(couponInput)}
                >
                  Apply
                </Button>
              </div>
              {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
              )}

              {/* Available coupons */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Available Coupons
                </p>
                {AVAILABLE_COUPONS.map((coupon) => (
                  <button
                    key={coupon.code}
                    onClick={() => applyCoupon(coupon.code)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border border-dashed border-[#e66b194d] bg-[#e66b1908] hover:bg-[#e66b1912] hover:border-[#e66b1980] transition-all text-left group"
                  >
                    <Ticket className="h-5 w-5 text-[#e66b19] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold tracking-widest border-[#e66b1966]/40 text-[#e66b19] px-2"
                        >
                          {coupon.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {coupon.label}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#e66b19] shrink-0">
                      Apply
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowCoupon(false);
                  setError("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}

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
