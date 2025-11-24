"use client";

import { Briefcase, Users, Award, TrendingUp } from 'lucide-react';
import { StatsCard, STAT_CARD_COLORS } from '@/components/common/ui/StatsCard';

// Define a local interface for now, or import if it exists
export interface ProviderStats {
    jobsPosted: number;
    applicationsReceived: number;
    activeListings: number;
    profileViews: number;
}

interface StatsGridProps {
    stats: ProviderStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
                icon={Briefcase}
                value={stats.jobsPosted}
                label="Jobs Posted"
                trend={{ value: 5, isPositive: true }}
                {...STAT_CARD_COLORS.blue}
            />
            <StatsCard
                icon={Users}
                value={stats.applicationsReceived}
                label="Applications"
                trend={{ value: 12, isPositive: true }}
                {...STAT_CARD_COLORS.purple}
            />
            <StatsCard
                icon={Award}
                value={stats.activeListings}
                label="Active Listings"
                trend={{ value: 2, isPositive: true }}
                {...STAT_CARD_COLORS.yellow}
            />
            <StatsCard
                icon={TrendingUp}
                value={stats.profileViews}
                label="Profile Views"
                trend={{ value: 8, isPositive: true }}
                {...STAT_CARD_COLORS.green}
            />
        </div>
    );
}
