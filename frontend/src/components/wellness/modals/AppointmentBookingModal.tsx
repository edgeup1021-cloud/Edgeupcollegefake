"use client";

import { useState } from "react";
import { X, CalendarPlus, Check } from "@phosphor-icons/react";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook?: (appointment: {
    date: string;
    timeSlot: string;
    reason: string;
    urgent: boolean;
  }) => void;
}

export default function AppointmentBookingModal({ isOpen, onClose, onBook }: AppointmentBookingModalProps) {
  const [step, setStep] = useState<"select-date" | "select-time" | "details" | "success">("select-date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState("");
  const [urgent, setUrgent] = useState(false);

  if (!isOpen) return null;

  // Generate next 2 weeks of dates (Mon-Fri only)
  const generateAvailableDates = () => {
    const dates: Date[] = [];
    const start = addDays(new Date(), 1); // Start from tomorrow

    for (let i = 0; i < 14; i++) {
      const date = addDays(start, i);
      const dayOfWeek = date.getDay();
      // Only weekdays (1-5)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Time slots (9 AM - 5 PM)
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      onBook?.({
        date: selectedDate.toISOString(),
        timeSlot: selectedTime,
        reason,
        urgent,
      });
      setStep("success");
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("select-date");
      setSelectedDate(null);
      setSelectedTime("");
      setReason("");
      setUrgent(false);
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full pointer-events-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {step === "success" ? (
            /* Success State */
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6">
                <Check className="w-10 h-10" weight="bold" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Appointment Booked!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedDate && format(selectedDate, "EEEE, MMMM d")} at {selectedTime}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You'll receive a confirmation email shortly
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10">
                    <CalendarPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" weight="duotone" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                    Book Counseling Appointment
                  </h2>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mt-4">
                  {["select-date", "select-time", "details"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step === s
                          ? "bg-brand-primary text-white"
                          : ["select-date", "select-time", "details"].indexOf(step) > i
                          ? "bg-brand-secondary text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}>
                        {i + 1}
                      </div>
                      {i < 2 && (
                        <div className={`w-12 h-0.5 ${
                          ["select-date", "select-time", "details"].indexOf(step) > i
                            ? "bg-brand-secondary"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === "select-date" && (
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                      Select a Date
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {availableDates.map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => {
                            setSelectedDate(date);
                            setStep("select-time");
                          }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedDate?.toDateString() === date.toDateString()
                              ? "border-brand-primary bg-brand-primary/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-brand-primary/50"
                          }`}
                        >
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {format(date, "EEE")}
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {format(date, "MMM d")}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === "select-time" && (
                  <div>
                    <button
                      onClick={() => setStep("select-date")}
                      className="text-sm text-brand-primary hover:underline mb-4"
                    >
                      ← Change Date
                    </button>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      Select a Time
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setStep("details");
                          }}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            selectedTime === time
                              ? "border-brand-primary bg-brand-primary/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-brand-primary/50"
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {time}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === "details" && (
                  <div>
                    <button
                      onClick={() => setStep("select-time")}
                      className="text-sm text-brand-primary hover:underline mb-4"
                    >
                      ← Change Time
                    </button>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                      Appointment Details
                    </h3>

                    {/* Summary */}
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        <span className="font-semibold">Date:</span> {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                        <br />
                        <span className="font-semibold">Time:</span> {selectedTime}
                      </p>
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Reason for Visit <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="What would you like to discuss?"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                        maxLength={200}
                      />
                    </div>

                    {/* Urgent Checkbox */}
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer mb-6">
                      <input
                        type="checkbox"
                        checked={urgent}
                        onChange={(e) => setUrgent(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Mark as urgent (we'll prioritize your appointment)
                      </span>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBook}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-medium transition-all"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
