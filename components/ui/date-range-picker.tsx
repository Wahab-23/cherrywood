"use client"

import * as React from "react"
import {
  format,
  subDays,
  startOfToday,
  startOfYesterday,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfYear,
  subYears,
  isValid,
  parse
} from "date-fns"
import { Calendar as CalendarIcon, ChevronRight } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}) {
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setTempDate(date)
  }, [date])

  // Explicit presets from GA screenshot
  const presets = [
    { label: 'Custom', getValue: () => tempDate },
    { label: 'Today', getValue: () => ({ from: startOfToday(), to: endOfDay(new Date()) }) },
    { label: 'Yesterday', getValue: () => ({ from: startOfYesterday(), to: endOfDay(startOfYesterday()) }) },
    { label: 'This week (Sun - Today)', getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 0 }), to: endOfDay(new Date()) }) },
    { label: 'Last 7 days', getValue: () => ({ from: subDays(startOfToday(), 7), to: endOfDay(new Date()) }) },
    { label: 'Last week (Sun - Sat)', getValue: () => ({ from: startOfWeek(subDays(new Date(), 7), { weekStartsOn: 0 }), to: endOfWeek(subDays(new Date(), 7), { weekStartsOn: 0 }) }) },
    { label: 'Last 28 days', getValue: () => ({ from: subDays(startOfToday(), 28), to: endOfDay(new Date()) }) },
    { label: 'Last 30 days', getValue: () => ({ from: subDays(startOfToday(), 30), to: endOfDay(new Date()) }) },
    { label: 'This month', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
    { label: 'Last month', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
    { label: 'Last 90 days', getValue: () => ({ from: subDays(startOfToday(), 90), to: endOfDay(new Date()) }) },
    { label: 'This year (Jan - Today)', getValue: () => ({ from: startOfYear(new Date()), to: endOfDay(new Date()) }) },
    { label: 'Last calendar year', getValue: () => ({ from: startOfYear(subYears(new Date(), 1)), to: endOfMonth(subMonths(startOfYear(new Date()), 1)) }) },
  ]

  const handleApply = () => {
    setDate(tempDate)
    setIsOpen(false)
  }

  const handleInputChange = (val: string, type: 'from' | 'to') => {
    const parsedDate = parse(val, "MMM dd, yyyy", new Date())
    if (isValid(parsedDate)) {
      setTempDate(prev => ({
        from: type === 'from' ? parsedDate : prev?.from,
        to: type === 'to' ? parsedDate : prev?.to
      }))
    }
  }

  const isCustomActive = !presets.slice(1).some((preset) => {
    const val = preset.getValue()
    return (
      tempDate?.from?.toDateString() === val?.from?.toDateString() &&
      tempDate?.to?.toDateString() === val?.to?.toDateString()
    )
  })

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full lg:w-[320px] justify-between text-left font-bold text-xs h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 transition-all group px-4",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-blue-500 group-hover:rotate-12 transition-transform" />
              <span className="text-slate-400 mr-2 whitespace-nowrap hidden sm:inline-block">
                {presets.slice(1).find((preset) => {
                  const val = preset.getValue()
                  return (
                    date?.from?.toDateString() === val?.from?.toDateString() &&
                    date?.to?.toDateString() === val?.to?.toDateString()
                  )
                })?.label || 'Custom'}
              </span>
              {date?.from ? (
                date.to ? (
                  <span className="text-slate-900 dark:text-white">
                    {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
                  </span>
                ) : (
                  <span className="text-slate-900 dark:text-white">{format(date.from, "MMM d, yyyy")}</span>
                )
              ) : (
                <span>Select range</span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform rotate-90 lg:rotate-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-950 flex flex-col md:flex-row"
          align="end"
          sideOffset={8}
        >
          {/* Sidebar Presets */}
          <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-50 dark:border-slate-900 p-2 bg-white dark:bg-slate-950">
            <div className="space-y-0.5">
              {presets.map((preset, i) => {
                const isActive = i === 0
                  ? isCustomActive  // Custom = active when no preset matches
                  : (
                    tempDate?.from?.toDateString() === preset.getValue()?.from?.toDateString() &&
                    tempDate?.to?.toDateString() === preset.getValue()?.to?.toDateString()
                  )

                return (
                  <button
                    key={preset.label}
                    onClick={() => i !== 0 && setTempDate(preset.getValue())}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Calendar View */}
          <div className="flex flex-col bg-white dark:bg-slate-950">
            {/* Top Bar with Inputs */}
            <div className="p-6 pb-2 flex items-center gap-4">
              <div className="relative group flex-1">
                <label className="absolute -top-2 left-3 px-1 bg-white dark:bg-slate-950 text-[10px] font-bold text-blue-500 z-10 transition-colors">Start date</label>
                <input
                  type="text"
                  placeholder="MMM dd, yyyy"
                  value={tempDate?.from ? format(tempDate.from, "MMM dd, yyyy") : ''}
                  onChange={(e) => handleInputChange(e.target.value, 'from')}
                  className="w-full h-11 px-4 border-2 border-blue-500 rounded-xl bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
              <span className="text-slate-300 font-bold">—</span>
              <div className="relative group flex-1">
                <label className="absolute -top-2 left-3 px-1 bg-white dark:bg-slate-950 text-[10px] font-bold text-slate-400 z-10">End date</label>
                <input
                  type="text"
                  placeholder="MMM dd, yyyy"
                  value={tempDate?.to ? format(tempDate.to, "MMM dd, yyyy") : ''}
                  onChange={(e) => handleInputChange(e.target.value, 'to')}
                  className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm font-bold focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="p-2">
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={tempDate?.from}
                selected={tempDate}
                onSelect={setTempDate}
                numberOfMonths={2}
                className="bg-transparent"
              />
            </div>

            {/* Footer Actions */}
            <div className="mt-auto border-t border-slate-50 dark:border-slate-900 p-4 flex items-center justify-end gap-6">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors px-4"
              >
                Apply
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
