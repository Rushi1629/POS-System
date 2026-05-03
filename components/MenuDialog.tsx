import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  AlignLeft,
  Drumstick,
  IndianRupee,
  Leaf,
  Pencil,
  Plus,
  Type,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { MenuFormData, MenuItem, MenuType, SubFormRow } from "@/types/types";
import { menuSchema } from "@/Schema/menuScheme";
import { Input } from "@/components/input";

function MenuDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: MenuItem | null;
  onSave: (data: MenuFormData) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [menuType, setMenuType] = useState<MenuType>("Veg");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState<string>("");
  const [submenu, setSubmenu] = useState<SubFormRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const lastInitialId = useRef<string | null>(null);
  const key = open ? String(initial?.id ?? "new") : null;
  if (open && lastInitialId.current !== key) {
    lastInitialId.current = key;
    setName(initial?.name ?? "");
    setPrice(initial ? String(initial.price) : "");
    setMenuType(initial?.menuType ?? "Veg");
    setDescription(initial?.description ?? "");
    setAvailable(initial?.available ?? true);
    setCategoryId(initial ? String(initial.category.id) : "");
    setSubmenu(
      initial
        ? initial.subMenuItems.map((s) => ({
            name: s.name,
            price: String(s.price),
            available: s.available,
            description: s.description,
          }))
        : [],
    );
    setErrors({});
  }
  if (!open && lastInitialId.current !== null) {
    lastInitialId.current = null;
  }

  function addSub() {
    setSubmenu((prev) => [
      ...prev,
      { name: "", price: "", available: true, description: "" },
    ]);
  }
  function removeSub(i: number) {
    setSubmenu((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateSub(i: number, patch: Partial<SubFormRow>) {
    setSubmenu((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }

  function submit() {
    const parsed = menuSchema.safeParse({
      name,
      price: Number(price),
      menuType,
      description,
      available,
      categoryId: categoryId ? Number(categoryId) : undefined,
      submenu: submenu.map((s) => ({
        name: s.name,
        price: Number(s.price),
        available: s.available,
        description: s.description,
      })),
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    onSave(parsed.data);
  }

  const categoryList: Array<{ id: number; name: string }> = [
    { id: 1, name: "Pizza" },
    { id: 3, name: "Burger" },
    { id: 4, name: "Small Burger" },
    { id: 5, name: "Beverages" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initial ? "Edit menu item" : "Create new menu item"}
          </DialogTitle>
          <DialogDescription>
            {initial
              ? "Update the details below and save your changes."
              : "Fill in the details to add a new item to your menu."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2 overflow-y-auto pr-2 no-scrollbar">
          <div className="grid gap-2">
            <Label htmlFor="m-name">Name</Label>
            <div className="relative">
              <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="m-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Veg Cheese Burger"
                className="pl-9"
                maxLength={80}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="m-price">Price</Label>
              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="m-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="129.25"
                  className="pl-9"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Menu Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMenuType("Veg")}
                className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                  menuType === "Veg"
                    ? "border-chart-2 bg-chart-2/10 text-chart-2"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Leaf className="h-4 w-4" /> Veg
              </button>
              <button
                type="button"
                onClick={() => setMenuType("NonVeg")}
                className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                  menuType === "NonVeg"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Drumstick className="h-4 w-4" /> Non-Veg
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="m-desc">Description</Label>
            <div className="relative">
              <AlignLeft className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="m-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the item..."
                rows={3}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm">Available</Label>
              <p className="text-xs text-muted-foreground">
                Customers can order this item when on.
              </p>
            </div>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>

          {/* Submenu / add-ons */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Add-ons (Submenu)</Label>
                <p className="text-xs text-muted-foreground">
                  Optional extras like extra cheese, sauces, etc.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addSub}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>

            {submenu.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
                No add-ons added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {submenu.map((s, i) => (
                  <div key={i} className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Add-on #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSub(i)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove add-on"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <Input
                        value={s.name}
                        onChange={(e) => updateSub(i, { name: e.target.value })}
                        placeholder="Name (e.g. Extra cheese)"
                      />
                      <div className="relative">
                        <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={s.price}
                          onChange={(e) =>
                            updateSub(i, { price: e.target.value })
                          }
                          placeholder="Price"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <Input
                      value={s.description}
                      onChange={(e) =>
                        updateSub(i, { description: e.target.value })
                      }
                      placeholder="Description"
                      className="mt-2"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Available
                      </span>
                      <Switch
                        checked={s.available}
                        onCheckedChange={(v) => updateSub(i, { available: v })}
                      />
                    </div>
                    {errors[`submenu.${i}.name`] && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors[`submenu.${i}.name`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} className="gap-2">
            {initial ? (
              <>
                <Pencil className="h-4 w-4" /> Save changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Create item
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MenuDialog;
