import { DashboardData } from '@/interfaces/providerDashboard';

export const mockDashboardData: DashboardData = {
    impactMetrics: {
        totalScholars: 1250,
        graduationRate: 94,
        jobPlacementRate: 88,
        averageCGPAImprovement: 1.2,
        totalInvestment: 25000000, // 2.5 Cr
        roi: 150, // 150% social ROI
        livesChanged: 4500, // Including families
        jobsCreated: 850,
    },
    fundStatus: {
        currentBalance: 4500000,
        inTransit: 500000,
        reserved: 2000000,
        totalPledged: 50000000,
        totalTransferred: 30000000,
        totalDisbursed: 23500000,
    },
    scholarHealth: {
        activeCount: 850,
        atRiskCount: 12,
        graduatedCount: 350,
        jobPlacedCount: 310,
        averageProgress: 78,
        averageEngagement: 85,
    },
    recentAwards: [
        {
            id: '1',
            scholarName: 'Rahul Kumar',
            amount: 50000,
            date: '2024-03-15',
            campaignName: 'Tech Leaders 2024',
            scholarId: 's1',
        },
        {
            id: '2',
            scholarName: 'Priya Singh',
            amount: 75000,
            date: '2024-03-14',
            campaignName: 'Women in STEM',
            scholarId: 's2',
        },
        {
            id: '3',
            scholarName: 'Amit Patel',
            amount: 50000,
            date: '2024-03-12',
            campaignName: 'Tech Leaders 2024',
            scholarId: 's3',
        },
        {
            id: '4',
            scholarName: 'Sneha Gupta',
            amount: 100000,
            date: '2024-03-10',
            campaignName: 'Future Innovators',
            scholarId: 's4',
        },
        {
            id: '5',
            scholarName: 'Vikram Malhotra',
            amount: 50000,
            date: '2024-03-08',
            campaignName: 'Tech Leaders 2024',
            scholarId: 's5',
        },
    ],
    recentDisbursements: [
        {
            id: 'd1',
            scholarName: 'Rahul Kumar',
            amount: 25000,
            date: '2024-03-16',
            status: 'completed',
        },
        {
            id: 'd2',
            scholarName: 'Priya Singh',
            amount: 37500,
            date: '2024-03-15',
            status: 'processing',
        },
        {
            id: 'd3',
            scholarName: 'Amit Patel',
            amount: 25000,
            date: '2024-03-13',
            status: 'completed',
        },
    ],
    campaigns: {
        activeCount: 4,
        byStatus: {
            draft: 1,
            active: 4,
            completed: 2,
            paused: 0,
        },
        totalSlots: 500,
        totalApplications: 1250,
    },
    applications: {
        pendingReview: 45,
        underVerification: 12,
        shortlisted: 28,
        urgent: 5,
    },
    growthHighlights: {
        recentPlacements: [
            {
                id: 'p1',
                scholarName: 'Arjun Reddy',
                company: 'Google',
                role: 'Software Engineer',
                date: '2024-03-10',
            },
            {
                id: 'p2',
                scholarName: 'Meera Nair',
                company: 'Microsoft',
                role: 'Product Manager',
                date: '2024-03-08',
            },
        ],
        recentGraduations: [
            {
                id: 'g1',
                scholarName: 'Kavya Sharma',
                degree: 'B.Tech CS',
                institution: 'IIT Delhi',
                date: '2024-03-01',
            },
        ],
        topPerformers: [
            { id: 't1', name: 'Rohan Das', achievement: 'Top 1% in Coding' },
            { id: 't2', name: 'Sanya Mir', achievement: 'Published Research Paper' },
        ],
        mostImproved: [
            { id: 'i1', name: 'Deepak Verma', achievement: '+2.5 CGPA' },
            { id: 'i2', name: 'Anjali K', achievement: '100% Attendance' },
        ],
    },
    activity: [
        {
            id: 'a1',
            type: 'application',
            description: 'New application received for Tech Leaders 2024',
            timestamp: '10 mins ago',
            user: { name: 'System' },
        },
        {
            id: 'a2',
            type: 'award',
            description: 'Awarded scholarship to Rahul Kumar',
            timestamp: '2 hours ago',
            user: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        },
        {
            id: 'a3',
            type: 'transfer',
            description: 'Funds transfer of ₹5,00,000 initiated',
            timestamp: '5 hours ago',
            user: { name: 'Finance Team' },
        },
        {
            id: 'a4',
            type: 'placement',
            description: 'Arjun Reddy placed at Google',
            timestamp: '1 day ago',
            user: { name: 'Placement Cell' },
        },
    ],
    successStories: [
        {
            id: 's1',
            scholarName: 'Arjun Reddy',
            title: 'From Village to Google',
            quote: 'The scholarship gave me the freedom to focus on my code, not my fees.',
            beforeMetric: 'Family Income: ₹1.2L/yr',
            afterMetric: 'Package: ₹45L/yr',
        },
        {
            id: 's2',
            scholarName: 'Priya Singh',
            title: 'Breaking Barriers in STEM',
            quote: 'I am the first engineer in my family, thanks to this support.',
            beforeMetric: 'First Gen Learner',
            afterMetric: 'R&D Engineer',
        },
    ],
};
