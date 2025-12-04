import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AttendanceStatistics } from './AttendanceStatistics';
import { getAttendanceRoster, markAttendance } from '@/services/class-operations.service';
import type { AttendanceRosterResponse, AttendanceStatus } from '@/types/class-operations.types';

interface AttendanceMarkingDialogProps {
  open: boolean;
  sessionId: number | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface AttendanceRecord {
  status: AttendanceStatus;
  remarks: string;
}

export function AttendanceMarkingDialog({
  open,
  sessionId,
  onOpenChange,
  onSuccess
}: AttendanceMarkingDialogProps) {
  const [roster, setRoster] = useState<AttendanceRosterResponse | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Map<number, AttendanceRecord>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load attendance roster when dialog opens
  useEffect(() => {
    if (open && sessionId) {
      loadRoster();
    }
  }, [open, sessionId]);

  const loadRoster = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getAttendanceRoster(sessionId);
      setRoster(data);

      // Initialize attendance map with existing data
      const map = new Map<number, AttendanceRecord>();
      data.students.forEach(student => {
        if (student.status) {
          map.set(student.studentId, {
            status: student.status,
            remarks: student.remarks || ''
          });
        }
      });
      setAttendanceMap(map);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance roster');
    } finally {
      setLoading(false);
    }
  };

  // Calculate real-time statistics
  const statistics = useMemo(() => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: roster?.students.length || 0
    };

    attendanceMap.forEach(record => {
      if (record.status === 'present') stats.present++;
      else if (record.status === 'absent') stats.absent++;
      else if (record.status === 'late') stats.late++;
      else if (record.status === 'excused') stats.excused++;
    });

    return stats;
  }, [attendanceMap, roster]);

  // Filter students by search term
  const filteredStudents = useMemo(() => {
    if (!roster) return [];
    if (!searchTerm) return roster.students;

    const term = searchTerm.toLowerCase();
    return roster.students.filter(s =>
      s.firstName.toLowerCase().includes(term) ||
      s.lastName.toLowerCase().includes(term) ||
      s.admissionNo.toLowerCase().includes(term)
    );
  }, [roster, searchTerm]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    const newMap = new Map(attendanceMap);
    const existing = newMap.get(studentId) || { status: 'present', remarks: '' };
    newMap.set(studentId, { ...existing, status });
    setAttendanceMap(newMap);
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    const newMap = new Map(attendanceMap);
    const existing = newMap.get(studentId) || { status: 'present', remarks: '' };
    newMap.set(studentId, { ...existing, remarks });
    setAttendanceMap(newMap);
  };

  const markAllPresent = () => {
    const newMap = new Map(attendanceMap);
    roster?.students.forEach(student => {
      newMap.set(student.studentId, {
        status: 'present',
        remarks: newMap.get(student.studentId)?.remarks || ''
      });
    });
    setAttendanceMap(newMap);
  };

  const markAllAbsent = () => {
    const newMap = new Map(attendanceMap);
    roster?.students.forEach(student => {
      newMap.set(student.studentId, {
        status: 'absent',
        remarks: newMap.get(student.studentId)?.remarks || ''
      });
    });
    setAttendanceMap(newMap);
  };

  const handleSubmit = async () => {
    if (!sessionId || !roster) return;

    setSubmitting(true);
    setError(null);

    try {
      const records = Array.from(attendanceMap.entries()).map(([studentId, record]) => ({
        studentId,
        status: record.status,
        remarks: record.remarks || undefined
      }));

      await markAttendance(sessionId, records);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const markedCount = attendanceMap.size;
  const totalCount = roster?.students.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-full max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {roster ? `${roster.session.courseCode} - ${roster.session.courseTitle}` : 'Mark Attendance'}
          </DialogTitle>
          {roster && (
            <p className="text-sm text-muted-foreground">
              {roster.session.sessionDate} at {roster.session.startTime} • {roster.session.room}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">{error}</Alert>
          ) : success ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <CheckCircle className="w-16 h-16 text-green-600" />
              <p className="text-lg font-medium text-green-600">Attendance submitted successfully!</p>
            </div>
          ) : roster ? (
            <>
              {/* Statistics */}
              <AttendanceStatistics statistics={statistics} />

              {/* Search and Bulk Actions */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative flex-1 min-w-0 w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={markAllPresent}>
                    Mark All Present
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={markAllAbsent}>
                    Mark All Absent
                  </Button>
                </div>
              </div>

              {/* Student Table */}
              <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Admission No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted dark:divide-gray-700">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            No students found
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student, index) => {
                          const record = attendanceMap.get(student.studentId);
                          return (
                            <tr key={student.studentId} className="hover:bg-muted/50 dark:hover:bg-gray-800/50">
                              <td className="px-4 py-3 text-sm">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {student.admissionNo}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                {student.firstName} {student.lastName}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((status) => (
                                    <button
                                      key={status}
                                      type="button"
                                      onClick={() => handleStatusChange(student.studentId, status)}
                                      className={`
                                        px-3 py-1 rounded text-xs font-medium transition-all
                                        ${record?.status === status
                                          ? status === 'present' ? 'bg-green-600 text-white'
                                          : status === 'absent' ? 'bg-red-600 text-white'
                                          : status === 'late' ? 'bg-yellow-600 text-white'
                                          : 'bg-blue-600 text-white'
                                          : 'bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-gray-800 dark:hover:bg-gray-700'
                                        }
                                      `}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={record?.remarks || ''}
                                  onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                                  placeholder="Optional"
                                  className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter className="flex-shrink-0 flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            {markedCount} / {totalCount} students marked
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || markedCount === 0 || loading}
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Attendance
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
