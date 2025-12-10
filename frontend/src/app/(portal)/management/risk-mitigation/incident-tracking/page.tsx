"use client";

import { AlertCircle } from "lucide-react";
import PlaceholderPage from "@/components/management/PlaceholderPage";

export default function IncidentTrackingPage() {
  return (
    <PlaceholderPage
      icon={AlertCircle}
      title="Incident Tracking"
      description="Track and manage incidents, safety reports, and compliance violations."
    />
  );
}
