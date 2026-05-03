import { Category } from '@/types/types';
import React from 'react'
import { Card, CardContent } from './ui/card';
import StatusPill from './StatusPill';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';

function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group overflow-hidden border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#f77f00]/10 to-accent">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-bold text-[#f77f00]/40">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusPill active={category.isActive} />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="truncate font-semibold">{category.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {category.description || "No description"}
        </p>
        <div className="mt-4 flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={onEdit} className="gap-1.5">
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

export default CategoryCard