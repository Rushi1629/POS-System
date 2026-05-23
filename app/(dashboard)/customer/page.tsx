"use client";

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
  ChevronRightCircleIcon,
  ChevronUp,
  RotateCcw,
  RotateCw,
  Search,
  SearchIcon,
} from "lucide-react";
// import { menuItems } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CategoryPill from "@/components/CategoryPill";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemSkeleton from "@/components/MenuItemSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addItemAction, removeItemAction } from "@/store/cart/cartSlice";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import {
  useFetchCategoriesCustomer,
  useFetchMenusCustomer,
} from "@/api/hooks/useCustomer";

export default function CustomerDashboard() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    data: allCategory = [],
    isPending: isFetchingCategories,
    isFetching,
    isError,
  } = useFetchCategoriesCustomer();

  const categories = useMemo(() => {
    return allCategory.filter((c) => c.isActive === true);
  }, [allCategory]);

  const { data: menuItems = [], isLoading } = useFetchMenusCustomer();

  console.log(menuItems, "menuItems");

  useEffect(() => {
    console.log("✅ categories updated:", allCategory);
  }, [allCategory]);

  // ✅ redux state
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart.items);

  const menuMap = useMemo(() => {
    return Object.fromEntries(menuItems.map((i) => [i.id, i]));
  }, [menuItems]);

  const addToCart = useCallback(
    (itemId: number) => {
      const item = menuMap[itemId];
      if (!item) return;

      dispatch(
        addItemAction({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1, // reducer will override if needed
          menuType: item.menuType,
          // isBest: item.isBest,
          imageUrl: item.imageUrl,
          description: item.description,
        }),
      );
    },
    [dispatch, menuMap],
  );

  const removeFromCart = useCallback(
    (id: number) => {
      dispatch(removeItemAction(id));
    },
    [dispatch],
  );

  const totalCartItems = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [cart]);

  // ✅ Filter logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory
        ? item.category.id === activeCategory
        : true;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return searchQuery ? matchesSearch : matchesCategory;
    });
  }, [menuItems, activeCategory, searchQuery]);

  console.log(filteredItems, "filter");
  const activeCategoryData = useMemo(() => {
    return categories.find((c) => Number(c.id) === activeCategory);
  }, [categories, activeCategory]);

  function resetFilters() {
    setSearchQuery("");
  }

  return (
    <>
      {/* 🔍 Search + Filter */}
      <div className="w-full mb-4">
        {/* <div className="flex flex-col md:flex-row gap-3 md:items-center"> */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px] max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food, drinks..."
              className="h-12 rounded-full border-border bg-card pl-9 pr-4 text-sm shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 gap-2 rounded-full bg-card px-5 shadow-sm"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory(null);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
        {/* </div> */}
      </div>

      <div className="bg-[#f9f7f5] flex flex-col w-full relative">
        {/* 📂 Category Scroll */}
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
                  isActive={Number(activeCategory) === Number(cat.id)}
                  onClick={() => setActiveCategory(Number(cat.id))}
                />
              ))}
            </div>
          </div>
        )}

        {/* 🍽️ Menu Items */}
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

          {/* <AnimatePresence> */}
          {expandedSection && (
            <motion.div
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {isLoading ? (
                // 🔥 Skeleton Loader Grid
                Array.from({ length: 8 }).map((_, i) => (
                  <MenuItemSkeleton key={i} />
                ))
              ) : (
                <>
                  {filteredItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantity={cart[item.id]?.quantity || 0}
                      onAdd={() => addToCart(item.id)}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))}

                  {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm w-full">
                      No items found
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
          {/* </AnimatePresence> */}
        </div>

        {/* 🛒 Cart Footer */}
        {/* <AnimatePresence> */}
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-40"
          >
            <div className="bg-[#e25f28] text-primary-foreground rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg shadow-primary/25">
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
                onClick={() => router.push("/customer/cart")}
                className="font-semibold text-[#e25f28] bg-[#f1edea]"
              >
                View Cart <ChevronRightCircleIcon />
              </Button>
            </div>
          </motion.div>
        )}
        {/* </AnimatePresence> */}
      </div>
    </>
  );
}
