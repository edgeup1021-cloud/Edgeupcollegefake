import { z } from "zod";

export const createCourseOfferingSchema = z.object({
  subCode: z.string().min(1, "Subject code required").max(20),
  subTitle: z.string().min(1, "Subject title required").max(255),
  semester: z.string().min(1, "Semester required"),
  year: z.number().min(2024).max(2030),
  department: z.string().min(1, "Department required"),
  section: z.string().min(1, "Section required"),
  batch: z.string().min(1, "Batch required"),
  sessionDays: z.array(z.string()).min(1, "Select at least one day"),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  room: z.string().min(1, "Room number required"),
  sessionType: z.enum(["Lecture", "Lab", "Tutorial"]),
  semesterStartDate: z.string().min(1, "Start date required"),
  semesterEndDate: z.string().min(1, "End date required"),
}).refine(data => new Date(data.semesterEndDate) > new Date(data.semesterStartDate), {
  message: "End date must be after start date",
  path: ["semesterEndDate"],
}).refine(data => {
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type CreateCourseOfferingFormData = z.infer<typeof createCourseOfferingSchema>;
