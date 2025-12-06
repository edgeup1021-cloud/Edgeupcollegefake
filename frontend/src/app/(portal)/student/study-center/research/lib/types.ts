export interface Paper {
  paperId: string;
  title: string;
  abstract: string | null;
  authors: Author[];
  year: number | null;
  citationCount: number;
  url: string;
  openAccessPdf: { url: string } | null;
  venue: string | null;
}

export interface Author {
  authorId: string;
  name: string;
}

export interface SemanticScholarResponse {
  total: number;
  token: string | null;
  data: Paper[];
}

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  papers: Paper[];
  keywords: string[];
  total: number;
}

export interface KeywordExtraction {
  keywords: string[];
}
