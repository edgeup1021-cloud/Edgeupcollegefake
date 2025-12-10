"use client";

import { UserCheck } from "lucide-react";
import PlaceholderPage from "@/components/management/PlaceholderPage";

export default function StudentRetentionPage() {
  return (
    <PlaceholderPage
      icon={UserCheck}
      title="Student Retention"
      description="Analyze retention patterns and identify at-risk students to improve graduation rates."
    />
  );
}
