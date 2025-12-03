import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import type { LeaveApplication } from "@/types/student-attendance.types";

interface LeaveApplicationsListProps {
  applications: LeaveApplication[];
}

export function LeaveApplicationsList({
  applications,
}: LeaveApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No leave applications yet
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "sick":
        return "Sick Leave";
      case "casual":
        return "Casual Leave";
      case "emergency":
        return "Emergency Leave";
      case "other":
        return "Other";
      default:
        return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="p-4 border rounded-lg dark:border-gray-700 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">{getStatusIcon(application.status)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold">
                    {getLeaveTypeLabel(application.leaveType)}
                  </h4>
                  {getStatusBadge(application.status)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(application.startDate)} -{" "}
                  {formatDate(application.endDate)}
                </p>
                <p className="text-sm mt-2">{application.reason}</p>

                {/* Supporting Documents */}
                {application.supportingDocuments &&
                  application.supportingDocuments.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {application.supportingDocuments.length} document(s)
                        attached
                      </span>
                    </div>
                  )}

                {/* Review Comments */}
                {application.reviewComments && (
                  <div className="mt-3 p-2 bg-muted rounded text-sm">
                    <p className="font-medium text-xs text-muted-foreground mb-1">
                      Review Comments:
                    </p>
                    <p>{application.reviewComments}</p>
                    {application.reviewedBy && (
                      <p className="text-xs text-muted-foreground mt-1">
                        - {application.reviewedBy} on{" "}
                        {application.reviewedOn &&
                          formatDate(application.reviewedOn)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Applied on</p>
              <p>{formatDate(application.appliedOn)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
