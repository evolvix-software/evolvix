"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { StatCard } from '@/components/provider/common/StatCard';
import {
  TrendingUp,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  DollarSign,
} from 'lucide-react';
import { providerService, campaignService, scholarService, applicationService } from '@/data/mock/providerData';

export default function AnalyticsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [stats, setStats] = useState({
    totalScholars: 0,
    activeScholars: 0,
    graduatedScholars: 0,
    placedScholars: 0,
    graduationRate: 0,
    placementRate: 0,
    averageCGPAImprovement: 0,
    totalInvested: 0,
    costPerGraduate: 0,
    costPerPlacement: 0,
  });

  useEffect(() => {
    // Get or create provider
    let currentProvider = provider;
    
    if (!currentProvider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        currentProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(currentProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    if (!currentProvider) return;

    const campaigns = campaignService.getAll(currentProvider.id);
    const applications = applicationService.getAll(currentProvider.id);
    const scholars = scholarService.getAll(currentProvider.id);

    const activeScholars = scholars.filter(s => s.awardStatus === 'active').length;
    const graduatedScholars = scholars.filter(s => s.graduationStatus === 'graduated').length;
    const placedScholars = scholars.filter(s => s.jobPlacement?.verified).length;

    const totalInvested = scholars.reduce((sum, s) => sum + s.awardAmount, 0);
    const graduationRate = scholars.length > 0 ? (graduatedScholars / scholars.length) * 100 : 0;
    const placementRate = scholars.length > 0 ? (placedScholars / scholars.length) * 100 : 0;

    const cgpaImprovements = scholars
      .filter(s => s.currentCGPA && s.baselineCGPA)
      .map(s => (s.currentCGPA || 0) - s.baselineCGPA);
    const averageCGPAImprovement =
      cgpaImprovements.length > 0
        ? cgpaImprovements.reduce((a, b) => a + b, 0) / cgpaImprovements.length
        : 0;

    const costPerGraduate = graduatedScholars > 0 ? totalInvested / graduatedScholars : 0;
    const costPerPlacement = placedScholars > 0 ? totalInvested / placedScholars : 0;

    setStats({
      totalScholars: scholars.length,
      activeScholars,
      graduatedScholars,
      placedScholars,
      graduationRate: Math.round(graduationRate),
      placementRate: Math.round(placementRate),
      averageCGPAImprovement: Math.round(averageCGPAImprovement * 100) / 100,
      totalInvested,
      costPerGraduate,
      costPerPlacement,
    });
  }, [provider, router]);

  return (
    <Layout title="Analytics" role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Impact</h1>
          <p className="text-muted-foreground mt-1">
            Track scholar growth and measure your impact
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Graduation Rate"
            value={`${stats.graduationRate}%`}
            icon={<GraduationCap className="w-6 h-6" />}
            trend={stats.graduationRate > 50 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Job Placement Rate"
            value={`${stats.placementRate}%`}
            icon={<Briefcase className="w-6 h-6" />}
            trend={stats.placementRate > 50 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Avg CGPA Improvement"
            value={stats.averageCGPAImprovement.toFixed(2)}
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
          />
          <StatCard
            title="Total Invested"
            value={`₹${(stats.totalInvested / 100000).toFixed(1)}L`}
            icon={<DollarSign className="w-6 h-6" />}
          />
        </div>

        {/* Scholar Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Scholars"
            value={stats.totalScholars}
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            title="Graduated"
            value={stats.graduatedScholars}
            icon={<Award className="w-6 h-6" />}
          />
          <StatCard
            title="Job Placed"
            value={stats.placedScholars}
            icon={<Briefcase className="w-6 h-6" />}
          />
        </div>

        {/* ROI Metrics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">ROI Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cost per Graduate</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{stats.costPerGraduate > 0 ? (stats.costPerGraduate / 1000).toFixed(0) : 0}K
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cost per Job Placement</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{stats.costPerPlacement > 0 ? (stats.costPerPlacement / 1000).toFixed(0) : 0}K
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

