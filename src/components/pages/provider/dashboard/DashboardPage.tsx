"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import {
    WelcomeHeader,
    ImpactMetrics,
    FundStatusWidget,
    ScholarHealthWidget,
    RecentAwards,
    RecentDisbursements,
    CampaignOverview,
    ApplicationsQueue,
    ScholarGrowthHighlights,
    QuickActions,
    ActivityFeed,
    SuccessStoriesCarousel
} from './components/index';
import { mockDashboardData } from '@/data/mock/providerDashboardData';
import { DashboardData } from '@/interfaces/providerDashboard';

export function ProviderDashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get stored registration data
        const storedData = localStorage.getItem('evolvix_registration');

        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserData(parsedData);
            setIsVerified(true); // Mock verification
        } else {
            setUserData({ fullName: 'Provider User', role: 'provider' });
        }

        // Simulate API fetch
        const timer = setTimeout(() => {
            setData(mockDashboardData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    if (loading || !userData || !data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-foreground">Loading Dashboard...</h1>
                </div>
            </div>
        );
    }

    return (
        <Layout title="Dashboard" role="provider" noCard>
            <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
                <WelcomeHeader userName={userData.fullName || 'Provider'} isVerified={isVerified} />

                {/* Quick Actions */}
                <QuickActions />

                {/* Key Impact Metrics */}
                <ImpactMetrics metrics={data.impactMetrics} />

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Financial Overview & Scholar Health */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FundStatusWidget status={data.fundStatus} />
                            <ScholarHealthWidget health={data.scholarHealth} />
                        </div>

                        {/* Campaign & Applications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CampaignOverview stats={data.campaigns} />
                            <ApplicationsQueue stats={data.applications} />
                        </div>

                        {/* Recent Transactions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RecentAwards awards={data.recentAwards} />
                            <RecentDisbursements disbursements={data.recentDisbursements} />
                        </div>
                    </div>

                    {/* Right Column (1/3 width) */}
                    <div className="space-y-6">
                        {/* Success Stories Carousel */}
                        <div className="min-h-[16rem] h-auto">
                            <SuccessStoriesCarousel stories={data.successStories} />
                        </div>

                        {/* Activity Feed */}
                        <ActivityFeed activities={data.activity} />

                        {/* Growth Highlights */}
                        <ScholarGrowthHighlights highlights={data.growthHighlights} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
