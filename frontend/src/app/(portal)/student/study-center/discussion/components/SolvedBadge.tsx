"use client";

import { CheckCircle } from "lucide-react";

export default function SolvedBadge() {
  return (
    <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-2.5 py-1 text-xs font-medium">
      <CheckCircle className="w-4 h-4" />
      Solved
    </span>
  );
}
