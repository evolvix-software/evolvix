"use client";

import { FileText, ArrowRight, Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ApplicationStats } from '@/interfaces/providerDashboard';

interface ApplicationsQueueProps {
    stats: ApplicationStats;
}

export function ApplicationsQueue({ stats }: ApplicationsQueueProps) {
    return (
        <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-primary" />
                        Applications Queue
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Review All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                <Clock className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Pending Review</p>
                                <p className="text-xs text-muted-foreground">Awaiting initial screening</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                {stats.pendingReview}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Shield className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Under Verification</p>
                                <p className="text-xs text-muted-foreground">Document check in progress</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                {stats.underVerification}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Shortlisted</p>
                                <p className="text-xs text-muted-foreground">Ready for final decision</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {stats.shortlisted}
                            </span>
                        </div>
                    </div>

                    {stats.urgent > 0 && (
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20 cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">Urgent Attention</p>
                                    <p className="text-xs text-red-600/80 dark:text-red-400/80">High priority applications</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                                    {stats.urgent}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
