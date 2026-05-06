import { categorySchema } from "@/Schema/categorySchema";
import { Category, CategoryDialogProps } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { AlignLeft, ImagePlus, Loader2, Type } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";
import { Textarea } from "./ui/textarea";
import z from "zod";

function CategoryDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  loading, // ✅ include it
}: CategoryDialogProps) {
  type FormData = z.infer<typeof categorySchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      imageFile: undefined,
    },
  });
  const isActive = watch("isActive");
  // const [image, setImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (open) {
    reset({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      isActive: initial?.isActive ?? true,
      imageFile: undefined,
    });

    setImageFile(null);
    setPreview(initial?.imageUrl ?? "");
  }
}, [open, initial, reset]); // ✅ ADD reset

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

    setValue("imageFile", file); // ✅ VERY IMPORTANT

    // ✅ store actual file
    setImageFile(file);

    // ✅ create preview URL (separate state)
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    // optional: clear error
  }

  const onSubmit = async (data: FormData) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("isActive", String(data.isActive));

    if (data.imageFile) {
      formData.append("imageFile", data.imageFile);
    }

    await onSave(formData);

    if (!initial) {
      reset();
      setPreview("");
      setImageFile(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!loading) onOpenChange(o); // ✅ block close while saving
      }}
    >
      <DialogContent className="sm:max-w-[540px] max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl">
            {initial ? "Edit category" : "Create new category"}
          </DialogTitle>
          <DialogDescription>
            {initial
              ? "Update the details below and save your changes."
              : "Fill in the details to add a new category to your menu."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2 overflow-y-auto pr-2 no-scrollbar">
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
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g. Hot Beverages"
                maxLength={60}
                className="pl-9"
                autoComplete="off"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <AlignLeft className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Short summary..."
                rows={3}
                maxLength={400}
                className="pl-9"
              />
            </div>
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <div>
              <Label htmlFor="active" className="text-sm font-medium">
                Active
              </Label>
              <p className="text-xs text-muted-foreground">
                Visible on the menu when active.
              </p>
            </div>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
              className="data-[state=checked]:bg-[#f77f00] data-[state=unchecked]:bg-gray-300"
            />
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-[#f77f00] hover:bg-[#f77f00]/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : initial ? (
              "Save changes"
            ) : (
              "Create category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryDialog;
