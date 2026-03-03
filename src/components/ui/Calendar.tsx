import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  addMonths,
  subMonths,
  setMonth,
  setYear,
  getYear,
  getMonth,
  isValid,
} from "date-fns"
import { cn } from "../../lib/utils"
import { SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select"

export type CalendarProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  classNames?: any
  showOutsideDays?: boolean
  initialFocus?: boolean
  captionLayout?: string
  fromYear?: number
  toYear?: number
}

export function Calendar({
  mode,
  selected,
  onSelect,
  className,
  fromYear = 1900,
  toYear = 2100,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected && isValid(selected) ? selected : startOfToday())
  const [direction, setDirection] = React.useState(0)

  // Update currentMonth when selected date changes, but only if it's valid
  React.useEffect(() => {
    if (selected && isValid(selected)) {
      setCurrentMonth(selected)
    }
  }, [selected])

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  })

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => (fromYear + i).toString())

  const handleMonthChange = (month: string) => {
    const newMonth = months.indexOf(month)
    setDirection(newMonth > getMonth(currentMonth) ? 1 : -1)
    setCurrentMonth(setMonth(currentMonth, newMonth))
  }

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year)
    setDirection(newYear > getYear(currentMonth) ? 1 : -1)
    setCurrentMonth(setYear(currentMonth, newYear))
  }

  const handlePrevMonth = () => {
    setDirection(-1)
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setDirection(1)
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDayClick = (day: Date) => {
    if (onSelect) {
      onSelect(day)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  }

  return (
    <div className={cn("p-3 bg-white rounded-md w-[320px]", className)}>
      <div className="flex items-center justify-between mb-4 space-x-2">
        <div className="flex items-center space-x-1">
           <SelectRoot value={months[getMonth(currentMonth)]} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[110px] h-8 border-none shadow-none font-semibold text-gray-900 hover:bg-[#2DD4BF]/10 focus:ring-0 px-2 transition-colors rounded-md">
              <SelectValue>{months[getMonth(currentMonth)]}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {months.map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          <SelectRoot value={getYear(currentMonth).toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[75px] h-8 border-none shadow-none font-semibold text-gray-900 hover:bg-[#2DD4BF]/10 focus:ring-0 px-2 transition-colors rounded-md">
              <SelectValue>{getYear(currentMonth)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </div>
        <div className="flex items-center space-x-1">
            <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-[#2DD4BF]/10 rounded-full text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
                type="button"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-[#2DD4BF]/10 rounded-full text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
                type="button"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-400 py-1 w-9">
            {day}
          </div>
        ))}
      </div>

      <div className="relative h-[240px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentMonth.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="grid grid-cols-7 gap-1 w-full"
          >
            {days.map((day, dayIdx) => {
                const isSelected = selected ? isSameDay(day, selected) : false
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isTodayDate = isToday(day)

                return (
                    <button
                        key={day.toString()}
                        onClick={() => handleDayClick(day)}
                        type="button"
                        className={cn(
                            "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] focus-visible:ring-offset-1",
                            !isCurrentMonth && "text-gray-300",
                            isCurrentMonth && !isSelected && "text-gray-900 hover:bg-[#2DD4BF]/10",
                            isSelected && "bg-[#2DD4BF] text-white hover:bg-[#26b8a5] shadow-sm font-medium",
                            isTodayDate && !isSelected && "bg-gray-100 font-semibold text-gray-900"
                        )}
                    >
                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                            {format(day, 'd')}
                        </time>
                    </button>
                )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
