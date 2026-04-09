"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { categories, menuItems } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import CategoryPill from "@/components/CategoryPill";
import MenuItemCard from "@/components/MenuItemCard";

export default function CustomerDashboard() {
  const [activeCategory, setActiveCategory] = useState("chef-special");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [expandedSection, setExpandedSection] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return searchQuery ? matchesSearch : matchesCategory;
  });

  const activeCategoryData = categories.find((c) => c.id === activeCategory);
  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalCartPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const addToCart = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) =>
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });

  return (
    <>
      <div className="flex gap-5">
        <InputGroup className="max-w-xl">
          <InputGroupInput className="bg-white" placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          {/* <InputGroupAddon align="inline-end">12 results</InputGroupAddon> */}
        </InputGroup>

        <FieldGroup className="w-full max-w-xs bg-white">
          <Field>
            <Select defaultValue="banana">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </div>

      <div className="bg-[#f9f7f5] flex flex-col w-full relative">
        {/* Category Scroll */}
        {!searchQuery && (
          <div className="sticky z-20 bg-[#f9f7f5] backdrop-blur-xl border-b border-border/30">
            <div
              ref={categoryScrollRef}
              className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
            >
              {categories.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  category={cat}
                  isActive={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="lg:px-3 sm:px-4 pb-24">
          <button
            onClick={() => setExpandedSection(!expandedSection)}
            className="flex items-center justify-between w-full py-3 mt-1"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {searchQuery ? "Search Results" : activeCategoryData?.name}{" "}
              <span className="text-muted-foreground font-body text-sm font-normal">
                ({filteredItems.length})
              </span>
            </h2>
            {expandedSection ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection && (
              <motion.div
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantity={cart[item.id] || 0}
                    onAdd={() => addToCart(item.id)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
                {filteredItems.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm w-full">
                    No items found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Footer */}
        <AnimatePresence>
          {totalCartItems > 0 && (
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-40"
            >
              <div className="bg-primary text-primary-foreground rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg shadow-primary/25">
                <div>
                  <p className="text-xs font-medium opacity-80">
                    {totalCartItems} item{totalCartItems > 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-bold">
                    ₹ {totalCartPrice.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="font-semibold text-primary"
                >
                  View Cart →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Nav */}
      </div>
    </>
  );
}
