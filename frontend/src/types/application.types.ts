export type ApplicationStatus =
  | 'applied'
  | 'in-progress'
  | 'offer-received'
  | 'interview-scheduled'
  | 'rejected'
  | 'not-applied';

export interface JobApplication {
  id: number;
  companyName: string;
  companyLogo?: string;
  position: string;
  applicationDate: string;
  status: ApplicationStatus;
  jobType?: string;
  location?: string;
  salary?: string;
  description?: string;
  jobUrl?: string;
  notes?: string;
}

export interface ApplicationStats {
  total: number;
  applied: number;
  inProgress: number;
  offerReceived: number;
  interviewScheduled: number;
  rejected: number;
}
