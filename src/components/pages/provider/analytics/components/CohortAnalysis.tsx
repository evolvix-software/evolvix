"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Users, TrendingUp, Calendar, Award } from 'lucide-react';
import { scholarService, campaignService } from '@/data/mock/providerData';

interface CohortAnalysisProps {
  providerId?: string;
  campaignId?: string;
}

interface Cohort {
  id: string;
  name: string;
  campaignId: string;
  startDate: string;
  totalScholars: number;
  graduated: number;
  placed: number;
  averageCGPA: number;
  averageImprovement: number;
  graduationRate: number;
  placementRate: number;
}

export function CohortAnalysis({ providerId, campaignId }: CohortAnalysisProps) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const campaigns = campaignService.getAll(providerId);

    // Group scholars by campaign (as cohorts)
    const cohortMap: Record<string, Cohort> = {};

    campaigns.forEach(campaign => {
      if (campaignId && campaign.id !== campaignId) return;

      const campaignScholars = scholars.filter(s => s.campaignId === campaign.id);
      const graduated = campaignScholars.filter(s => s.graduationStatus === 'graduated').length;
      const placed = campaignScholars.filter(s => s.jobPlacement?.verified).length;

      const scholarsWithCGPA = campaignScholars.filter(s => s.baselineCGPA > 0);
      const averageCGPA = scholarsWithCGPA.length > 0
        ? scholarsWithCGPA.reduce((sum, s) => sum + s.baselineCGPA, 0) / scholarsWithCGPA.length
        : 0;

      const scholarsWithImprovement = campaignScholars.filter(s => s.currentCGPA && s.baselineCGPA);
      const averageImprovement = scholarsWithImprovement.length > 0
        ? scholarsWithImprovement.reduce((sum, s) => {
            const improvement = (s.currentCGPA || s.baselineCGPA) - s.baselineCGPA;
            return sum + improvement;
          }, 0) / scholarsWithImprovement.length
        : 0;

      cohortMap[campaign.id] = {
        id: campaign.id,
        name: campaign.title,
        campaignId: campaign.id,
        startDate: campaign.applicationOpenDate,
        totalScholars: campaignScholars.length,
        graduated,
        placed,
        averageCGPA: Math.round(averageCGPA * 10) / 10,
        averageImprovement: Math.round(averageImprovement * 10) / 10,
        graduationRate: campaignScholars.length > 0 ? (graduated / campaignScholars.length) * 100 : 0,
        placementRate: campaignScholars.length > 0 ? (placed / campaignScholars.length) * 100 : 0,
      };
    });

    setCohorts(Object.values(cohortMap).sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    ));
  }, [providerId, campaignId]);

  const filteredCohorts = selectedCohort === 'all'
    ? cohorts
    : cohorts.filter(c => c.id === selectedCohort);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Cohort Analysis
            </h3>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            >
              <option value="all">All Cohorts</option>
              {cohorts.map(cohort => (
                <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredCohorts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No cohort data available.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCohorts.map((cohort) => (
                  <Card key={cohort.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{cohort.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Started: {new Date(cohort.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Scholars</p>
                            <p className="text-xl font-bold text-foreground">{cohort.totalScholars}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Graduated</p>
                            <p className="text-xl font-bold text-green-600">{cohort.graduated}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Placed</p>
                            <p className="text-xl font-bold text-blue-600">{cohort.placed}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Avg CGPA</p>
                            <p className="text-xl font-bold text-foreground">{cohort.averageCGPA}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Graduation Rate</span>
                            <span className="text-sm font-semibold text-foreground">{cohort.graduationRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${cohort.graduationRate}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Placement Rate</span>
                            <span className="text-sm font-semibold text-foreground">{cohort.placementRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${cohort.placementRate}%` }}
                            />
                          </div>
                        </div>
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground">Avg CGPA Improvement</p>
                          <p className="text-lg font-bold text-green-600">+{cohort.averageImprovement}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Cohort Comparison Chart</p>
                  <p className="text-sm">Chart visualization will be implemented</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

