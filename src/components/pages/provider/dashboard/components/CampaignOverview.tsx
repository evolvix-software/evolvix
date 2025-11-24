"use client";

import { Megaphone, ArrowRight, Users, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { CampaignStats } from '@/interfaces/providerDashboard';

interface CampaignOverviewProps {
    stats: CampaignStats;
}

export function CampaignOverview({ stats }: CampaignOverviewProps) {
    return (
        <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <Megaphone className="w-5 h-5 mr-2 text-primary" />
                        Assigned Campaigns
                    </CardTitle>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary/80"
                        onClick={() => window.location.href = '/portal/provider/campaigns'}
                    >
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.activeCount}</p>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Campaigns</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalApplications}</p>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Applications</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Slots Filled</span>
                            <span className="font-medium text-foreground">
                                {Math.round((stats.totalApplications / stats.totalSlots) * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500"
                                style={{ width: `${(stats.totalApplications / stats.totalSlots) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.totalApplications} applications for {stats.totalSlots} slots
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm text-muted-foreground">Active ({stats.byStatus.active})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            <span className="text-sm text-muted-foreground">Draft ({stats.byStatus.draft})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm text-muted-foreground">Completed ({stats.byStatus.completed})</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
