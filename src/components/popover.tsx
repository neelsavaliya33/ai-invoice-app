"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-[130] rounded-2xl border border-border bg-[hsl(var(--popover))] p-3 text-[hsl(var(--popover-foreground))] shadow-2xl outline-none animate-scale-in",
          className,
        )}
        style={{
          backgroundColor: "hsl(var(--popover))",
          color: "hsl(var(--popover-foreground))",
          boxShadow:
            "0 24px 80px rgba(0, 0, 0, 0.42), 0 0 0 1px hsl(var(--border))",
          ...props.style,
        }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
