"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Loader2, ArrowDown } from "lucide-react";

interface PullToRefreshProps {
  children: React.ReactNode;
  /** Async function to run when pulled (e.g. refetching queries, router.refresh) */
  onRefresh: () => Promise<unknown> | void;
  /** Maximum drag threshold in pixels required to trigger refresh */
  pullThreshold?: number;
  /** Maximum allowed pull distance */
  maxPullDistance?: number;
}

export function PullToRefresh({
  children,
  onRefresh,
  pullThreshold = 80,
  maxPullDistance = 120,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);

  const startY = useRef(0);
  const isDragging = useRef(false);
  const pullDistance = useMotionValue(0);

  // Rotation and opacity transforms for the indicator
  const rotate = useTransform(pullDistance, [0, pullThreshold], [0, 180]);
  const opacity = useTransform(
    pullDistance,
    [0, 20, pullThreshold],
    [0, 0.4, 1],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow pulling if scrolled to the absolute top of the page
    if (window.scrollY === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
      setCanPull(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && window.scrollY === 0) {
      // Add damping resistance so pulling feels natural
      const dampedDistance = Math.min(diff * 0.4, maxPullDistance);
      pullDistance.set(dampedDistance);
    } else {
      pullDistance.set(0);
      isDragging.current = false;
    }
  };

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current || isRefreshing) return;
    isDragging.current = false;
    setCanPull(false);

    if (pullDistance.get() >= pullThreshold) {
      setIsRefreshing(true);
      // Animate to threshold height while loading
      animate(pullDistance, pullThreshold, { duration: 0.2 });

      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh error:", error);
      } finally {
        setIsRefreshing(false);
        // Animate back to top
        animate(pullDistance, 0, { duration: 0.3 });
      }
    } else {
      // Return to origin if threshold wasn't reached
      animate(pullDistance, 0, { duration: 0.2 });
    }
  }, [isRefreshing, onRefresh, pullDistance, pullThreshold]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen"
    >
      {/* Pull Indicator Spinner / Icon */}
      <motion.div
        style={{
          y: pullDistance,
          opacity: isRefreshing ? 1 : opacity,
        }}
        className="absolute -top-12 left-0 right-0 flex justify-center items-center pointer-events-none z-50"
      >
        <div className="bg-background/90 text-foreground border border-border/40 shadow-md rounded-full p-2.5 flex items-center justify-center backdrop-blur-sm">
          {isRefreshing ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <motion.div style={{ rotate }}>
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Content pulled down slightly with the gesture */}
      <motion.div style={{ y: pullDistance }}>{children}</motion.div>
    </div>
  );
}
