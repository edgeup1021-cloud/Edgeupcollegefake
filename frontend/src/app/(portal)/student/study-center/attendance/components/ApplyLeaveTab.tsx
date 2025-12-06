"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { LeaveApplicationsList } from "./LeaveApplicationsList";
import { leaveApplicationSchema, type LeaveApplicationFormData } from "@/lib/validations/student-attendance";
import { createLeaveApplication, getLeaveApplications } from "@/services/student-attendance.service";
import { useAuth } from "@/contexts/AuthContext";
import type { LeaveApplication } from "@/types/student-attendance.types";

export function ApplyLeaveTab() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeaveApplicationFormData>({
    resolver: zodResolver(leaveApplicationSchema),
    defaultValues: {
      leaveType: "sick",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (user?.id) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getLeaveApplications(user.id);
      setApplications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load leave applications");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: LeaveApplicationFormData) => {
    if (!user) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createLeaveApplication(user.id, {
        ...data,
        supportingDocuments: selectedFiles.length > 0 ? selectedFiles : undefined,
      });

      setSuccess(true);
      reset();
      setSelectedFiles([]);
      await loadApplications();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit leave application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Apply for Leave Form */}
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <Alert variant="destructive">{error}</Alert>}
            {success && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <p className="text-green-600 dark:text-green-400">
                  Leave application submitted successfully!
                </p>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Leave Type <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("leaveType")}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="other">Other</option>
                </select>
                {errors.leaveType && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.leaveType.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("startDate")}
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("endDate")}
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              {/* Supporting Documents */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Supporting Documents
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 border rounded-lg cursor-pointer hover:bg-muted dark:bg-gray-800 dark:border-gray-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedFiles.length > 0
                        ? `${selectedFiles.length} file(s) selected`
                        : "Choose files"}
                    </span>
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Reason <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register("reason")}
                rows={4}
                placeholder="Please provide a detailed reason for your leave request..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              />
              {errors.reason && (
                <p className="text-sm text-destructive mt-1">
                  {errors.reason.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Leave Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <LeaveApplicationsList applications={applications} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
