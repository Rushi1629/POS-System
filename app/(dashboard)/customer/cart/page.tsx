"use client";

import OrderSummary from "@/components/OrderSummary";
import CartItemCard from "@/components/CartItemCard";
// import { menuItems } from "@/lib/data";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addItemAction, removeItemAction } from "@/store/cart/cartSlice";

import { useMemo } from "react";

const CartView = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart?.items ?? {});

  // ✅ Convert cart → UI items (optimized)
  const items = useMemo(() => {
    return Object.values(cart);
  }, [cart]);

  console.log(items,"items");
  

  // ✅ Derived values (memoized)
  const { subtotal, totalQty } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.subtotal += item.price * item.quantity;
        acc.totalQty += item.quantity;
        return acc;
      },
      { subtotal: 0, totalQty: 0 },
    );
  }, [items]);

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* 🧾 Items */}
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onIncrement={() => dispatch(addItemAction(item))}
            onDecrement={() => dispatch(removeItemAction(item.id))}
            onRemove={() => dispatch(removeItemAction(item.id))}
          />
        ))}

        {items.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Your cart is empty</p>
          </div>
        )}
      </div>

      {/* 📊 Summary */}
      <div className="w-full xl:w-80 shrink-0">
        <OrderSummary itemCount={totalQty} subtotal={subtotal} />
      </div>
    </div>
  );
};

export default CartView;
