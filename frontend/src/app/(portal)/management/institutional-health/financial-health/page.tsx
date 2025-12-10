"use client";

import { DollarSign } from "lucide-react";
import PlaceholderPage from "@/components/management/PlaceholderPage";

export default function FinancialHealthPage() {
  return (
    <PlaceholderPage
      icon={DollarSign}
      title="Financial Health"
      description="Monitor institutional financial health, budget utilization, and revenue streams."
    />
  );
}
