import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface OptionType {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const handleUnselect = (itemValue: string) => {
    onChange(selected.filter((val) => val !== itemValue))
  }

  const handleSelect = (itemValue: string) => {
    if (selected.includes(itemValue)) {
      onChange(selected.filter((val) => val !== itemValue))
    } else {
      onChange([...selected, itemValue])
    }
  }

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-[38px] h-auto py-1.5 px-3 bg-transparent text-left font-normal border-input hover:bg-transparent",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
            {selected.length === 0 && (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
            {selected.map((val) => {
              const option = options.find((o) => o.value === val)
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="mr-1 mb-1 pr-1 pl-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground flex items-center gap-1 hover:bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(val)
                  }}
                >
                  {option ? option.label : val}
                  <span className="rounded-full hover:bg-muted p-0.5 transition-colors cursor-pointer">
                    <X className="h-3 w-3 stroke-[2.5]" />
                  </span>
                </Badge>
              )
            })}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="max-h-[220px] overflow-y-auto p-1 flex flex-col gap-0.5">
          {filteredOptions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No results found.</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-sm text-sm cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent/40"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input mr-1 transition-colors",
                      isSelected && "bg-primary border-primary text-primary-foreground"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              )
            })
          )}
        </div>
        {selected.length > 0 && (
          <div className="border-t p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="w-full text-xs h-7 hover:bg-destructive/10 hover:text-destructive"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
