"use client";
import type { VariantProps } from "class-variance-authority";
import {
  type ComponentPropsWithRef,
  createContext,
  type ReactNode,
  use,
  useId,
  useMemo,
} from "react";

import { cn } from "../../lib/cn";

import { buttonVariants } from "./button";

type PopoverContextValue = {
  popoverId: string;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

const Popover = ({ children }: { children: ReactNode }) => {
  const rawId = useId();
  const popoverId = `fd-popover-${rawId.replaceAll(":", "")}`;
  const contextValue = useMemo(() => ({ popoverId }), [popoverId]);
  return <PopoverContext value={contextValue}>{children}</PopoverContext>;
};

type PopoverTriggerProps = ComponentPropsWithRef<"button"> & VariantProps<typeof buttonVariants>;

const PopoverTrigger = ({ children, className, color, size, ...props }: PopoverTriggerProps) => {
  const ctx = use(PopoverContext);
  if (!ctx) {
    throw new Error("PopoverTrigger must be used inside Popover");
  }
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "popover-anchor",
        (color ?? size) && buttonVariants({ color, size }),
        className,
      )}
      popoverTarget={ctx.popoverId}
    >
      {children}
    </button>
  );
};

type PopoverContentProps = ComponentPropsWithRef<"div">;

const PopoverContent = ({ children, className, ...props }: PopoverContentProps) => {
  const ctx = use(PopoverContext);
  if (!ctx) {
    throw new Error("PopoverContent must be used inside Popover");
  }
  return (
    <div
      {...props}
      className={cn(
        "m-0 [&:not(:popover-open)]:hidden",
        "bg-docs-popover/60 text-docs-popover-foreground max-w-popover-viewport z-50 min-w-60 overflow-y-auto rounded-xl border p-2 text-sm shadow-lg backdrop-blur-lg",
        "popover-position mt-1",
        className,
      )}
      id={ctx.popoverId}
      popover="auto"
    >
      {children}
    </div>
  );
};

export { Popover, PopoverContent, PopoverTrigger };
