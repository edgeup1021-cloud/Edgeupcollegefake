import React from 'react';
import { Calendar, Clock, MapPin, CheckSquare } from 'lucide-react';
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

        {/* Next Session */}
        {offering.nextSession && (
          <div className="space-y-1">
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
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => offering.nextSession && onMarkAttendance(offering.nextSession.id)}
          className="w-full"
          disabled={!offering.nextSession}
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </CardFooter>
    </Card>
  );
}
