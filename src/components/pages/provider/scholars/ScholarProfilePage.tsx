"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { StatCard } from '@/components/provider/common/StatCard';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ProgressGrowthTab } from './components/tabs/ProgressGrowthTab';
import { JobPlacementTab } from './components/tabs/JobPlacementTab';
import { GraduationTab } from './components/tabs/GraduationTab';
import { FinancialsTab } from './components/tabs/FinancialsTab';
import { CommunicationsTab } from './components/tabs/CommunicationsTab';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Award,
  Mail,
  Phone,
  DollarSign,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { providerService, scholarService, Scholar } from '@/data/mock/providerData';

type Tab = 'overview' | 'progress' | 'job' | 'graduation' | 'financials' | 'communications';

interface ScholarProfilePageProps {
  scholarId: string;
}

export function ScholarProfilePage({ scholarId }: ScholarProfilePageProps) {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [scholar, setScholar] = useState<Scholar | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        const newProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(newProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    const foundScholar = scholarService.getById(scholarId);
    setScholar(foundScholar);
    setLoading(false);
  }, [provider, router, scholarId]);

  if (loading) {
    return (
      <Layout title="Scholar Profile" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!scholar) {
    return (
      <Layout title="Scholar Profile" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Scholar not found</p>
        </div>
      </Layout>
    );
  }

  const cgpaImprovement = scholar.currentCGPA
    ? scholar.currentCGPA - scholar.baselineCGPA
    : 0;
  const progressPercentage = scholar.enrollments.length > 0
    ? scholar.enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / scholar.enrollments.length
    : 0;

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'progress' as Tab, label: 'Progress & Growth', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'job' as Tab, label: 'Job Placement', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'graduation' as Tab, label: 'Graduation & Certification', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'financials' as Tab, label: 'Financials', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'communications' as Tab, label: 'Communications', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <Layout title={scholar.profile.name} role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {scholar.profile.photo ? (
                  <img src={scholar.profile.photo} alt={scholar.profile.name} className="w-16 h-16 rounded-full" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{scholar.profile.name}</h1>
                <p className="text-muted-foreground mt-1">{scholar.profile.email}</p>
              </div>
            </div>
          </div>
          <StatusBadge status={scholar.awardStatus} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Current CGPA"
            value={scholar.currentCGPA?.toFixed(2) || scholar.baselineCGPA.toFixed(2)}
            icon={<TrendingUp className="w-6 h-6" />}
            change={cgpaImprovement > 0 ? Math.round(cgpaImprovement * 100) / 100 : undefined}
            changeLabel="improvement"
            trend={cgpaImprovement > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Course Progress"
            value={`${Math.round(progressPercentage)}%`}
            icon={<GraduationCap className="w-6 h-6" />}
          />
          <StatCard
            title="Award Amount"
            value={`₹${(scholar.awardAmount / 1000).toFixed(0)}K`}
            icon={<Award className="w-6 h-6" />}
          />
          <StatCard
            title="Achievements"
            value={scholar.achievements.length}
            icon={<Award className="w-6 h-6" />}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab scholar={scholar} />}
          {activeTab === 'progress' && <ProgressGrowthTab scholar={scholar} />}
          {activeTab === 'job' && <JobPlacementTab scholar={scholar} />}
          {activeTab === 'graduation' && <GraduationTab scholar={scholar} />}
          {activeTab === 'financials' && <FinancialsTab scholar={scholar} />}
          {activeTab === 'communications' && <CommunicationsTab scholar={scholar} />}
        </div>
      </div>
    </Layout>
  );
}

