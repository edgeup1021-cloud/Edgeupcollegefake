export interface StudentProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  program: string | null;
  batch: string | null;
  college: string | null;
  profileImage: string | null;
}

export interface AttendanceStatsDto {
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
}

export interface DailyGoalDto {
  current: number;
  target: number;
}

export interface TestsTodayDto {
  completed: number;
  total: number;
}

export interface StatsDto {
  attendance: AttendanceStatsDto;
  gpa: number | null;
  completedCourses: number;
  totalCredits: number;
  dailyGoal: DailyGoalDto;
  testsToday: TestsTodayDto;
  dayStreak: number;
}

export interface ScheduleItemDto {
  id: number;
  time: string;
  period: string;
  title: string;
  type: string;
  duration: string;
  room: string | null;
}

export interface DeadlineItemDto {
  id: number;
  title: string;
  type: string;
  dueDate: string;
  description: string | null;
  daysLeft: number;
  courseName: string;
}

export interface NotificationItemDto {
  id: number;
  title: string | null;
  type: string;
  createdAt: string;
}

export interface NotificationsDto {
  unreadCount: number;
  recent: NotificationItemDto[];
}

export interface StudentDashboardDto {
  profile: StudentProfileDto;
  stats: StatsDto;
  schedule: ScheduleItemDto[];
  deadlines: DeadlineItemDto[];
  notifications: NotificationsDto;
}
