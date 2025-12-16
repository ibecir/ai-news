// API Response Types
export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  details?: unknown;
}

// User Types
export interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface UserWithStats extends User {
  total_links: number;
  verified_links: number;
  pending_links: number;
}

export interface LoginRequest {
  email: string;
}

// Link Types
export type LinkStatus = 'pending' | 'processing' | 'scraped' | 'verified' | 'failed';

export interface Link {
  id: number;
  url: string;
  title: string | null;
  source_domain: string | null;
  author: string | null;
  published_at: string | null;
  status: LinkStatus;
  created_at: string;
  updated_at: string;
}

export interface VerificationSummary {
  credibility_score: number | null;
  claims_count: number;
  verified_at: string | null;
  summary: string | null;
}

export interface LinkWithVerification extends Link {
  verification: VerificationSummary | null;
}

export interface LinkDetail extends Link {
  content: string | null;
  error_message: string | null;
  verification: VerificationResponse | null;
}

export interface ClaimCheck {
  claim: string;
  verdict: 'verified' | 'false' | 'unverified' | 'partially_true';
  sources: string[];
  explanation?: string;
}

export interface VerificationResponse {
  id: number;
  link_id: number;
  credibility_score: number | null;
  claims: ClaimCheck[] | null;
  sources_checked: string[] | null;
  summary: string | null;
  verified_at: string;
}

export interface LinkStats {
  total_links: number;
  verified_links: number;
  pending_links: number;
  failed_links: number;
  average_credibility: number | null;
  links_by_status: Record<string, number>;
  recent_links: Link[];
}

export interface PaginatedLinks {
  items: LinkWithVerification[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LinkCreateRequest {
  url: string;
}

export interface LinkUpdateRequest {
  title?: string;
}

// Dashboard Types
export interface DashboardData {
  user: UserWithStats;
  stats: {
    total_links: number;
    verified_links: number;
    pending_links: number;
    failed_links: number;
    average_credibility: number | null;
    links_by_status: Record<string, number>;
  };
  recent_links: LinkWithVerification[];
}
