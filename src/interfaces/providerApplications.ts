export type ApplicationStatus = 'submitted' | 'under_verification' | 'review_pending' | 'shortlisted' | 'awarded' | 'rejected';
export type ApplicationPriority = 'low' | 'medium' | 'high';
export type VerificationStatus = 'pending' | 'in_progress' | 'completed' | 'needs_info';
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'needs_info';

export interface ApplicationDocument {
    id: string;
    name: string;
    type: string;
    url: string;
    status: DocumentStatus;
    uploadedAt: string;
    verifiedAt?: string;
    verifiedBy?: string;
    notes?: string;
}

export interface ReviewerScore {
    reviewerId: string;
    reviewerName: string;
    academicScore: number;
    financialScore: number;
    motivationScore: number;
    totalScore: number;
    notes: string;
    submittedAt: string;
}

export interface ApplicationFlag {
    id: string;
    type: 'warning' | 'info' | 'critical';
    message: string;
    createdBy: string;
    createdAt: string;
    resolved: boolean;
}

export interface Application {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentAvatar?: string;
    studentPhone?: string;
    studentLocation?: string;
    studentInstitution?: string;
    studentGraduationYear?: string;
    campaignId: string;
    campaignName: string;
    courseId?: string;
    courseName?: string;
    status: ApplicationStatus;
    cgpa: number;
    familyIncome?: number;
    totalScore?: number;
    ranking?: number;
    priority: ApplicationPriority;
    documents: ApplicationDocument[];
    verificationStatus: VerificationStatus;
    reviewerScores: ReviewerScore[];
    flags: ApplicationFlag[];
    submittedAt: string;
    updatedAt: string;
    scholarshipAmount?: number;
    scholarshipJustification?: string;
}

export interface ApplicationStats {
    total: number;
    submitted: number;
    underVerification: number;
    reviewPending: number;
    shortlisted: number;
    awarded: number;
    rejected: number;
}
