import { MenuItem } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import VegBadge from "./VegBadge";
import { Badge } from "./ui/badge";
import { Minus, Plus, Star } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";

const MenuItemCard = ({ item, quantity, onAdd, onRemove }: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) =>
 {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card rounded-2xl border border-border/60 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Image placeholder / colored header */}
      <div className="relative h-36 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-300">
            {item.category === "hot-coffee"
              ? "☕"
              : item.category === "coolers"
                ? "🍹"
                : item.category === "fries"
                  ? "🍟"
                  : item.category === "burgers"
                    ? "🍔"
                    : item.category === "smoothie"
                      ? "🥤"
                      : item.category === "chef-special"
                        ? "👨‍🍳"
                        : "🍽️"}
          </span>
        </div>
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <VegBadge isVeg={item.isVeg} />
          {item.isBestseller && (
            <Badge
              variant="secondary"
              className="bg-[#e25f28] text-primary-foreground border-0 text-[10px] px-1.5 py-0 font-semibold gap-0.5 shadow-sm"
            >
              <Star className="w-2.5 h-2.5 fill-primary-foreground" /> Best
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5">
        <h3 className="font-heading text-sm font-semibold text-foreground leading-snug line-clamp-2">
          {item.name}
        </h3>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40">
          <p className="text-base font-bold text-foreground">₹{item.price}</p>
          {quantity > 0 ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-0 border border-[#e25f28] rounded-lg overflow-hidden"
            >
              <button
                onClick={onRemove}
                className="p-1 text-[#e25f28] hover:bg-primary/10 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-semibold text-[#e25f28] min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                onClick={onAdd}
                className="p-1 text-[#e25f28] hover:bg-primary/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onAdd}
              className="border-[#e25f28] text-[#e25f28] hover:bg-[#e25f28] hover:text-primary-foreground font-semibold text-xs px-4 h-8 rounded-lg"
            >
              + Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(MenuItemCard);
