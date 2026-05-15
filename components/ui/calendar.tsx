"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, UI, SelectionState, DayFlag } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        [UI.Months]: "flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0",
        [UI.Month]: "space-y-4",
        [UI.MonthCaption]: "flex justify-start pt-1 relative items-center px-4 mb-4",
        [UI.CaptionLabel]: "text-[11px] font-black uppercase tracking-[0.2em] text-slate-400",
        [UI.Nav]: "space-x-1 flex items-center",
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-8 top-0 rounded-full"
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-0 top-0 rounded-full"
        ),
        [UI.MonthGrid]: "w-full border-collapse",
        [UI.Weekdays]: "flex mb-2",
        [UI.Weekday]:
          "text-slate-400 rounded-md w-9 font-bold text-[10px] uppercase tracking-tighter",
        [UI.Week]: "flex w-full mt-0",
        [UI.Day]: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        [UI.DayButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative z-10"
        ),
        [SelectionState.selected]: "z-20",
        [SelectionState.range_start]: [
          "[&>button]:bg-blue-600 [&>button]:text-white [&>button]:rounded-full",
          "after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:left-1/2 after:bg-blue-50 dark:after:bg-blue-900/20 after:-z-10"
        ].join(" "),
        [SelectionState.range_end]: ["[&>button]:bg-blue-600 [&>button]:text-white [&>button]:rounded-full",
          "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:right-1/2 after:bg-blue-50 dark:after:bg-blue-900/20 after:-z-10"
        ].join(" "),
        [SelectionState.range_middle]: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-none",
        [DayFlag.today]: "before:content-[''] before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-blue-600 before:rounded-full before:z-30",
        [DayFlag.outside]: "text-slate-300 opacity-50",
        [DayFlag.disabled]: "text-slate-300 opacity-50",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) => {
          if (props.orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
