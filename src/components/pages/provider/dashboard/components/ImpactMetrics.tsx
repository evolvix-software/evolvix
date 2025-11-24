"use client";

import { Users, GraduationCap, Briefcase, TrendingUp, DollarSign, Heart, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { ImpactMetrics as ImpactMetricsType } from '@/interfaces/providerDashboard';

interface ImpactMetricsProps {
    metrics: ImpactMetricsType;
}

export function ImpactMetrics({ metrics }: ImpactMetricsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                title="Total Active Scholars"
                value={metrics.totalScholars}
                icon={Users}
                trend="+12%"
                trendUp={true}
                color="blue"
            />
            <MetricCard
                title="Graduation Rate"
                value={`${metrics.graduationRate}%`}
                icon={GraduationCap}
                trend="+2%"
                trendUp={true}
                color="green"
            />
            <MetricCard
                title="Job Placement Rate"
                value={`${metrics.jobPlacementRate}%`}
                icon={Briefcase}
                trend="+5%"
                trendUp={true}
                color="purple"
            />
            <MetricCard
                title="Total Investment"
                value={`₹${(metrics.totalInvestment / 10000000).toFixed(2)}Cr`}
                icon={DollarSign}
                trend="ROI 150%"
                trendUp={true}
                color="yellow"
            />
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    trendUp?: boolean;
    color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

function MetricCard({ title, value, icon: Icon, trend, trendUp, color }: MetricCardProps) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    };

    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-primary">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">{title}</p>
                        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center text-xs">
                        <span className={`font-bold ${trendUp ? 'text-green-800' : 'text-red-600'} flex items-center`}>
                            {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                            {trend}
                        </span>
                        <span className="text-foreground ml-2">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
