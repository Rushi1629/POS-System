import React, { useEffect, useRef, useState } from "react";
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
  ImagePlus,
  IndianRupee,
  Leaf,
  Loader2,
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
import { SubFormRow, SubMenuItem } from "@/types/types";
import { menuSchema } from "@/Schema/menuScheme";
import { Input } from "@/components/input";
import { FormValues, menuDialogProps, MenuPayload } from "@/types/menu-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFetchSubMenus } from "@/client/hooks/useSubmenu";

function MenuDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  allCategory,
  loading,
}: menuDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(menuSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      available: true,
      menuType: "Veg",
      submenu: [],
      imageFile: undefined,
    },
  });

  const [submenu, setSubmenu] = useState<SubFormRow[]>([]);
  const { data: submenuResponse } = useFetchSubMenus(1, 100, "", "all");
  const submenuOptions = submenuResponse?.data ?? [];

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  function handleFile(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    // ✅ set in RHF
    setValue("imageFile", file);

    // ✅ store file
    setImageFile(file);

    // ✅ preview
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  const menuType = watch("menuType");

  useEffect(() => {
    if (!open) return; // ✅ only run when dialog opens

    if (initial) {
      // 👉 EDIT MODE
      const mappedSubmenu =
        initial.subMenuItems?.map((s: SubMenuItem) => ({
          subMenuItemId: s.id,
          name: s.name,
          price: Number(s.price),
          available: s.available,
          description: s.description,
        })) || [];

      reset({
        name: initial.name,
        description: initial.description,
        price: initial.price,
        categoryId: String(initial.category?.id),
        available: initial.available,
        menuType: initial.menuType,
        submenu: mappedSubmenu,
        imageFile: undefined,
      });

      setSubmenu(mappedSubmenu);
      setPreview(initial.imageUrl ?? "");
      setImageFile(null);
    } else {
      // 👉 CREATE MODE (IMPORTANT 🔥)
      reset({
        name: "",
        description: "",
        price: 0,
        categoryId: "", // ✅ important
        available: true,
        menuType: "Veg",
        submenu: [],
        imageFile: undefined,
      });

      setSubmenu([]);
      setPreview("");
      setImageFile(null);
    }
  }, [open, initial, reset]);

  function addSub() {
    setSubmenu((prev) => [
      ...prev,
      {
        subMenuItemId: undefined,
        name: "",
        price: "",
        available: true,
        description: "",
      },
    ]);
  }
  function removeSub(i: number) {
    setSubmenu((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateSub(i: number, patch: Partial<SubFormRow>) {
    setSubmenu((prev) => {
      const updated = prev.map((s, idx) => {
        if (idx !== i) return s;

        const next = { ...s, ...patch };

        if (patch.subMenuItemId !== undefined) {
          const selected = submenuOptions.find(
            (item) => item.id === patch.subMenuItemId,
          );

          if (selected) {
            next.name = selected.name;
            next.price = Number(selected.price);
            next.available = selected.available;
            next.description = selected.description || "";
          }
        }

        return next;
      });

      setValue(
        "submenu",
        updated.map((s) => ({
          subMenuItemId: s.subMenuItemId || undefined,
          name: s.name || "",
          price: s.price !== undefined ? Number(s.price) : undefined,
          available: s.available ?? true,
          description: s.description || "",
        })),
      );

      return updated;
    });
  }

  // ✅ Submit handler → convert to FormData
  const onSubmit = async (values: FormValues) => {
    debugger;
    console.log("🔥 SUBMIT CALLED");
    try {
      if (!values.categoryId) {
        toast.error("Please select a category");
        return;
      }
      // ✅ FIX HERE
      const payload: MenuPayload = {
        name: values.name,
        description: values.description || "",
        price: values.price,
        categoryId: String(values.categoryId),
        available: values.available,
        menuType: values.menuType,
      };

      const cleanSubmenu = (values.submenu || [])
        .filter(
          (s) =>
            s.subMenuItemId !== undefined &&
            s.subMenuItemId !== null &&
            String(s.subMenuItemId).trim() !== "",
        )
        .map((s) => ({
          subMenuItemId: String(s.subMenuItemId),
        }));

      if (cleanSubmenu.length > 0) {
        payload.submenu = cleanSubmenu;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (values.imageFile) {
        formData.append("imageFile", values.imageFile); // ✅ FIX
      }

      for (let pair of formData.entries()) {
        console.log("FORMDATA:", pair[0], pair[1]);
      }
      await onSave(formData);
      console.log("Form saved successfully");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save menu item");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!loading) onOpenChange(o); // ✅ block close while saving
      }}
    >
      <DialogContent
        className="sm:max-w-160 max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
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

        <div className="grid gap-5 py-2 overflow-y-auto px-2 no-scrollbar">
          <div className="grid gap-2">
            <Label>Image</Label>
            <div
              className="group relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/40 transition-colors hover:border-[#f77f00]/60 hover:bg-muted"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    <span className="rounded-md bg-background/90 px-3 py-1.5 text-sm font-medium">
                      Replace image
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm">Click to upload image</p>
                  <p className="text-xs">PNG, JPG up to 2MB</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>
            {errors.imageFile?.message && (
              <p className="text-xs text-destructive">
                {String(errors.imageFile.message)}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="m-name">Name</Label>
            <div className="relative">
              <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="m-name"
                {...register("name")}
                placeholder="Menu name"
                className="pl-9"
              />
            </div>

            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
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
                  {...register("price")}
                  placeholder="129.25"
                  className="pl-9"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={watch("categoryId") ? String(watch("categoryId")) : ""}
                onValueChange={(v) => setValue("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategory.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Menu Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("menuType", "Veg")}
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
                onClick={() => setValue("menuType", "NonVeg")}
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
                {...register("description")}
                placeholder="Short description of the item..."
                rows={3}
                className="pl-9"
              />
            </div>
          </div>

          <div
            className="flex items-center justify-between rounded-lg border p-3 cursor-pointer"
            onClick={() => setValue("available", !watch("available"))}
          >
            <div>
              <Label className="text-sm">Available</Label>
              <p className="text-xs text-muted-foreground">
                Customers can order this item when on.
              </p>
            </div>

            <Switch
              checked={watch("available")}
              onCheckedChange={(v) => setValue("available", v)}
              onClick={(e) => e.stopPropagation()} // ✅ IMPORTANT
            />
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
                {submenu.map((s, i) => {
                  const selectedSubmenu = submenuOptions.find(
                    (item) => item.id === s.subMenuItemId,
                  );

                  return (
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

                      <div className="mt-2 space-y-2">
                        <Select
                          value={s.subMenuItemId ? String(s.subMenuItemId) : ""}
                          onValueChange={(value) =>
                            updateSub(i, { subMenuItemId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select submenu item" />
                          </SelectTrigger>
                          <SelectContent>
                            {submenuOptions.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedSubmenu ? (
                          <div className="rounded-md border bg-background/60 p-2 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-foreground">
                                {selectedSubmenu.name}
                              </span>
                              <span className="font-semibold text-foreground">
                                ₹{Number(selectedSubmenu.price).toFixed(2)}
                              </span>
                            </div>
                            {selectedSubmenu.description ? (
                              <p className="mt-1 text-[11px]">
                                {selectedSubmenu.description}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      {errors.submenu?.[i]?.subMenuItemId && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors.submenu[i]?.subMenuItemId?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit, (errors) => {
              console.log("❌ VALIDATION ERRORS:", errors);
            })}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : initial ? (
              <>
                <Pencil className="h-4 w-4" />
                Save changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create item
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MenuDialog;
