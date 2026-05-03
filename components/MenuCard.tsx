import React from "react";
import { Card, CardContent } from "./ui/card";
import StatusPill from "./StatusPill";
import VegBadge from "./VegBadge";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { MenuItem } from "@/types/types";

function MenuCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group overflow-hidden border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/10 to-accent">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-bold text-primary/40">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <StatusPill active={item.available} />
        </div>
        <div className="absolute right-3 top-3">
          <VegBadge isVeg={item.menuType === "Veg"} />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{item.name}</h3>
            <Badge variant="secondary" className="mt-1 rounded-full text-xs">
              {item.category.name}
            </Badge>
          </div>
          <span className="shrink-0 font-bold tabular-nums text-primary">
            ₹{item.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {item.description || "No description"}
        </p>
        {item.subMenuItems.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            +{item.subMenuItems.length} add-on
            {item.subMenuItems.length === 1 ? "" : "s"}
          </p>
        )}
        <div className="mt-3 flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuCard;
