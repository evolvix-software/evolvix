"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Briefcase, TrendingUp, DollarSign, Building2, Users, Award } from 'lucide-react';
import { scholarService } from '@/data/mock/providerData';
import { Scholar } from '@/data/mock/providerData';

interface JobPlacementStatsProps {
  providerId?: string;
  campaignId?: string;
  detailed?: boolean;
}

export function JobPlacementStats({ providerId, campaignId, detailed = false }: JobPlacementStatsProps) {
  const [stats, setStats] = useState({
    placementRate: 0,
    averageTimeToPlacement: 0,
    averageSalary: 0,
    totalPlaced: 0,
    placementsByCompany: {} as Record<string, number>,
    placementsByRole: {} as Record<string, number>,
    successStories: [] as Scholar[],
  });

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    const placedScholars = filteredScholars.filter(s => s.jobPlacement?.verified);
    const totalScholars = filteredScholars.length;

    // Calculate placement rate
    const placementRate = totalScholars > 0
      ? (placedScholars.length / totalScholars) * 100
      : 0;

    // Calculate average time to placement (mock: days from award date to placement)
    const placementsWithDates = placedScholars.filter(s => s.jobPlacement?.startDate && s.awardDate);
    const averageTimeToPlacement = placementsWithDates.length > 0
      ? placementsWithDates.reduce((sum, s) => {
          const awardDate = new Date(s.awardDate);
          const placementDate = new Date(s.jobPlacement!.startDate);
          const days = Math.floor((placementDate.getTime() - awardDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / placementsWithDates.length
      : 0;

    // Calculate average salary
    const salaries = placedScholars
      .map(s => s.jobPlacement?.salary?.amount)
      .filter((s): s is number => s !== undefined);
    const averageSalary = salaries.length > 0
      ? salaries.reduce((sum, s) => sum + s, 0) / salaries.length
      : 0;

    // Placements by company
    const placementsByCompany: Record<string, number> = {};
    placedScholars.forEach(s => {
      const company = s.jobPlacement?.companyName || 'Unknown';
      placementsByCompany[company] = (placementsByCompany[company] || 0) + 1;
    });

    // Placements by role
    const placementsByRole: Record<string, number> = {};
    placedScholars.forEach(s => {
      const role = s.jobPlacement?.jobTitle || 'Unknown';
      placementsByRole[role] = (placementsByRole[role] || 0) + 1;
    });

    // Success stories (top placements by salary)
    const successStories = [...placedScholars]
      .filter(s => s.jobPlacement?.salary?.amount)
      .sort((a, b) => (b.jobPlacement?.salary?.amount || 0) - (a.jobPlacement?.salary?.amount || 0))
      .slice(0, 5);

    setStats({
      placementRate: Math.round(placementRate * 10) / 10,
      averageTimeToPlacement: Math.round(averageTimeToPlacement),
      averageSalary: Math.round(averageSalary),
      totalPlaced: placedScholars.length,
      placementsByCompany,
      placementsByRole,
      successStories,
    });
  }, [providerId, campaignId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Placement Statistics
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Placement Rate</p>
              <p className="text-3xl font-bold text-foreground">{stats.placementRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Placed</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalPlaced}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Time to Placement</p>
              <p className="text-3xl font-bold text-foreground">{stats.averageTimeToPlacement} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Salary</p>
              <p className="text-3xl font-bold text-foreground">
                ₹{stats.averageSalary > 0 ? (stats.averageSalary / 100000).toFixed(1) : '0'}L
              </p>
            </div>
          </div>

          {detailed && (
            <>
              <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Placement Trends Chart</p>
                  <p className="text-sm">Chart visualization will be implemented</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Top Hiring Companies
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(stats.placementsByCompany)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([company, count]) => (
                        <div key={company} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <span className="text-sm text-foreground">{company}</span>
                          <span className="text-sm font-semibold text-primary">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Top Job Roles
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(stats.placementsByRole)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <span className="text-sm text-foreground">{role}</span>
                          <span className="text-sm font-semibold text-primary">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {stats.successStories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Featured Placements
                  </h4>
                  <div className="space-y-2">
                    {stats.successStories.map((scholar) => (
                      <div key={scholar.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{scholar.profile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {scholar.jobPlacement?.jobTitle} at {scholar.jobPlacement?.companyName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              ₹{scholar.jobPlacement?.salary ? (scholar.jobPlacement.salary.amount / 100000).toFixed(1) : '0'}L
                            </p>
                            <p className="text-xs text-muted-foreground">Annual</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
