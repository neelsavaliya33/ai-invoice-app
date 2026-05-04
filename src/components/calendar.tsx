"use client";

import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "min-w-[320px] rounded-2xl bg-[hsl(var(--popover))] p-3 text-[hsl(var(--popover-foreground))]",
        className,
      )}
      style={{
        backgroundColor: "hsl(var(--popover))",
        color: "hsl(var(--popover-foreground))",
        ...props.style,
      }}
      classNames={{
        months: "flex flex-col gap-4",
        month: "space-y-4",
        month_caption: "flex h-9 items-center justify-center text-sm font-semibold",
        nav: "absolute inset-x-3 top-4 flex items-center justify-between",
        button_previous:
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground",
        button_next:
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground",
        chevron: "h-4 w-4",
        weekdays: "grid grid-cols-7 text-center text-xs font-medium text-muted-foreground",
        weekday: "h-8 leading-8",
        week: "grid grid-cols-7",
        day: "grid h-9 w-9 place-items-center rounded-lg text-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring",
        today: "bg-muted text-foreground",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        outside: "text-muted-foreground/45",
        disabled: "pointer-events-none text-muted-foreground/35",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className }) =>
          orientation === "left" ? (
            <ChevronLeft className={className} />
          ) : (
            <ChevronRight className={className} />
          ),
      }}
      {...props}
    />
  );
}
