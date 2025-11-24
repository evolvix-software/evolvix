export interface ImpactMetrics {
    totalScholars: number;
    graduationRate: number;
    jobPlacementRate: number;
    averageCGPAImprovement: number;
    totalInvestment: number;
    roi: number;
    livesChanged: number;
    jobsCreated: number;
}

export interface FundStatus {
    currentBalance: number;
    inTransit: number;
    reserved: number;
    totalPledged: number;
    totalTransferred: number;
    totalDisbursed: number;
}

export interface ScholarHealth {
    activeCount: number;
    atRiskCount: number;
    graduatedCount: number;
    jobPlacedCount: number;
    averageProgress: number;
    averageEngagement: number;
}

export interface Award {
    id: string;
    scholarName: string;
    amount: number;
    date: string;
    campaignName: string;
    scholarId: string;
}

export interface Disbursement {
    id: string;
    scholarName: string;
    amount: number;
    date: string;
    status: 'pending' | 'completed' | 'failed' | 'processing';
    receiptUrl?: string;
}

export interface CampaignStats {
    activeCount: number;
    byStatus: Record<string, number>;
    totalSlots: number;
    totalApplications: number;
}

export interface ApplicationStats {
    pendingReview: number;
    underVerification: number;
    shortlisted: number;
    urgent: number;
}

export interface JobPlacement {
    id: string;
    scholarName: string;
    company: string;
    role: string;
    date: string;
}

export interface Graduation {
    id: string;
    scholarName: string;
    degree: string;
    institution: string;
    date: string;
}

export interface Scholar {
    id: string;
    name: string;
    avatar?: string;
    achievement?: string;
}

export interface GrowthHighlights {
    recentPlacements: JobPlacement[];
    recentGraduations: Graduation[];
    topPerformers: Scholar[];
    mostImproved: Scholar[];
}

export interface Activity {
    id: string;
    type: 'application' | 'award' | 'graduation' | 'placement' | 'transfer' | 'disbursement' | 'system';
    description: string;
    timestamp: string;
    user?: {
        name: string;
        avatar?: string;
    };
    link?: string;
}

export interface SuccessStory {
    id: string;
    scholarName: string;
    scholarPhoto?: string;
    title: string;
    quote: string;
    beforeMetric?: string;
    afterMetric?: string;
}

export interface DashboardData {
    impactMetrics: ImpactMetrics;
    fundStatus: FundStatus;
    scholarHealth: ScholarHealth;
    recentAwards: Award[];
    recentDisbursements: Disbursement[];
    campaigns: CampaignStats;
    applications: ApplicationStats;
    growthHighlights: GrowthHighlights;
    activity: Activity[];
    successStories: SuccessStory[];
}
