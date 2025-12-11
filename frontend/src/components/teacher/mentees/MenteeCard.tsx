"use client";

import Link from "next/link";
import { User, TrendUp, CalendarCheck } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Mentee } from "@/types/mentorship.types";

interface MenteeCardProps {
  mentee: Mentee;
  cgpa?: number | null;
  attendance?: number | null;
}

export function MenteeCard({ mentee, cgpa, attendance }: MenteeCardProps) {
  return (
    <Link href={`/teacher/mentees/${mentee.id}`}>
      <Card className="hover:border-brand-primary transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
              {mentee.profileImage ? (
                <img
                  src={mentee.profileImage}
                  alt={`${mentee.firstName} ${mentee.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-brand-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {mentee.firstName} {mentee.lastName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mentee.admissionNo}
              </p>
            </div>
          </div>

          {/* Program Info */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mentee.program || "N/A"} {mentee.batch ? `• ${mentee.batch}` : ""}
            </p>
            {mentee.section && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Section: {mentee.section}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            {/* CGPA */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <TrendUp className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  CGPA
                </span>
              </div>
              <p className="text-lg font-bold text-brand-primary">
                {cgpa !== null && cgpa !== undefined ? cgpa.toFixed(2) : "N/A"}
              </p>
              <p className="text-xs text-gray-500">/10.0</p>
            </div>

            {/* Attendance */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <CalendarCheck className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Attendance
                </span>
              </div>
              <p className="text-lg font-bold text-green-600">
                {attendance !== undefined ? `${attendance}%` : "N/A"}
              </p>
              <p className="text-xs text-gray-500">present</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-3 flex items-center justify-between">
            <Badge variant={mentee.status === "active" ? "default" : "secondary"}>
              {mentee.status}
            </Badge>
            <span className="text-xs text-gray-400">
              {new Date(mentee.assignedDate).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
