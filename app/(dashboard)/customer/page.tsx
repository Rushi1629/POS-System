"use client";

import {
  ChevronDown,
  ChevronRightCircleIcon,
  ChevronUp,
  RotateCcw,
  Search,
  UserCheck2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useEditTableSessionCustomer,
  useFetchTableByTokenCustomer,
  useFetchCategoriesCustomer,
  useFetchMenusCustomer,
} from "@/client/hooks/useCustomer";
import CategoryPill from "@/components/CategoryPill";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemSkeleton from "@/components/MenuItemSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addItemAction, removeItemAction } from "@/store/cart/cartSlice";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ApiLoader from "@/components/ApiLoader";
import { useProfile } from "@/client/hooks/useAuth";
import { getCartKey } from "@/types/cart-types";

export default function CustomerDashboard() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState(true);
  const [guestCountDialog, setGuestCountDialog] = useState(false);
  const [guestInput, setGuestInput] = useState("");
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableToken = searchParams?.get("tableToken");

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const {
    data: tableData,
    isLoading: isLoadingTable,
    refetch: refetchTable,
  } = useFetchTableByTokenCustomer(tableToken);

  // Only fetch profile if NOT a public QR customer session
  const { data: profile } = useProfile({ enabled: !tableToken });

  console.log(profile, "profile");

  const isAdmin =
    !tableToken &&
    profile?.role?.name &&
    ["Super Admin", "Admin"].includes(profile.role.name);

  const table = tableData;

  console.log(table, "table");

  const isSessionStarted =
    table?.tableStatus === "OCCUPIED" && (table?.guestCount ?? 0) > 0;

  useEffect(() => {
    if (!table) return;

    const shouldOpen =
      table.tableStatus !== "OCCUPIED" || (table.guestCount ?? 0) === 0;

    setGuestCountDialog(shouldOpen);
  }, [table]);

  const { mutateAsync: updateTableSession, isPending: isUpdatingSession } =
    useEditTableSessionCustomer();

  // console.log("tableToken:", tableToken, "tableData:", table);

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

  console.log(menuMap, "menuMap");

  const addToCart = useCallback(
    (itemId: number) => {
      const item = menuMap[itemId];
      if (!item) return;

      dispatch(
        addItemAction({
          id: item.id,
          cartKey: getCartKey(item.id, [], item.menuType),
          name: item.name,
          price: item.price,
          quantity: 1,
          menuType: item.menuType,
          imageUrl: item.imageUrl,
          description: item.description,
          extras: [],
        }),
      );
    },
    [dispatch, menuMap],
  );

  const handleAdd = (item: any) => {
    debugger;
    if (!item.subMenuItems || item.subMenuItems.length === 0) {
      addToCart(item.id);
      return;
    }

    setSelectedExtras([]);
    setSelectedItem(item);
  };

  const handleConfirmAdd = useCallback(() => {
    debugger;
    if (!selectedItem) return;

    dispatch(
      addItemAction({
        id: selectedItem.id,
        cartKey: getCartKey(
          selectedItem.id,
          selectedExtras,
          selectedItem.menuType,
        ),
        name: selectedItem.name,
        price: Number(selectedItem.price),
        quantity: selectedQuantity,
        menuType: selectedItem.menuType,
        imageUrl: selectedItem.imageUrl,
        description: selectedItem.description,
        extras: [...selectedExtras].map((e) => ({
          ...e,
          quantity: e.quantity || 1,
        })),
      }),
    );

    setSelectedItem(null);
    setSelectedExtras([]);
    setSelectedQuantity(1);
  }, [selectedItem, selectedExtras, selectedQuantity]);

  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce(
      (total, item) => total + Number(item.price) * (item.quantity ?? 1),
      0,
    );
  }, [selectedExtras]);

  const removeFromCart = useCallback(
    (id: number, menuType?: string) => {
      const cartKey = [...Object.values(cart)]
        .reverse()
        .find((item) => item.id === id && item.menuType === menuType)?.cartKey;
      if (cartKey) {
        dispatch(removeItemAction(cartKey));
      }
    },
    [cart],
  );

  const totalCartItems = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) =>
        sum +
        ((Number(item.price) || 0) +
          (item.extras?.reduce((s, e) => s + (Number(e.price) || 0), 0) || 0)) *
          (Number(item.quantity) || 0),
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

  const handleGuestCountConfirm = async () => {
    const count = parseInt(guestInput);

    if (count > 0 && count <= (table?.capacity ?? 0)) {
      try {
        await updateTableSession({
          tableId: table?.id as number,
          guestCount: count,
          status: "OCCUPIED",
          notes: "Guest count updated from customer",
        });

        // 🔥 THIS LINE FIXES EVERYTHING
        await refetchTable();

        setGuestCountDialog(false);
        setGuestInput("");
      } catch (error) {
        console.error("Failed to update guest count:", error);
      }
    }
  };

  const handleExtraClick = (extra: any) => {
    debugger;
    setSelectedExtras((prev) => {
      const existing = prev.find((e) => e.id === extra.id);

      if (existing) {
        return prev.map((e) =>
          e.id === extra.id
            ? {
                ...e,
                quantity: (e.quantity ?? 1) + 1,
              }
            : e,
        );
      }

      return [
        ...prev,
        {
          ...extra,
          quantity: 1,
        },
      ];
    });
  };

  const handleExtraIncrement = (extra: any) => {
    setSelectedExtras((prev) => {
      const existing = prev.find((e) => e.id === extra.id);

      if (existing) {
        return prev.map((e) =>
          e.id === extra.id ? { ...e, quantity: (e.quantity ?? 1) + 1 } : e,
        );
      }

      return [...prev, { ...extra, quantity: 1 }];
    });
  };

  console.log(selectedExtras, "SELECTED EXTRAS BEFORE ADD");

  const handleExtraDecrement = (extra: any) => {
    setSelectedExtras((prev) => {
      const existing = prev.find((e) => e.id === extra.id);

      if (!existing) return prev;

      if (existing.quantity === 1) {
        // remove completely
        return prev.filter((e) => e.id !== extra.id);
      }

      return prev.map((e) =>
        e.id === extra.id ? { ...e, quantity: e.quantity - 1 } : e,
      );
    });
  };

  if (!isAdmin && (isLoadingTable || !table)) {
    return <ApiLoader message="Loading table..." />;
  }
  if (!isAdmin && !isSessionStarted) {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Users className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Please Confirm Guest Count</h2>
            <p className="text-muted-foreground">
              Enter the number of guests to continue browsing the menu
            </p>
            <Button
              onClick={() => setGuestCountDialog(true)}
              className="bg-[#e25f28] hover:bg-[#d14f1f]"
            >
              Enter Guest Count
            </Button>
          </div>
        </div>

        {table && (
          <Dialog open={guestCountDialog}>
            <DialogContent
              className="sm:max-w-sm max-w-lg max-h-[90vh] flex flex-col"
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Welcome to {table.name}
                </DialogTitle>
                <DialogDescription>
                  Please enter the number of guests at your table.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 overflow-y-auto px-2 no-scrollbar">
                <div className="bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-orange-900 mb-2">
                    Table Information
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-orange-700">Table Name</p>
                      <p className="text-xs font-semibold text-orange-900">
                        {table.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700">Capacity</p>
                      <p className="text-xs font-semibold text-orange-900">
                        {table.capacity}{" "}
                        {table.capacity === 1 ? "Guest" : "Guests"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700">Type</p>
                      <p className="text-xs font-semibold text-orange-900">
                        {table.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700">
                        Rate Per Minute / Guest
                      </p>
                      <p className="text-xs font-semibold text-orange-900">
                        {table.ratePerMinute
                          ? `₹ ${table.ratePerMinute.toFixed(2)}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest-count" className="">
                    Number of Guests (Max: {table.capacity})
                  </Label>

                  <div className="relative">
                    <UserCheck2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="guest-count"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      max={table.capacity}
                      value={guestInput}
                      onChange={(e) => setGuestInput(e.target.value)}
                      placeholder={`Enter 1 to ${table.capacity} guests`}
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                </div>

                {guestInput && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-900">
                      <span className="font-semibold">Seated Guests:</span>{" "}
                      <span className="text-lg font-bold">{guestInput}</span> /{" "}
                      {table.capacity}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGuestCountDialog(false);
                    setGuestInput("");
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={handleGuestCountConfirm}
                  className="bg-[#e25f28] hover:bg-[#d14f1f]"
                  disabled={
                    isUpdatingSession ||
                    !guestInput ||
                    parseInt(guestInput) < 1 ||
                    parseInt(guestInput) > (table?.capacity ?? 0)
                  }
                >
                  {isUpdatingSession ? "Updating..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <>
      {/* {isOccupied && ( */}
      <>
        <div className="w-full mb-4">
          {/* <div className="flex flex-col md:flex-row gap-3 md:items-center"> */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-65 max-w-2xl">
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

        <div className="bg-(--background) flex flex-col w-full relative">
          {/* 📂 Category Scroll */}
          {!searchQuery && (
            <div className="sticky z-20 bg-(--background) backdrop-blur-xl border-b border-border/30">
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
                        quantity={Object.values(cart)
                          .filter(
                            (cartItem) =>
                              cartItem.id === item.id &&
                              cartItem.menuType === item.menuType,
                          )
                          .reduce(
                            (sum, cartItem) => sum + cartItem.quantity,
                            0,
                          )}
                        onAdd={() => handleAdd(item)}
                        onRemove={() => removeFromCart(item.id, item.menuType)}
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
                  onClick={() =>
                    router.push(`/customer/cart?tableToken=${tableToken}`)
                  }
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
      {/* )} */}

      <Dialog
        open={selectedItem !== null}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="max-h-[90vh] rounded-3xl p-0 sm:max-w-xl flex flex-col">
          {selectedItem && (
            <>
              <DialogHeader className="border-b px-6 py-5 text-left">
                <DialogTitle className="text-lg font-semibold">
                  Customize {selectedItem.name}
                </DialogTitle>
                <DialogDescription>
                  Select any extras you would like with your {selectedItem.name}
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 py-2 overflow-y-auto px-2 no-scrollbar">
                {selectedItem.subMenuItems?.map((extra: any) => {
                  const checked = selectedExtras.some((e) => e.id === extra.id);

                  return (
                    <label
                      key={extra.id}
                      className="flex items-center gap-4 py-4 border-b"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleExtraDecrement(extra)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center"
                        >
                          -
                        </button>

                        <span className="w-5 text-center">
                          {selectedExtras.find((e) => e.id === extra.id)
                            ?.quantity || 0}
                        </span>

                        <button
                          onClick={() => handleExtraIncrement(extra)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <span className="flex-1">
                        <p className="font-semibold">{extra.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {extra.description}
                        </p>
                      </span>

                      <span>₹ {extra.price}</span>
                    </label>
                  );
                })}
              </div>

              <DialogFooter className="p-5">
                <Button onClick={handleConfirmAdd} className="w-full">
                  Add to Cart · ₹ {Number(selectedItem.price) + extrasTotal}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
