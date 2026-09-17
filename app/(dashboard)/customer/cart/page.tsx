"use client";

import OrderSummary from "@/components/OrderSummary";
import CartItemCard from "@/components/CartItemCard";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  addItemAction,
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
              price: Number(
                e.unitPrice && Number(e.unitPrice) > 0
                  ? e.unitPrice
                  : e.subMenuItem?.price,
              ),
              quantity: e.quantity,
            })) || [];

        const menuItemId = item.menuItem?.id ?? item.menuItem?.menuItemId;
        if (!menuItemId) return;

        const cartKey = getCartKey(String(menuItemId));

        cartItems[cartKey] = {
          id: String(menuItemId),
          name: item.menuItem.name,
          description: "",
          price: Number(
            item.unitPrice ?? item.menuItem?.price ?? 0,
          ),
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

  const tableId = tableData?.id;

  const cart = useSelector((state: RootState) => state.cart?.items ?? {});

  const items = useMemo(() => {
    return Object.values(cart);
  }, [cart]);

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
      const orderItemsPayload = items
        .filter((item) => {
          const isCancelled = item.quantity === 0;
          const isExisting = item.orderItemId !== undefined && item.orderItemId !== null;
          const qtyChanged =
            typeof item.originalQuantity === "number" &&
            item.quantity !== item.originalQuantity;

          return !isExisting || isCancelled || qtyChanged || !!item.isUpdated;
        })
        .map((item) => {
          const isCancelled = item.quantity === 0;
          const isExisting =
            item.orderItemId !== undefined && item.orderItemId !== null;

          return {
            menuItemId: item.id,
            quantity: isCancelled ? item.originalQuantity || 1 : item.quantity,
            ...(isExisting &&
            ((typeof item.originalQuantity === "number" &&
              item.quantity !== item.originalQuantity) ||
              isCancelled ||
              !!item.isUpdated)
              ? { orderItemId: item.orderItemId }
              : {}),
            ...(isCancelled && { isCancelled: true }),
            notes: item.notes || undefined,
            orderSubMenuItems: Array.isArray(item.extras)
              ? item.extras.map((e) => ({
                  subMenuItemId: e.id,
                  quantity: e.quantity || 1,
                }))
              : [],
          };
        });

      await placeOrder({
        tableId,
        notes: orderNotes || undefined,
        orderItems: orderItemsPayload,
      });

      await clearCartDB(tableToken ?? undefined);
      await refetchActiveOrders();
      toast.success("Order placed successfully.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to place order. Please try again.");
      setOrderSuccess("");
    }
  }, [items, placeOrder, tableId, router, orderNotes]);

  const { subtotal, totalQty } = useMemo(() => {
    
    return items.reduce(
      (acc, item) => {
        const baseTotal = Number(item.price) * item.quantity;

        const extrasPerItem =
          (item.extras?.reduce((sum, e) => sum + e.price * e.quantity, 0) ||
            0) / item.quantity;

        const itemTotal = (item.price + extrasPerItem) * item.quantity;

        acc.subtotal += itemTotal;
        acc.totalQty += item.quantity;

        return acc;
      },
      { subtotal: 0, totalQty: 0 },
    );
  }, [items]);

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

  useEffect(() => {
    if (!hasMounted) return;
    saveCartToDB(cart, tableToken ?? undefined);
  }, [cart, tableToken, hasMounted]);

  if (!hasMounted) {
    return <ApiLoader message="Loading your Cart items..." />;
  }

  if (isPlacingOrder) {
    return <ApiLoader message="Placing your order..." />;
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 pt-6 lg:pt-8">
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <CartItemCard
            key={item.cartKey}
            item={item}
            onIncrement={() =>
              dispatch(
                addItemAction({
                  ...item,
                  quantity: 1,
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
