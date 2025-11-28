"use client";

import { Calendar, Clock, MapPin, CaretRight } from "@phosphor-icons/react";

interface ScheduleItem {
  time: string;
  period: "AM" | "PM";
  title: string;
  type: "Lecture" | "Lab" | "Tutorial";
  duration: string;
  room: string;
}

interface ScheduleCardProps {
  date: string;
  items: ScheduleItem[];
}

export default function ScheduleCard({ date, items }: ScheduleCardProps) {
  const typeColors = {
    Lecture: {
      bg: "bg-brand-primary",
      light: "bg-brand-primary/10",
      text: "text-brand-primary",
      border: "border-brand-primary/30",
    },
    Lab: {
      bg: "bg-brand-secondary",
      light: "bg-brand-secondary/10",
      text: "text-brand-secondary",
      border: "border-brand-secondary/30",
    },
    Tutorial: {
      bg: "bg-amber-500",
      light: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/30",
    },
  };

  return (
    <div className="col-span-full md:col-span-2 row-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brand-secondary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10">
            <Calendar className="w-5 h-5 text-brand-secondary" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Today's Schedule
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-brand-secondary bg-brand-secondary/10 px-3 py-1 rounded-full">
          {items.length} classes
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[30px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-primary/20 via-brand-secondary/20 to-transparent" />

        {/* Schedule items */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const colors = typeColors[item.type];
            return (
              <div
                key={index}
                className={`relative flex gap-4 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 cursor-pointer group`}
              >
                {/* Timeline dot */}
                <div className="absolute left-[26px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-800 border-2 border-brand-primary z-10" />

                {/* Time badge */}
                <div className={`${colors.bg} text-white rounded-xl px-3 py-2 text-center min-w-[60px] shadow-sm`}>
                  <div className="text-xl font-bold font-display leading-tight">{item.time}</div>
                  <div className="text-[10px] font-medium opacity-80 uppercase tracking-wide">{item.period}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${colors.light} ${colors.text}`}>
                      {item.type}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" weight="fill" />
                      {item.duration}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5" weight="fill" />
                      {item.room}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <CaretRight className="w-5 h-5 text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" weight="bold" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No classes scheduled for today</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Enjoy your day off!</p>
        </div>
      )}
    </div>
  );
}
