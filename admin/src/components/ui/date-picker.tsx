import * as React from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date())

  // Generate weeks and days
  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const handleSelect = (day: Date) => {
    if (onChange) {
      // Toggle selection
      if (value && isSameDay(value, day)) {
        onChange(undefined)
      } else {
        onChange(day)
      }
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 border-input bg-transparent text-foreground",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              {format(currentMonth, "MMMM yyyy")}
            </h4>
            <div className="flex gap-1">
              <Button
                variant="outline"
                className="h-7 w-7 p-0 flex items-center justify-center"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-7 w-7 p-0 flex items-center justify-center"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Weekdays */}
            {weekDays.map((wd) => (
              <span key={wd} className="text-[11px] font-medium text-muted-foreground uppercase py-1">
                {wd}
              </span>
            ))}

            {/* Days */}
            {days.map((day) => {
              const isSelected = value ? isSameDay(day, value) : false
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "h-8 w-8 rounded-md text-xs font-normal transition-colors flex items-center justify-center cursor-pointer",
                    !isCurrentMonth && "text-muted-foreground/30",
                    isCurrentMonth && "text-foreground",
                    isToday(day) && !isSelected && "bg-accent/40 font-bold border border-primary/25",
                    isSelected && "bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/95",
                    isCurrentMonth && !isSelected && "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {format(day, "d")}
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
