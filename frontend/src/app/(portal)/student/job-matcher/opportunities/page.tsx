"use client";

import dynamic from "next/dynamic";

// Dynamically load job-match page to avoid SSR issues
const JobMatchPage = dynamic(() => import("./job-match/page"), { ssr: false });

export default function OpportunitiesPage() {
  return <JobMatchPage />;
}