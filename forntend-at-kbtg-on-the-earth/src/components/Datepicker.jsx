import React, { useEffect, useMemo, useRef, useState } from 'react'

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export default function Datepicker() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)

  const today = useMemo(() => new Date(), [])
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : ''

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const calendarDays = useMemo(() => {
    const days = []
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        otherMonth: true,
      })
    }

    const thisMonthDays = daysInMonth(currentYear, currentMonth)
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth, i), otherMonth: false })
    }

    const nextDays = 42 - days.length
    for (let i = 1; i <= nextDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth + 1, i), otherMonth: true })
    }

    return days
  }, [currentMonth, currentYear])

  const currentMonthName = useMemo(() => {
    return new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })
  }, [currentMonth, currentYear])

  const toggleCalendar = () => setShowCalendar((v) => !v)
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else setCurrentMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else setCurrentMonth((m) => m + 1)
  }

  const selectDate = (day) => {
    if (day.otherMonth) return
    setSelectedDate(day.date)
    setShowCalendar(false)
  }

  const isSelected = (day) => selectedDate && day.date.toDateString() === selectedDate.toDateString()

  const wrapperRef = useRef(null)
  useOnClickOutside(wrapperRef, () => setShowCalendar(false))

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={toggleCalendar}
        placeholder="Select date"
        className="w-40 p-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded">&lt;</button>
            <span className="font-medium">{currentMonthName} {currentYear}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded">&gt;</button>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {weekdays.map((d) => (
              <span key={d} className="font-semibold text-gray-700">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((day) => (
              <span
                key={day.date.toISOString()}
                onClick={() => selectDate(day)}
                className={
                  'p-2 cursor-pointer rounded-full ' +
                  (day.otherMonth ? 'text-gray-400 ' : '') +
                  (isSelected(day) ? 'bg-blue-500 text-white ' : '') +
                  (!day.otherMonth ? 'hover:bg-blue-100' : '')
                }
              >
                {day.date.getDate()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
