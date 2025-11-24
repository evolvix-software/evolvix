"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { AlertTriangle, Users, TrendingDown, Shield, CheckCircle } from 'lucide-react';
import { scholarService } from '@/data/mock/providerData';
import { Scholar } from '@/data/mock/providerData';

interface RiskRetentionAnalysisProps {
  providerId?: string;
  campaignId?: string;
}

export function RiskRetentionAnalysis({ providerId, campaignId }: RiskRetentionAnalysisProps) {
  const [riskData, setRiskData] = useState({
    atRiskCount: 0,
    riskScoreDistribution: {
      low: 0,
      medium: 0,
      high: 0,
    },
    dropoutRate: 0,
    retentionRate: 0,
    interventionSuccessRate: 0,
    atRiskScholars: [] as Scholar[],
  });

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    const totalScholars = filteredScholars.length;
    const droppedOut = filteredScholars.filter(s => s.graduationStatus === 'dropped-out').length;
    const activeScholars = filteredScholars.filter(s => s.awardStatus === 'active');

    // Calculate risk scores (mock: based on engagement and progress)
    const scholarsWithRisk: Array<{ scholar: Scholar; riskScore: number }> = filteredScholars.map(scholar => {
      let riskScore = 0;

      // Low engagement increases risk
      const videoWatch = scholar.engagement?.videoWatchPercentage || 0;
      const assignmentRate = scholar.engagement?.assignmentSubmissionRate || 0;
      const completionRate = scholar.enrollments?.[0]?.completionPercentage || 0;
      const loginCount = scholar.engagement?.totalLogins || 0;

      if (videoWatch < 50) riskScore += 30;
      if (assignmentRate < 50) riskScore += 25;
      if (completionRate < 30) riskScore += 25;
      if (loginCount < 5) riskScore += 20;

      // Low CGPA improvement increases risk
      if (scholar.currentCGPA) {
        const improvement = scholar.currentCGPA - scholar.baselineCGPA;
        if (improvement < 0.5) riskScore += 20;
      }

      return { scholar, riskScore: Math.min(riskScore, 100) };
    });

    const atRiskScholars = scholarsWithRisk.filter(item => item.riskScore >= 50);
    const highRisk = scholarsWithRisk.filter(item => item.riskScore >= 70).length;
    const mediumRisk = scholarsWithRisk.filter(item => item.riskScore >= 50 && item.riskScore < 70).length;
    const lowRisk = scholarsWithRisk.filter(item => item.riskScore < 50).length;

    const dropoutRate = totalScholars > 0 ? (droppedOut / totalScholars) * 100 : 0;
    const retentionRate = totalScholars > 0 ? ((totalScholars - droppedOut) / totalScholars) * 100 : 0;

    // Mock intervention success rate
    const interventionSuccessRate = 75; // 75% success rate for interventions

    setRiskData({
      atRiskCount: atRiskScholars.length,
      riskScoreDistribution: {
        low: lowRisk,
        medium: mediumRisk,
        high: highRisk,
      },
      dropoutRate: Math.round(dropoutRate * 10) / 10,
      retentionRate: Math.round(retentionRate * 10) / 10,
      interventionSuccessRate,
      atRiskScholars: atRiskScholars.map(item => item.scholar).slice(0, 10),
    });
  }, [providerId, campaignId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risk & Retention Analysis
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">At-Risk Scholars</p>
              <p className="text-3xl font-bold text-red-600">{riskData.atRiskCount}</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Dropout Rate</p>
              <p className="text-3xl font-bold text-yellow-600">{riskData.dropoutRate}%</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Retention Rate</p>
              <p className="text-3xl font-bold text-green-600">{riskData.retentionRate}%</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Intervention Success</p>
              <p className="text-3xl font-bold text-blue-600">{riskData.interventionSuccessRate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(() => {
              const total = riskData.riskScoreDistribution.low + riskData.riskScoreDistribution.medium + riskData.riskScoreDistribution.high;
              const lowPercentage = total > 0 ? (riskData.riskScoreDistribution.low / total) * 100 : 0;
              const mediumPercentage = total > 0 ? (riskData.riskScoreDistribution.medium / total) * 100 : 0;
              const highPercentage = total > 0 ? (riskData.riskScoreDistribution.high / total) * 100 : 0;

              return (
                <>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Low Risk
                      </span>
                      <span className="text-lg font-bold text-green-600">{riskData.riskScoreDistribution.low}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${lowPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        Medium Risk
                      </span>
                      <span className="text-lg font-bold text-yellow-600">{riskData.riskScoreDistribution.medium}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all"
                        style={{ width: `${mediumPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        High Risk
                      </span>
                      <span className="text-lg font-bold text-red-600">{riskData.riskScoreDistribution.high}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${highPercentage}%` }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {riskData.atRiskScholars.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                At-Risk Scholars Requiring Attention
              </h4>
              <div className="space-y-2">
                {riskData.atRiskScholars.map((scholar) => {
                  const videoWatch = scholar.engagement?.videoWatchPercentage || 0;
                  const assignmentRate = scholar.engagement?.assignmentSubmissionRate || 0;
                  const completionRate = scholar.enrollments?.[0]?.completionPercentage || 0;
                  
                  return (
                    <div key={scholar.id} className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{scholar.profile.name}</p>
                          <p className="text-xs text-muted-foreground">{scholar.profile.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-red-600">High Risk</p>
                          <p className="text-xs text-muted-foreground">
                            Engagement: {Math.round((videoWatch + assignmentRate + completionRate) / 3)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                          Video Watch: {videoWatch}%
                        </span>
                        <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                          Assignments: {assignmentRate}%
                        </span>
                        <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                          Completion: {completionRate}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
            <div className="text-center">
              <TrendingDown className="w-12 h-12 mx-auto mb-2" />
              <p>Risk Score Distribution Chart</p>
              <p className="text-sm">Chart visualization will be implemented</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

