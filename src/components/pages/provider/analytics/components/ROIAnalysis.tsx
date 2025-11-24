"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { DollarSign, TrendingUp, Users, Briefcase, Target, Award } from 'lucide-react';
import { scholarService, transferService, campaignService } from '@/data/mock/providerData';

interface ROIAnalysisProps {
  providerId?: string;
  campaignId?: string;
}

export function ROIAnalysis({ providerId, campaignId }: ROIAnalysisProps) {
  const [roiData, setRoiData] = useState({
    totalInvestment: 0,
    costPerScholar: 0,
    costPerGraduate: 0,
    costPerJobPlacement: 0,
    overallROI: 0,
    roiByCampaign: {} as Record<string, number>,
    livesChanged: 0,
    jobsCreated: 0,
    graduatesProduced: 0,
  });

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const transfers = transferService.getAll(providerId);
    const campaigns = campaignService.getAll(providerId);

    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    const filteredTransfers = campaignId
      ? transfers.filter(t => t.campaignId === campaignId && t.status === 'confirmed')
      : transfers.filter(t => t.status === 'confirmed');

    // Calculate total investment
    const totalInvestment = filteredTransfers.reduce((sum, t) => sum + t.amount, 0);

    const totalScholars = filteredScholars.length;
    const graduatedScholars = filteredScholars.filter(s => s.graduationStatus === 'graduated').length;
    const placedScholars = filteredScholars.filter(s => s.jobPlacement?.verified).length;

    // Calculate costs
    const costPerScholar = totalScholars > 0 ? totalInvestment / totalScholars : 0;
    const costPerGraduate = graduatedScholars > 0 ? totalInvestment / graduatedScholars : 0;
    const costPerJobPlacement = placedScholars > 0 ? totalInvestment / placedScholars : 0;

    // Calculate ROI (simplified: based on job placements and graduations)
    // Value created = graduates * avg salary + placed * avg salary
    const avgSalary = 850000; // Mock average salary
    const valueCreated = (graduatedScholars * avgSalary * 0.5) + (placedScholars * avgSalary);
    const overallROI = totalInvestment > 0 ? ((valueCreated / totalInvestment) * 100) : 0;

    // ROI by campaign
    const roiByCampaign: Record<string, number> = {};
    campaigns.forEach(campaign => {
      const campaignScholars = scholars.filter(s => s.campaignId === campaign.id);
      const campaignTransfers = transfers.filter(t => t.campaignId === campaign.id && t.status === 'confirmed');
      const campaignInvestment = campaignTransfers.reduce((sum, t) => sum + t.amount, 0);
      const campaignGraduated = campaignScholars.filter(s => s.graduationStatus === 'graduated').length;
      const campaignPlaced = campaignScholars.filter(s => s.jobPlacement?.verified).length;
      const campaignValueCreated = (campaignGraduated * avgSalary * 0.5) + (campaignPlaced * avgSalary);
      roiByCampaign[campaign.id] = campaignInvestment > 0
        ? ((campaignValueCreated / campaignInvestment) * 100)
        : 0;
    });

    setRoiData({
      totalInvestment,
      costPerScholar: Math.round(costPerScholar),
      costPerGraduate: Math.round(costPerGraduate),
      costPerJobPlacement: Math.round(costPerJobPlacement),
      overallROI: Math.round(overallROI),
      roiByCampaign,
      livesChanged: totalScholars,
      jobsCreated: placedScholars,
      graduatesProduced: graduatedScholars,
    });
  }, [providerId, campaignId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            ROI Analysis
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Financial Metrics
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                  <p className="text-3xl font-bold text-foreground">
                    ₹{(roiData.totalInvestment / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cost per Scholar</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(roiData.costPerScholar / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cost per Graduate</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(roiData.costPerGraduate / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cost per Job Placement</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(roiData.costPerJobPlacement / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall ROI</p>
                    <p className="text-2xl font-bold text-green-600">{roiData.overallROI}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Impact Metrics
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Lives Changed</p>
                    <p className="text-3xl font-bold text-foreground">{roiData.livesChanged}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Jobs Created</p>
                    <p className="text-3xl font-bold text-foreground">{roiData.jobsCreated}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Graduates Produced</p>
                    <p className="text-3xl font-bold text-foreground">{roiData.graduatesProduced}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>ROI Visualization</p>
              <p className="text-sm">Chart visualization will be implemented</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
