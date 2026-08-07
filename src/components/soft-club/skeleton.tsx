"use client";

import * as React from "react";
import { cx } from "@/lib/soft-club/cx";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-skeleton", className)} ref={ref} {...props} />
  )
);

Skeleton.displayName = "Skeleton";
