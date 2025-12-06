"use client";

import { Lifebuoy, Phone, ChatCircleDots, Warning, CalendarPlus } from "@phosphor-icons/react";

interface SOSSupportCardProps {
  onCallCounseling?: () => void;
  onBookAppointment?: () => void;
  onStartPeerChat?: () => void;
  onEmergencyResources?: () => void;
}

export default function SOSSupportCard({
  onCallCounseling,
  onBookAppointment,
  onStartPeerChat,
  onEmergencyResources,
}: SOSSupportCardProps) {
  return (
    <div className="col-span-full md:col-span-2 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-900/10 dark:via-orange-900/10 dark:to-amber-900/10 rounded-2xl p-6 shadow-sm border-2 border-orange-200/50 dark:border-orange-800/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-300/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <Lifebuoy className="w-6 h-6 text-orange-600 dark:text-orange-400" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white">
              Need Support?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help is available 24/7
            </p>
          </div>
        </div>

        {/* Support Options */}
        <div className="space-y-3">
          {/* Campus Counseling */}
          <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" weight="duotone" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Campus Counseling
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Available Mon-Fri, 9 AM - 5 PM
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={onCallCounseling}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200"
                  >
                    Call Now
                  </button>
                  <button
                    onClick={onBookAppointment}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <CalendarPlus className="w-4 h-4" weight="bold" />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Peer Support */}
          <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <ChatCircleDots className="w-5 h-5 text-emerald-600 dark:text-emerald-400" weight="duotone" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Anonymous Peer Chat
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Talk to fellow students in a safe space
                </p>
                <button
                  onClick={onStartPeerChat}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors duration-200"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>

          {/* Crisis Support */}
          <div className="p-4 rounded-xl bg-red-100/80 dark:bg-red-900/20 backdrop-blur-sm border-2 border-red-300 dark:border-red-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-200 dark:bg-red-900/50">
                <Warning className="w-5 h-5 text-red-700 dark:text-red-400" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                  Crisis Support
                </h3>
                <p className="text-sm text-red-800 dark:text-red-400 mb-2 font-medium">
                  AASRA 24/7: 9820466726
                  <br />
                  Vandrevala Foundation: 1860 2662 345
                </p>
                <button
                  onClick={onEmergencyResources}
                  className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-medium transition-colors duration-200"
                >
                  Emergency Resources
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 p-3 rounded-lg bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            All conversations are confidential and anonymous. Your privacy is our priority.
          </p>
        </div>

        {/* View All Resources Link */}
        <div className="mt-4 text-center">
          <a
            href="/student/wellness/support"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors group"
          >
            <span>View all support resources</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
