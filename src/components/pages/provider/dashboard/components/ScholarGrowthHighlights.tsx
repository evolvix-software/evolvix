"use client";

import { TrendingUp, Briefcase, GraduationCap, Award, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { GrowthHighlights } from '@/interfaces/providerDashboard';

interface ScholarGrowthHighlightsProps {
    highlights: GrowthHighlights;
}

export function ScholarGrowthHighlights({ highlights }: ScholarGrowthHighlightsProps) {
    return (
        <Card className=" border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    Scholar Growth Highlights
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Recent Placements */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center">
                            <Briefcase className="w-3 h-3 mr-1" /> Recent Placements
                        </h4>
                        <div className="space-y-3">
                            {highlights.recentPlacements.map((placement) => (
                                <div key={placement.id} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {placement.company.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {placement.scholarName} placed at <span className="font-bold">{placement.company}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{placement.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center">
                            <Star className="w-3 h-3 mr-1" /> Top Performers
                        </h4>
                        <div className="space-y-3">
                            {highlights.topPerformers.map((performer) => (
                                <div key={performer.id} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 font-bold text-xs">
                                        {performer.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">{performer.name}</p>
                                        <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center">
                                            <Award className="w-3 h-3 mr-1" />
                                            {performer.achievement}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
