import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DaySelectorProps {
  value: string[];
  onChange: (days: string[]) => void;
  error?: string;
}

const DAYS = [
  { value: "Mon", label: "Mon" },
  { value: "Tue", label: "Tue" },
  { value: "Wed", label: "Wed" },
  { value: "Thu", label: "Thu" },
  { value: "Fri", label: "Fri" },
  { value: "Sat", label: "Sat" },
  { value: "Sun", label: "Sun" },
];

export function DaySelector({ value, onChange, error }: DaySelectorProps) {
  const toggleDay = (day: string) => {
    if (value.includes(day)) {
      onChange(value.filter(d => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Days of Week</label>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => {
          const isSelected = value.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${isSelected
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-gray-800 dark:hover:bg-gray-700'
                }
              `}
            >
              {day.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
