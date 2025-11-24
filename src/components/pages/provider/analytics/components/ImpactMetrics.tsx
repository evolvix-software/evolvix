"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Users, GraduationCap, Briefcase, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import { scholarService, transferService } from '@/data/mock/providerData';

interface ImpactMetricsProps {
  providerId?: string;
  campaignId?: string;
}

export function ImpactMetrics({ providerId, campaignId }: ImpactMetricsProps) {
  const [metrics, setMetrics] = useState({
    totalScholars: 0,
    graduationRate: 0,
    jobPlacementRate: 0,
    averageCGPAImprovement: 0,
    totalInvestment: 0,
    roi: 0,
    livesChanged: 0,
    jobsCreated: 0,
  });

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const transfers = transferService.getAll(providerId);

    // Filter by campaign if specified
    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    const totalScholars = filteredScholars.length;
    const graduatedScholars = filteredScholars.filter(s => s.graduationStatus === 'graduated').length;
    const placedScholars = filteredScholars.filter(s => s.jobPlacement?.verified).length;
    
    // Calculate CGPA improvement
    const scholarsWithImprovement = filteredScholars.filter(s => s.currentCGPA && s.baselineCGPA);
    const averageCGPAImprovement = scholarsWithImprovement.length > 0
      ? scholarsWithImprovement.reduce((sum, s) => {
          const improvement = (s.currentCGPA || s.baselineCGPA) - s.baselineCGPA;
          return sum + improvement;
        }, 0) / scholarsWithImprovement.length
      : 0;

    // Calculate total investment
    const totalInvestment = transfers
      .filter(t => t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate ROI (simplified: based on job placements and graduations)
    const costPerScholar = totalScholars > 0 ? totalInvestment / totalScholars : 0;
    const costPerGraduate = graduatedScholars > 0 ? totalInvestment / graduatedScholars : 0;
    const costPerJobPlacement = placedScholars > 0 ? totalInvestment / placedScholars : 0;
    
    // Simple ROI calculation: (value created / investment) * 100
    // Value created = graduates * avg salary + placed * avg salary
    const avgSalary = 850000; // Mock average salary
    const valueCreated = (graduatedScholars * avgSalary * 0.5) + (placedScholars * avgSalary);
    const roi = totalInvestment > 0 ? ((valueCreated / totalInvestment) * 100) : 0;

    setMetrics({
      totalScholars,
      graduationRate: totalScholars > 0 ? (graduatedScholars / totalScholars) * 100 : 0,
      jobPlacementRate: totalScholars > 0 ? (placedScholars / totalScholars) * 100 : 0,
      averageCGPAImprovement: Math.round(averageCGPAImprovement * 10) / 10,
      totalInvestment,
      roi: Math.round(roi),
      livesChanged: totalScholars,
      jobsCreated: placedScholars,
    });
  }, [providerId, campaignId]);

  const metricCards = [
    {
      label: 'Total Scholars',
      value: metrics.totalScholars,
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Graduation Rate',
      value: `${metrics.graduationRate}%`,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Job Placement Rate',
      value: `${metrics.jobPlacementRate}%`,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'CGPA Improvement',
      value: `+${metrics.averageCGPAImprovement}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      label: 'Total Investment',
      value: `₹${(metrics.totalInvestment / 100000).toFixed(1)}L`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      label: 'ROI',
      value: `${metrics.roi}%`,
      icon: <Target className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${metric.bgColor} ${metric.color}`}>
                {metric.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

