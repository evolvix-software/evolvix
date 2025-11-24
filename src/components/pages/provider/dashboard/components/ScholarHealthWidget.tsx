"use client";

import { Activity, AlertTriangle, CheckCircle, GraduationCap, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { ScholarHealth } from '@/interfaces/providerDashboard';

interface ScholarHealthWidgetProps {
    health: ScholarHealth;
}

export function ScholarHealthWidget({ health }: ScholarHealthWidgetProps) {
    return (
        <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary" />
                    Scholar Health
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
                            <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">{health.activeCount}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-red-700 dark:text-red-400">At Risk</span>
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                        </div>
                        <p className="text-xl font-bold text-red-700 dark:text-red-400">{health.atRiskCount}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Average Progress</span>
                            <span className="font-medium text-foreground">{health.averageProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${health.averageProgress}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Engagement Score</span>
                            <span className="font-medium text-foreground">{health.averageEngagement}/100</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500"
                                style={{ width: `${health.averageEngagement}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border mt-2">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <GraduationCap className="w-3 h-3 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Graduated</p>
                                <p className="text-sm font-semibold">{health.graduatedCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                <Briefcase className="w-3 h-3 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Placed</p>
                                <p className="text-sm font-semibold">{health.jobPlacedCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
