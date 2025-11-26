export interface Candidate {
  id: string;
  name: string;
  headline: string;
  currentPosition: string;
  currentCompany: string;
  location: string;
  skills: string[];
  matchScore: number;
  availability: 'immediate' | '2weeks' | '1month' | '3months' | 'not-looking';
  experience: number;
  education: string;
  photo?: string;
  email?: string;
  phone?: string;
  languages?: string[];
  certifications?: string[];
  tags?: string[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  resumeUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface SearchFilters {
  query?: string;
  skills?: string[];
  experience?: {
    min: number;
    max: number;
  };
  location?: string;
  remote?: boolean;
  willingToRelocate?: boolean;
  radius?: number;
  availability?: string[];
  education?: string[];
  degreeLevel?: string[];
  fieldOfStudy?: string[];
  institution?: string;
  graduationYear?: {
    min: number;
    max: number;
  };
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'annual' | 'monthly' | 'hourly';
  };
  tags?: string[];
  languages?: string[];
  certifications?: string[];
  securityClearance?: boolean;
  industryExperience?: string[];
  companySize?: string[];
  roleLevel?: string[];
}

export interface SearchResult {
  candidate: Candidate;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  relevanceScore: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  resultCount?: number;
  lastSearched?: string;
  createdAt: string;
  alertsEnabled?: boolean;
  alertFrequency?: 'daily' | 'weekly' | 'instant';
}

export type SortOption = 'relevance' | 'match' | 'experience' | 'date' | 'name';
export type ViewMode = 'grid' | 'list';

