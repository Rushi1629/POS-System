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
import { useFetchTableByTokenCustomer } from "@/client/hooks/useCustomer";
import { useCreateOrder, useFetchActiveOrders } from "@/client/hooks/useOrder";
import { clearCartDB, loadCartFromDB, saveCartToDB } from "@/lib/db";
import { setCartAction, updateItemNoteAction } from "@/store/cart/cartSlice";
import ApiLoader from "@/components/ApiLoader";
import { CartItem, getCartKey } from "@/types/cart-types";
import { toast } from "sonner";

// 🔽 ADD HERE (top of file, before CartView component)

const mapOrdersToCart = (orders: any): Record<string, CartItem> => {
  const cartItems: Record<string, CartItem> = {};
  const ordersArray = Array.isArray(orders) ? orders : [orders];

  ordersArray.forEach((order: any) => {
    order.items
      ?.filter((item: any) => !item.isCancelled)
      .forEach((item: any) => {
        const extras =
          item.orderSubMenuItems
            ?.filter((e: any) => !e.isCancelled)
            .map((e: any) => ({
              id: e.subMenuItem.id || e.subMenuItem.subMenuItemId,
              name: e.subMenuItem.name,
              // price: Number(e.unitPrice), // ✅ FIXED
              price: Number(
                e.unitPrice && Number(e.unitPrice) > 0
                  ? e.unitPrice
                  : e.subMenuItem?.price,
              ),
              quantity: e.quantity,
            })) || [];

        const cartKey = getCartKey(
          item.menuItem.id,
          extras,
          item.menuItem.menuType,
        );

        cartItems[cartKey] = {
          id: item.menuItem.id,
          name: item.menuItem.name,
          description: "",
          price: Number(
            item.unitPrice ?? item.menuItem?.price ?? 0, // ✅ FIX
          ), // ✅ FIXED
          quantity: item.quantity,
          originalQuantity: item.quantity,
          orderItemId: item.orderItemId,
          extras,
          notes: item.notes || undefined,
          cartKey,
          menuType: item.menuItem.menuType,
          imageUrl: "",
        };
      });
  });

  return cartItems;
};

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
  const { data: ActiveOrders, refetch: refetchActiveOrders } =
    useFetchActiveOrders();

  useEffect(() => {
    if (!ActiveOrders) return;

    const mappedCart = mapOrdersToCart(ActiveOrders);

    dispatch(setCartAction(mappedCart));
  }, [ActiveOrders]);

  console.log(ActiveOrders, "ActiveOrders");

  const tableId = tableData?.id;

  console.log(tableId, "datatable");

  const cart = useSelector((state: RootState) => state.cart?.items ?? {});

  console.log(cart, "cart");

  // ✅ Convert cart → UI items (optimized)
  const items = useMemo(() => {
    return Object.values(cart);
  }, [cart]);

  console.log(items, "items");

  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

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
        notes: orderNotes || undefined,
        orderItems: items.map((item) => {
          const isCancelled = item.quantity === 0;

          return {
            menuItemId: Number(item.id),

            // ✅ IMPORTANT FIX
            quantity: isCancelled
              ? item.originalQuantity || 1 // send old qty OR 1
              : item.quantity,

            ...(item.orderItemId && { orderItemId: item.orderItemId }),

            ...(isCancelled && { isCancelled: true }),

            notes: item.notes || undefined,

            orderSubMenuItems: Array.isArray(item.extras)
              ? item.extras.map((e) => ({
                  subMenuItemId: e.id,
                  quantity: e.quantity || 1,
                }))
              : [],
          };
        }),
      });
      // dispatch(clearCartAction());

      await clearCartDB(tableToken ?? undefined);
      await refetchActiveOrders();
      toast.success("Order placed successfully.");
      // router.push(`/customer?tableToken=${tableToken}`);
    } catch (err: any) {
      setOrderError(err?.message ?? "Failed to place order. Please try again.");
      setOrderSuccess("");
    }
  }, [items, placeOrder, tableId, router, orderNotes]);

  console.log(items, "items");

  // ✅ Derived values (memoized)
  const { subtotal, totalQty } = useMemo(() => {
    debugger;
    return items.reduce(
      (acc, item) => {
        const baseTotal = Number(item.price) * item.quantity;

        const extrasPerItem =
          (item.extras?.reduce((sum, e) => sum + e.price * e.quantity, 0) ||
            0) / item.quantity;

        // ✅ NO MULTIPLY HERE
        const itemTotal = (item.price + extrasPerItem) * item.quantity;

        acc.subtotal += itemTotal;
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

  if (isPlacingOrder) {
    return <ApiLoader message="Placing your order..." />;
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* 🧾 Items */}
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <CartItemCard
            key={item.cartKey}
            item={item}
            onIncrement={() =>
              dispatch(
                addItemAction({
                  ...item,
                  quantity: 1, // ✅ ONLY increment by 1
                }),
              )
            }
            onDecrement={() => dispatch(removeItemAction(item.cartKey))}
            onRemove={() => dispatch(removeItemAction(item.cartKey))}
            onNoteChange={(notes) =>
              dispatch(updateItemNoteAction({ cartKey: item.cartKey, notes }))
            }
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
          orderNotes={orderNotes}
          onOrderNotesChange={setOrderNotes}
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
