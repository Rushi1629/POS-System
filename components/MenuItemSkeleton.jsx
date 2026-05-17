import React from 'react'
import { Skeleton } from "@/components/ui/skeleton";

const MenuItemSkeleton = () => {
    return (
        <div className="bg-card rounded-2xl border border-border/60 overflow-hidden flex flex-col">

            {/* Image Skeleton */}
            <Skeleton className="h-36 w-full" />

            {/* Content */}
            <div className="p-3.5 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />

                <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <Skeleton className="h-5 w-12 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default MenuItemSkeleton