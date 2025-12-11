"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, TrendUp, CalendarCheck, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenteeCard } from "@/components/teacher/mentees/MenteeCard";
import { AddMenteeDialog } from "@/components/teacher/mentees/AddMenteeDialog";
import { MenteeStatsCard } from "@/components/teacher/mentees/MenteeStatsCard";
import * as mentorshipService from "@/services/mentorship.service";
import * as authService from "@/services/auth.service";
import type { Mentee, AvailableStudent } from "@/types/mentorship.types";

export default function MenteesPage() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [teacherId, setTeacherId] = useState<number | null>(null);

  useEffect(() => {
    loadTeacherProfile();
  }, []);

  useEffect(() => {
    if (teacherId) {
      loadMentees();
    }
  }, [teacherId]);

  const loadTeacherProfile = async () => {
    try {
      const user = await authService.getProfile();
      setTeacherId(user.id);
    } catch (error) {
      console.error("Failed to load teacher profile:", error);
      setIsLoading(false);
    }
  };

  const loadMentees = async () => {
    if (!teacherId) return;

    setIsLoading(true);
    try {
      const data = await mentorshipService.getMentees(teacherId);
      setMentees(data);
    } catch (error) {
      console.error("Failed to load mentees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableStudents = async () => {
    if (!teacherId) return;

    try {
      const data = await mentorshipService.getAvailableStudents(teacherId);
      setAvailableStudents(data);
    } catch (error) {
      console.error("Failed to load available students:", error);
    }
  };

  const handleOpenDialog = async () => {
    await loadAvailableStudents();
    setIsDialogOpen(true);
  };

  const handleAssignMentees = async (studentIds: number[], notes?: string) => {
    if (!teacherId) return;

    try {
      await mentorshipService.bulkAssignMentees(teacherId, studentIds, notes);
      await loadMentees();
    } catch (error) {
      console.error("Failed to assign mentees:", error);
      throw error;
    }
  };

  // Calculate stats
  const totalMentees = mentees.length;
  const maxMentees = 20;

  // Calculate average CGPA from mentees with CGPA data
  const menteesWithCGPA = mentees.filter((m) => m.cgpa !== null && m.cgpa !== undefined);
  const avgCGPA = menteesWithCGPA.length > 0
    ? menteesWithCGPA.reduce((sum, m) => sum + (m.cgpa || 0), 0) / menteesWithCGPA.length
    : 0;

  // Calculate average attendance from mentees with attendance data
  const menteesWithAttendance = mentees.filter((m) => m.attendancePercentage !== null && m.attendancePercentage !== undefined);
  const avgAttendance = menteesWithAttendance.length > 0
    ? Math.round(menteesWithAttendance.reduce((sum, m) => sum + (m.attendancePercentage || 0), 0) / menteesWithAttendance.length)
    : 0;

  // Filter mentees
  const filteredMentees = mentees.filter((mentee) => {
    const matchesSearch =
      mentee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentee.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgram =
      filterProgram === "all" || mentee.program === filterProgram;

    return matchesSearch && matchesProgram;
  });

  // Get unique programs for filter
  const programs = Array.from(new Set(mentees.map((m) => m.program).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading mentees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 flex items-center justify-center">
            <Users className="w-7 h-7 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Mentees
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and track your mentee students
            </p>
          </div>
        </div>
        <Button
          onClick={handleOpenDialog}
          className="gap-2"
          disabled={totalMentees >= maxMentees}
        >
          <UserPlus className="w-5 h-5" />
          Add Mentees
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 flex-shrink-0">
        <MenteeStatsCard
          icon={Users}
          label="Total Mentees"
          value={`${totalMentees}/${maxMentees}`}
          subtext={`${maxMentees - totalMentees} slots available`}
          color="bg-brand-primary/10 text-brand-primary"
        />
        <MenteeStatsCard
          icon={TrendUp}
          label="Average CGPA"
          value={avgCGPA > 0 ? avgCGPA.toFixed(2) : "N/A"}
          subtext="out of 10.0"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <MenteeStatsCard
          icon={CalendarCheck}
          label="Average Attendance"
          value={avgAttendance > 0 ? `${avgAttendance}%` : "N/A"}
          subtext="across all mentees"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-shrink-0">
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search mentees by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium"
        >
          <option value="all">All Programs</option>
          {programs.map((program) => (
            <option key={program} value={program || ""}>
              {program}
            </option>
          ))}
        </select>
      </div>

      {/* Mentees Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredMentees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {mentees.length === 0 ? "No mentees assigned yet" : "No mentees found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
              {mentees.length === 0
                ? "Start by adding students as your mentees to track their academic progress and provide guidance."
                : "Try adjusting your search or filter criteria."}
            </p>
            {mentees.length === 0 && (
              <Button onClick={handleOpenDialog} className="gap-2">
                <UserPlus className="w-5 h-5" />
                Add Your First Mentee
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {filteredMentees.map((mentee) => (
              <MenteeCard
                key={mentee.id}
                mentee={mentee}
                cgpa={mentee.cgpa}
                attendance={mentee.attendancePercentage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Mentee Dialog */}
      <AddMenteeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        availableStudents={availableStudents}
        onAssign={handleAssignMentees}
        currentCount={totalMentees}
        maxCount={maxMentees}
      />
    </div>
  );
}
