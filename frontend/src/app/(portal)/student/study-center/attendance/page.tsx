"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./components/OverviewTab";
import { ApplyLeaveTab } from "./components/ApplyLeaveTab";
import { HistoryTab } from "./components/HistoryTab";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground mt-1">
          Track your attendance, apply for leave, and view history
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="apply-leave">Apply Leave</TabsTrigger> */}
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="apply-leave" className="space-y-6">
          <ApplyLeaveTab />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
