import { z } from "zod";

export const leaveApplicationSchema = z.object({
  leaveType: z.enum(["sick", "casual", "emergency", "other"], {
    required_error: "Please select a leave type",
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason must not exceed 500 characters"),
  supportingDocuments: z.any().optional(),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be on or after start date",
  path: ["endDate"],
});

export type LeaveApplicationFormData = z.infer<typeof leaveApplicationSchema>;
