import React from 'react';
import { Calendar, Clock, MapPin, CheckSquare, CheckCircle2, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CourseOffering } from '@/types/class-operations.types';

interface ClassCardProps {
  offering: CourseOffering;
  onMarkAttendance: (sessionId: number) => void;
}

export function ClassCard({ offering, onMarkAttendance }: ClassCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg">
          {offering.course.code} - {offering.course.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {offering.semester} {offering.year}, Section {offering.section}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Days */}
        {offering.sessionDays && offering.sessionDays.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {offering.sessionDays.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Next Session */}
        {offering.nextSession && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                Next: {formatDate(offering.nextSession.date)} at {offering.nextSession.time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{offering.room}</span>
            </div>

            {/* Attendance Status */}
            {offering.nextSession.attendanceMarked && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Attendance Marked
                  </Badge>
                </div>
                {offering.nextSession.attendanceStats && (
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="flex flex-col items-center p-2 rounded bg-green-50 dark:bg-green-900/20">
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        {offering.nextSession.attendanceStats.present}
                      </span>
                      <span className="text-muted-foreground">Present</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded bg-red-50 dark:bg-red-900/20">
                      <span className="font-semibold text-red-700 dark:text-red-400">
                        {offering.nextSession.attendanceStats.absent}
                      </span>
                      <span className="text-muted-foreground">Absent</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
                      <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                        {offering.nextSession.attendanceStats.late}
                      </span>
                      <span className="text-muted-foreground">Late</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {offering.nextSession.attendanceStats.excused}
                      </span>
                      <span className="text-muted-foreground">Excused</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => offering.nextSession && onMarkAttendance(offering.nextSession.id)}
          className="w-full"
          disabled={!offering.nextSession}
          variant={offering.nextSession?.attendanceMarked ? "outline" : "default"}
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          {offering.nextSession?.attendanceMarked ? "View/Edit Attendance" : "Mark Attendance"}
        </Button>
      </CardFooter>
    </Card>
  );
}
