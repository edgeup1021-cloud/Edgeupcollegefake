import { api } from "./api.client";

export interface CalendarEvent {
  id: number;
  studentId: number;
  title: string;
  eventType: "class" | "test" | "assignment" | "holiday" | "meeting" | "fair";
  eventDate: string;
  eventTime?: string;
  subject?: string;
  description?: string;
  color?: string;
}

export interface CreateCalendarEventDto {
  studentId: number;
  title: string;
  eventType: "class" | "test" | "assignment" | "holiday" | "meeting" | "fair";
  eventDate: string;
  eventTime?: string;
  subject?: string;
  description?: string;
  color?: string;
}

export interface UpdateCalendarEventDto {
  title?: string;
  eventType?: "class" | "test" | "assignment" | "holiday" | "meeting" | "fair";
  eventDate?: string;
  eventTime?: string;
  subject?: string;
  description?: string;
  color?: string;
}

export const calendarService = {
  // Create a new calendar event
  async createEvent(dto: CreateCalendarEventDto): Promise<CalendarEvent> {
    const response = await api.post<CalendarEvent>("/calendar/events", dto);
    return response;
  },

  // Get all events
  async getAllEvents(
    studentId?: number,
    eventType?: string,
    startDate?: string,
    endDate?: string
  ): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId.toString());
    if (eventType) params.append("eventType", eventType);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<CalendarEvent[]>(`/calendar/events${query}`);
    return response;
  },

  // Get single event
  async getEvent(id: number): Promise<CalendarEvent> {
    const response = await api.get<CalendarEvent>(`/calendar/events/${id}`);
    return response;
  },

  // Get events by date
  async getEventsByDate(date: string, studentId?: number): Promise<CalendarEvent[]> {
    const params = studentId ? `?studentId=${studentId}` : "";
    const response = await api.get<CalendarEvent[]>(
      `/calendar/events/date/${date}${params}`
    );
    return response;
  },

  // Get events by month
  async getEventsByMonth(
    year: number,
    month: number,
    studentId?: number
  ): Promise<CalendarEvent[]> {
    const params = studentId ? `?studentId=${studentId}` : "";
    const response = await api.get<CalendarEvent[]>(
      `/calendar/events/month/${year}/${month}${params}`
    );
    return response;
  },

  // Update event
  async updateEvent(id: number, dto: UpdateCalendarEventDto): Promise<CalendarEvent> {
    const response = await api.patch<CalendarEvent>(
      `/calendar/events/${id}`,
      dto
    );
    return response;
  },

  // Delete event
  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/calendar/events/${id}`);
  },
};
