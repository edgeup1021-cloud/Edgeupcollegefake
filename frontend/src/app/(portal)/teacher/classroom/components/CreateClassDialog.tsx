import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Calendar } from 'lucide-react';
import { createCourseOfferingSchema, type CreateCourseOfferingFormData } from '@/lib/validations/class-operations';
import { createCourseOffering } from '@/services/class-operations.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { DaySelector } from './DaySelector';
import { PROGRAMS, SECTIONS, BATCHES } from '@/config/dropdowns.config';
import { useAuth } from '@/contexts/AuthContext';

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateClassDialog({ open, onOpenChange, onSuccess }: CreateClassDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CreateCourseOfferingFormData>({
    resolver: zodResolver(createCourseOfferingSchema),
    defaultValues: {
      subCode: '',
      subTitle: '',
      semester: '',
      year: new Date().getFullYear(),
      department: '',
      section: '',
      batch: '',
      sessionDays: [],
      startTime: '09:00',
      endTime: '10:00',
      room: '',
      sessionType: 'Lecture',
      semesterStartDate: '',
      semesterEndDate: '',
    }
  });

  const sessionDays = watch('sessionDays');
  const semesterStartDate = watch('semesterStartDate');
  const semesterEndDate = watch('semesterEndDate');

  // Calculate number of sessions
  const sessionCount = useMemo(() => {
    if (!semesterStartDate || !semesterEndDate || sessionDays.length === 0) return 0;

    const start = new Date(semesterStartDate);
    const end = new Date(semesterEndDate);
    let count = 0;
    let current = new Date(start);

    while (current <= end) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      if (sessionDays.includes(dayName)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }, [sessionDays, semesterStartDate, semesterEndDate]);

  const onSubmit = async (data: CreateCourseOfferingFormData) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await createCourseOffering(data, user.id);
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              {error}
            </Alert>
          )}

          {/* Section 1: Subject Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Subject Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject Code <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('subCode')}
                  type="text"
                  placeholder="e.g., CS101"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.subCode && (
                  <p className="text-sm text-destructive mt-1">{errors.subCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject Title <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('subTitle')}
                  type="text"
                  placeholder="e.g., Introduction to Programming"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.subTitle && (
                  <p className="text-sm text-destructive mt-1">{errors.subTitle.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Semester <span className="text-destructive">*</span>
                </label>
                <select
                  {...register('semester')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">Select Semester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Year <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('year', { valueAsNumber: true })}
                  type="number"
                  placeholder="2025"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.year && (
                  <p className="text-sm text-destructive mt-1">{errors.year.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Department <span className="text-destructive">*</span>
                </label>
                <select
                  {...register('department')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">Select Department</option>
                  {PROGRAMS.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-sm text-destructive mt-1">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Section <span className="text-destructive">*</span>
                </label>
                <select
                  {...register('section')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">Select Section</option>
                  {SECTIONS.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
                {errors.section && (
                  <p className="text-sm text-destructive mt-1">{errors.section.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Batch <span className="text-destructive">*</span>
                </label>
                <select
                  {...register('batch')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">Select Batch</option>
                  {BATCHES.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
                {errors.batch && (
                  <p className="text-sm text-destructive mt-1">{errors.batch.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Schedule */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Schedule
            </h3>

            <DaySelector
              value={sessionDays}
              onChange={(days) => setValue('sessionDays', days, { shouldValidate: true })}
              error={errors.sessionDays?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('startTime')}
                  type="time"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive mt-1">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('endTime')}
                  type="time"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.endTime && (
                  <p className="text-sm text-destructive mt-1">{errors.endTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Number <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('room')}
                  type="text"
                  placeholder="Room 201"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.room && (
                  <p className="text-sm text-destructive mt-1">{errors.room.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Session Type <span className="text-destructive">*</span>
                </label>
                <select
                  {...register('sessionType')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Semester Duration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Semester Duration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('semesterStartDate')}
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.semesterStartDate && (
                  <p className="text-sm text-destructive mt-1">{errors.semesterStartDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('semesterEndDate')}
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errors.semesterEndDate && (
                  <p className="text-sm text-destructive mt-1">{errors.semesterEndDate.message}</p>
                )}
              </div>
            </div>

            {sessionCount > 0 && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{sessionCount} sessions will be created</span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
