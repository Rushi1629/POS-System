"use client";

import OrderSummary from "@/components/OrderSummary";
import CartItemCard from "@/components/CartItemCard";
import { menuItems } from "@/lib/data";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addItemAction, removeItemAction } from "@/store/cart/cartSlice";

import { useCallback, useMemo } from "react";

const CartView = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart.cart);

  const addItem = useCallback(
    (id: string) => {
      dispatch(addItemAction(id));
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch(removeItemAction(id));
    },
    [dispatch],
  );

  // ✅ Create fast lookup map (VERY IMPORTANT)
  const menuMap = useMemo(() => {
    return Object.fromEntries(menuItems.map((i) => [i.id, i]));
  }, []);

  // ✅ Convert cart → UI items (optimized)
  const items = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const item = menuMap[id];

      return {
        ...item,
        quantity: qty,
      };
    });
  }, [cart, menuMap]);

  // ✅ Derived values (memoized)
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items],
  );

  const totalQty = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items],
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* 🧾 Items */}
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onIncrement={() => addItem(item.id)}
            onDecrement={() => removeItem(item.id)}
            onRemove={() => removeItem(item.id)}
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
