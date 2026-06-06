"use client";

import OrderSummary from "@/components/OrderSummary";
import CartItemCard from "@/components/CartItemCard";
// import { menuItems } from "@/lib/data";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  addItemAction,
  clearCartAction,
  removeItemAction,
} from "@/store/cart/cartSlice";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetchTableByTokenCustomer } from "@/api/hooks/useCustomer";
import { useCreateOrder } from "@/api/hooks/useOrder";
import { clearCartDB, loadCartFromDB, saveCartToDB } from "@/lib/db";
import { setCartAction } from "@/store/cart/cartSlice";
import ApiLoader from "@/components/ApiLoader";

const CartView = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableToken = searchParams?.get("tableToken");

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { data: tableData } = useFetchTableByTokenCustomer(tableToken);
  const tableId = tableData?.id;

  console.log(tableId, "datatable");

  const cart = useSelector((state: RootState) => state.cart?.items ?? {});

  // ✅ Convert cart → UI items (optimized)
  const items = useMemo(() => {
    return Object.values(cart);
  }, [cart]);

  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  const { mutateAsync: placeOrder, isPending: isPlacingOrder } =
    useCreateOrder();

  const handlePlaceOrder = useCallback(async () => {
    if (items.length === 0) {
      setOrderError("Your cart is empty.");
      setOrderSuccess("");
      return;
    }

    if (!tableId) {
      setOrderError(
        "Unable to place order. Please open the cart from a table QR or refresh the page.",
      );
      setOrderSuccess("");
      return;
    }

    setOrderError("");
    try {
      await placeOrder({
        tableId,
        notes: "Order placed from customer cart",
        orderItems: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      });
      // dispatch(clearCartAction());
      // await clearCartDB(tableToken ?? undefined);
      setOrderSuccess("Order placed successfully.");
      router.push(`/customer?tableToken=${tableToken}`);
    } catch (err: any) {
      setOrderError(err?.message ?? "Failed to place order. Please try again.");
      setOrderSuccess("");
    }
  }, [items, placeOrder, tableId, router]);

  console.log(items, "items");

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
  // Load cart for this tableToken from IndexedDB on mount / when token changes
  useEffect(() => {
    if (!hasMounted) return;
    let mounted = true;
    const load = async () => {
      const itemsFromDB = await loadCartFromDB(tableToken ?? undefined);
      if (!mounted) return;
      if (itemsFromDB && Object.keys(itemsFromDB).length > 0) {
        dispatch(setCartAction(itemsFromDB));
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [tableToken, hasMounted]);

  // Persist cart to IndexedDB when it changes (per tableToken)
  useEffect(() => {
    if (!hasMounted) return;
    // debounce not necessary for now
    saveCartToDB(cart, tableToken ?? undefined);
  }, [cart, tableToken, hasMounted]);

  if (!hasMounted) {
    return <ApiLoader message="Loading your Cart items..." />;
  }

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
        <OrderSummary
          itemCount={totalQty}
          subtotal={subtotal}
          isPlacingOrder={isPlacingOrder}
          onPlaceOrder={handlePlaceOrder}
        />
        {orderError ? (
          <p className="mt-4 text-sm text-destructive">{orderError}</p>
        ) : null}
        {orderSuccess ? (
          <p className="mt-4 text-sm text-success">{orderSuccess}</p>
        ) : null}
      </div>
    </div>
  );
};

export default CartView;
