"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  TrendUp,
  CalendarCheck,
  Books,
  FileText,
  ClipboardText,
  Exam,
  UserMinus,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenteeStatsCard } from "@/components/teacher/mentees/MenteeStatsCard";
import { RecentGradesTable } from "@/components/teacher/mentees/RecentGradesTable";
import { RecentAttendanceTable } from "@/components/teacher/mentees/RecentAttendanceTable";
import { MenteeNotesEditor } from "@/components/teacher/mentees/MenteeNotesEditor";
import * as mentorshipService from "@/services/mentorship.service";
import * as authService from "@/services/auth.service";
import type { MenteeDetails } from "@/types/mentorship.types";

export default function MenteeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [menteeDetails, setMenteeDetails] = useState<MenteeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [teacherId, setTeacherId] = useState<number | null>(null);

  const { id } = use(params);
  const menteeId = parseInt(id);

  useEffect(() => {
    loadTeacherProfile();
  }, []);

  useEffect(() => {
    if (teacherId) {
      loadMenteeDetails();
    }
  }, [menteeId, teacherId]);

  const loadTeacherProfile = async () => {
    try {
      const user = await authService.getProfile();
      setTeacherId(user.id);
    } catch (error) {
      console.error("Failed to load teacher profile:", error);
      setIsLoading(false);
    }
  };

  const loadMenteeDetails = async () => {
    if (!teacherId) return;

    setIsLoading(true);
    try {
      const data = await mentorshipService.getMenteeDetails(menteeId, teacherId);
      setMenteeDetails(data);
    } catch (error) {
      console.error("Failed to load mentee details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async (notes: string) => {
    if (!teacherId) return;

    try {
      await mentorshipService.updateMentorship(menteeId, teacherId, { notes });
      await loadMenteeDetails();
    } catch (error) {
      console.error("Failed to save notes:", error);
      throw error;
    }
  };

  const handleRemoveMentee = async () => {
    if (!teacherId) return;

    if (!confirm("Are you sure you want to remove this mentee? This action can be reversed later.")) {
      return;
    }

    setIsRemoving(true);
    try {
      await mentorshipService.removeMentee(menteeId, teacherId);
      router.push("/teacher/mentees");
    } catch (error) {
      console.error("Failed to remove mentee:", error);
      setIsRemoving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading mentee details...</p>
        </div>
      </div>
    );
  }

  if (!menteeDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
        <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Mentee not found
        </h3>
        <Button onClick={() => router.push("/teacher/mentees")}>
          Back to Mentees
        </Button>
      </div>
    );
  }

  const { studentInfo, mentorshipInfo, academicStats, recentPerformance } = menteeDetails;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/teacher/mentees")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center">
              {studentInfo.profileImage ? (
                <img
                  src={studentInfo.profileImage}
                  alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-brand-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {studentInfo.firstName} {studentInfo.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {studentInfo.admissionNo}
                </p>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {studentInfo.program} {studentInfo.batch}
                </p>
                {studentInfo.section && (
                  <>
                    <span className="text-gray-400">•</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Section {studentInfo.section}
                    </p>
                  </>
                )}
                <Badge variant={studentInfo.status === "active" ? "default" : "secondary"}>
                  {studentInfo.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
          onClick={handleRemoveMentee}
          disabled={isRemoving}
        >
          <UserMinus className="w-5 h-5" />
          {isRemoving ? "Removing..." : "Remove Mentee"}
        </Button>
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-6 gap-4 flex-shrink-0">
        <MenteeStatsCard
          icon={TrendUp}
          label="CGPA"
          value={academicStats.currentCGPA !== null ? academicStats.currentCGPA.toFixed(2) : "N/A"}
          subtext="out of 10.0"
          color="bg-brand-primary/10 text-brand-primary"
        />
        <MenteeStatsCard
          icon={CalendarCheck}
          label="Attendance"
          value={`${academicStats.attendancePercentage}%`}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <MenteeStatsCard
          icon={Books}
          label="Courses"
          value={academicStats.totalCoursesEnrolled}
          subtext="enrolled"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <MenteeStatsCard
          icon={FileText}
          label="Completed"
          value={academicStats.completedAssignments}
          subtext="assignments"
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <MenteeStatsCard
          icon={ClipboardText}
          label="Pending"
          value={academicStats.pendingAssignments}
          subtext="assignments"
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        />
        <MenteeStatsCard
          icon={Exam}
          label="Upcoming"
          value={academicStats.upcomingExams}
          subtext="exams"
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {/* Recent Grades */}
          <div className="col-span-2">
            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Grades (Last 10)
                </h3>
                <RecentGradesTable grades={recentPerformance.recentGrades} />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm mt-4">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Attendance (Last 15)
                </h3>
                <RecentAttendanceTable attendance={recentPerformance.recentAttendance} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Mentorship Info */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Mentorship Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Assigned Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(mentorshipInfo.assignedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <Badge variant={mentorshipInfo.status === "active" ? "default" : "secondary"}>
                      {mentorshipInfo.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Contact Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block mb-1">Email</span>
                    <a
                      href={`mailto:${studentInfo.email}`}
                      className="font-medium text-brand-primary hover:underline"
                    >
                      {studentInfo.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardContent className="p-4">
                <MenteeNotesEditor
                  initialNotes={mentorshipInfo.notes}
                  onSave={handleSaveNotes}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
