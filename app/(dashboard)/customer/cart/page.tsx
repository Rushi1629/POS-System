"use client";
import { useState } from "react";
import OrderSummary from "@/components/OrderSummary";
import CartItemCard, { CartItem } from "@/components/CartItemCard";

const initialItems: CartItem[] = [
  {
    id: "1",
    name: "Mango Royale Smoothie",
    description: "Ripe mangoes, yogurt, honey & mint",
    price: 289,
    quantity: 2,
    isVeg: true,
    isBest: true,
  },
  {
    id: "2",
    name: "Mango Kick Mocktail",
    description: "Sweet mango, lime kick & soda",
    price: 159,
    quantity: 1,
    isVeg: true,
  },
  {
    id: "3",
    name: "Mango Delight Croissant",
    description: "Buttery croissant with mango cream",
    price: 179,
    quantity: 1,
    isVeg: true,
    isBest: true,
  },
  {
    id: "4",
    name: "Truffle Mushroom Toast",
    description: "Sourdough, mushrooms, truffle oil",
    price: 249,
    quantity: 3,
    isVeg: true,
  },
];

const CartView = () => {

  const [items, setItems] = useState<CartItem[]>(initialItems);

  const update = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
      ),
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onIncrement={(id) => update(id, 1)}
              onDecrement={(id) => update(id, -1)}
              onRemove={remove}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="w-full xl:w-80 shrink-0">
          <OrderSummary itemCount={totalQty} subtotal={subtotal} />
        </div>
      </div>
    </>
  );
};

export default CartView;
