import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./Button"
import { Calendar } from "./Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  label,
  error,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3 py-2 border-gray-300 bg-white hover:bg-white focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent focus:ring-offset-0",
              !value && "text-gray-500",
              error && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear() + 5}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
