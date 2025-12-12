export type PublicationStatus =
  | 'Published'
  | 'Under Review'
  | 'In Progress'
  | 'Rejected';

export interface Publication {
  id: number | string; // MySQL bigint serializes as string
  teacherId: number | string; // MySQL bigint serializes as string
  publicationTitle: string;
  journalConferenceName: string;
  publicationDate: string; // ISO date string YYYY-MM-DD
  status: PublicationStatus;
  coAuthors: string | null;
  publicationUrl: string | null;
  citationsCount: number;
  impactFactor: number | string | null; // MySQL DECIMAL serializes as string
  doi: string | null;
  isbnIssn: string | null;
  volumeNumber: string | null;
  issueNumber: string | null;
  pageNumbers: string | null;
  personalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePublicationInput {
  publicationTitle: string;
  journalConferenceName: string;
  publicationDate: string;
  status: PublicationStatus;
  coAuthors?: string;
  publicationUrl?: string;
  citationsCount?: number;
  impactFactor?: number;
  doi?: string;
  isbnIssn?: string;
  volumeNumber?: string;
  issueNumber?: string;
  pageNumbers?: string;
  personalNotes?: string;
}

export interface UpdatePublicationInput {
  publicationTitle?: string;
  journalConferenceName?: string;
  publicationDate?: string;
  status?: PublicationStatus;
  coAuthors?: string;
  publicationUrl?: string;
  citationsCount?: number;
  impactFactor?: number;
  doi?: string;
  isbnIssn?: string;
  volumeNumber?: string;
  issueNumber?: string;
  pageNumbers?: string;
  personalNotes?: string;
}

export interface PublicationFilters {
  status?: PublicationStatus;
  search?: string;
  year?: string;
  sortBy?: 'recent' | 'citations' | 'impact_factor';
  limit?: number;
  offset?: number;
}

export interface PublicationStats {
  totalPublications: number;
  published: number;
  underReview: number;
  inProgress: number;
  rejected: number;
  totalCitations: number;
  averageImpactFactor: number | null;
  publicationsByYear?: Record<string, number>;
}
