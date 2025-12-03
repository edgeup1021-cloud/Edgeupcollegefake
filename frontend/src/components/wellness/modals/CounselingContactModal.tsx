"use client";

import { X, Phone, MapPin, Clock, Envelope } from "@phosphor-icons/react";

interface CounselingContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CounselingContactModal({ isOpen, onClose }: CounselingContactModalProps) {
  if (!isOpen) return null;

  const contactInfo = {
    phone: "(555) 123-4567",
    email: "counseling@edgeupcollege.edu",
    location: "Student Services Building, Room 204",
    hours: [
      { days: "Monday - Friday", times: "9:00 AM - 5:00 PM" },
      { days: "Saturday", times: "10:00 AM - 2:00 PM" },
      { days: "Sunday", times: "Closed" },
    ],
    afterHours: "9820466726 (AASRA 24/7) or 1860 2662 345 (Vandrevala Foundation)",
  };

  const handleCall = () => {
    window.open(`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`, "_blank");
  };

  const handleEmail = () => {
    window.open(`mailto:${contactInfo.email}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full pointer-events-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" weight="duotone" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Campus Counseling Center
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Professional support for students
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Contact Methods */}
            <div className="space-y-3">
              {/* Phone */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Phone
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 font-mono font-semibold mb-2">
                      {contactInfo.phone}
                    </p>
                    <button
                      onClick={handleCall}
                      className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Envelope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <p className="text-emerald-700 dark:text-emerald-300 font-mono text-sm mb-2">
                      {contactInfo.email}
                    </p>
                    <button
                      onClick={handleEmail}
                      className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600">
                  <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-300" weight="duotone" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Location
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contactInfo.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" weight="duotone" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Office Hours
                  </h3>
                  <div className="space-y-1">
                    {contactInfo.hours.map((schedule) => (
                      <div key={schedule.days} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {schedule.days}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {schedule.times}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* After Hours */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">After Hours Crisis Support:</span>
                  <br />
                  Call or Text {contactInfo.afterHours}
                </p>
              </div>
            </div>

            {/* Services Info */}
            <div className="p-4 rounded-lg bg-brand-light/50 dark:bg-brand-primary/10 border border-brand-primary/20">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Services Offered
              </h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  Individual counseling sessions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  Group therapy and workshops
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  Crisis intervention and support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  Referrals to external specialists
                </li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Confidential Services:</span> All counseling sessions are private and confidential under HIPAA regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
