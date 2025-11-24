"use client";

import { Clock, ArrowRight, FileText, Award, Wallet, Briefcase, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Activity } from '@/interfaces/providerDashboard';

interface ActivityFeedProps {
    activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'application':
                return <FileText className="w-4 h-4 text-blue-500" />;
            case 'award':
                return <Award className="w-4 h-4 text-yellow-500" />;
            case 'transfer':
                return <Wallet className="w-4 h-4 text-green-500" />;
            case 'placement':
                return <Briefcase className="w-4 h-4 text-purple-500" />;
            default:
                return <User className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <Card className=" border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary" />
                        Recent Activity
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative pl-4 border-l border-border space-y-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-background border-2 border-primary" />
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-foreground">{activity.description}</p>
                                    <div className="flex items-center mt-1 space-x-2">
                                        {getActivityIcon(activity.type)}
                                        <span className="text-xs text-muted-foreground capitalize">{activity.type}</span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                                    </div>
                                </div>
                                {activity.user?.avatar && (
                                    <img
                                        src={activity.user.avatar}
                                        alt={activity.user.name}
                                        className="w-6 h-6 rounded-full"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
