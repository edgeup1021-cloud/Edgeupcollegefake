"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calendarService, type CalendarEvent as BackendCalendarEvent } from "@/services/calendar.service"
import { useAuth } from "@/hooks/useAuth"

interface FrontendCalendarEvent {
  id: string | number
  title: string
  date: Date
  startTime: string
  endTime: string
  color: string
  description?: string
  type?: string
  subject?: string
  backendId?: number
}

const colorMap: Record<string, string> = {
  class: "bg-blue-500",
  test: "bg-red-500",
  assignment: "bg-purple-500",
  holiday: "bg-yellow-500",
  meeting: "bg-green-500",
  fair: "bg-indigo-500",
}

const eventTypeMap: Record<string, "class" | "test" | "assignment" | "holiday" | "meeting" | "fair"> = {
  "class": "class",
  "test": "test",
  "assignment": "assignment",
  "holiday": "holiday",
  "meeting": "meeting",
  "fair": "fair",
}

export default function TimeTablePage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = React.useState(new Date(2025, 11, 1))
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [showAddEventModal, setShowAddEventModal] = React.useState(false)
  const [events, setEvents] = React.useState<FrontendCalendarEvent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const [formData, setFormData] = React.useState({
    title: "",
    type: "class" as "class" | "test" | "assignment" | "holiday" | "meeting" | "fair",
    time: "",
    subject: "",
    description: ""
  })

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Convert backend event to frontend format
  const convertBackendEvent = (event: BackendCalendarEvent): FrontendCalendarEvent => {
    const [year, month, day] = event.eventDate.split("-").map(Number)
    const eventDate = new Date(year, month - 1, day)
    const startTime = event.eventTime || "10:00"
    const endHour = parseInt(startTime.split(":")[0]) + 1
    const endTime = `${endHour}:${startTime.split(":")[1]}`

    return {
      id: event.id,
      backendId: event.id,
      title: event.title,
      date: eventDate,
      startTime,
      endTime,
      color: colorMap[event.eventType] || "bg-blue-500",
      description: event.description,
      type: event.eventType,
      subject: event.subject,
    }
  }

  // Fetch events for current month
  const fetchEventsForMonth = React.useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)
      const month = currentDate.getMonth() + 1
      const year = currentDate.getFullYear()
      const backendEvents = await calendarService.getEventsByMonth(year, month, user.id)
      const frontendEvents = backendEvents.map(convertBackendEvent)
      setEvents(frontendEvents)
    } catch (err) {
      console.error("Failed to fetch events:", err)
      setError("Failed to load calendar events")
    } finally {
      setLoading(false)
    }
  }, [currentDate, user?.id])

  // Fetch events when month changes or user changes
  React.useEffect(() => {
    fetchEventsForMonth()
  }, [fetchEventsForMonth])

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const calendarDays: (number | null)[] = Array(firstDay).fill(null)

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const getEventsForDate = (day: number) => {
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter(event =>
      event.date.toDateString() === dateObj.toDateString()
    )
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate.getDate()) : []

  const handleAddEvent = async () => {
    if (!formData.title.trim() || !selectedDate || !user?.id) {
      alert("Please enter an event title and select a date")
      return
    }

    try {
      setSubmitting(true)
      const eventDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

      const createDto: Parameters<typeof calendarService.createEvent>[0] = {
        studentId: user.id,
        title: formData.title,
        eventType: formData.type,
        eventDate,
        eventTime: formData.time || undefined,
        subject: formData.subject || undefined,
        description: formData.description || undefined,
      }

      const createdEvent = await calendarService.createEvent(createDto)
      const frontendEvent = convertBackendEvent(createdEvent)
      setEvents([...events, frontendEvent])
      setFormData({ title: "", type: "class", time: "", subject: "", description: "" })
      setShowAddEventModal(false)
    } catch (err) {
      console.error("Failed to create event:", err)
      alert("Failed to create event. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenAddEventModal = () => {
    if (!selectedDate) {
      alert("Please select a date first")
      return
    }
    setShowAddEventModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {monthName}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevMonth}
                      className="h-9 w-9"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextMonth}
                      className="h-9 w-9"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-700">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div
                    key={day}
                    className="p-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-300"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 p-px">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (day) {
                        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                      }
                    }}
                    className={`aspect-square bg-white dark:bg-gray-800 p-2 cursor-pointer transition-colors \${
                      day === null ? "cursor-default" : "hover:bg-blue-50 dark:hover:bg-gray-700"
                    } \${isToday(day!) ? "border-2 border-blue-500" : ""} \${
                      isSelected(day!) ? "bg-blue-100 dark:bg-blue-900/30" : ""
                    }`}
                  >
                    {day && (
                      <div className="flex flex-col h-full">
                        <span className={`text-sm font-medium \${
                          isToday(day) ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {day}
                        </span>
                        <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                          {getEventsForDate(day).slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`\${event.color} text-white text-xs px-1.5 py-0.5 rounded truncate`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {getEventsForDate(day).length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                              +{getEventsForDate(day).length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Day Events */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })
                    : "Select a date"}
                </h3>
              </div>

              <div className="p-6">
                {selectedDate && selectedDayEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`${event.color} text-white rounded-lg p-4 space-y-2`}
                      >
                        <div className="font-semibold text-sm">{event.title}</div>
                        <div className="text-sm opacity-90">
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.subject && (
                          <div className="text-sm opacity-80">Subject: {event.subject}</div>
                        )}
                        {event.description && (
                          <div className="text-sm opacity-80">{event.description}</div>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={handleOpenAddEventModal}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                ) : selectedDate ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No classes scheduled</p>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleOpenAddEventModal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Select a date to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Event</h2>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-96 overflow-y-auto">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitting}
                >
                  <option value="class">Class</option>
                  <option value="test">Test</option>
                  <option value="assignment">Assignment</option>
                  <option value="holiday">Holiday</option>
                  <option value="meeting">Meeting</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Time <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="time"
                  placeholder="e.g., 09:00 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Subject <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Description <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  placeholder="Enter event description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <Button
                variant="outline"
                onClick={() => setShowAddEventModal(false)}
                className="flex-1"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEvent}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Event"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
