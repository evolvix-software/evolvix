"use client";

import { Award as AwardIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Award } from '@/interfaces/providerDashboard';

interface RecentAwardsProps {
    awards: Award[];
}

export function RecentAwards({ awards }: RecentAwardsProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <AwardIcon className="w-5 h-5 mr-2 text-primary" />
                        Recent Awards
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {awards.map((award) => (
                        <div key={award.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {award.scholarName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{award.scholarName}</p>
                                    <p className="text-xs text-muted-foreground">{award.campaignName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-foreground">₹{(award.amount / 1000).toFixed(0)}k</p>
                                <p className="text-xs text-muted-foreground">{formatDate(award.date)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
