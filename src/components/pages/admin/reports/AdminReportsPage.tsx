"use client";

import { useState } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { FileText, Calendar, BarChart3, DollarSign, Award, Plus } from 'lucide-react';
import { CampaignReportsTab } from './components/CampaignReportsTab';
import { ScholarReportsTab } from './components/ScholarReportsTab';
import { FinancialReportsTab } from './components/FinancialReportsTab';
import { ImpactReportsTab } from './components/ImpactReportsTab';
import { CustomReportBuilder } from './components/CustomReportBuilder';
import { ScheduledReportsTab } from './components/ScheduledReportsTab';

type Tab = 'campaign' | 'scholar' | 'financial' | 'impact' | 'custom' | 'scheduled';

export function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('campaign');

  const tabs = [
    { id: 'campaign' as Tab, label: 'Campaign Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'scholar' as Tab, label: 'Scholar Reports', icon: <Award className="w-4 h-4" /> },
    { id: 'financial' as Tab, label: 'Financial Reports', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'impact' as Tab, label: 'Impact Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'custom' as Tab, label: 'Custom Reports', icon: <Plus className="w-4 h-4" /> },
    { id: 'scheduled' as Tab, label: 'Scheduled Reports', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <Layout title="Reports & Exports" role="admin" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Exports</h1>
            <p className="text-muted-foreground mt-1">
              Generate comprehensive reports on campaigns, scholars, finances, and impact across the entire platform
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
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
          {activeTab === 'campaign' && <CampaignReportsTab />}
          {activeTab === 'scholar' && <ScholarReportsTab />}
          {activeTab === 'financial' && <FinancialReportsTab />}
          {activeTab === 'impact' && <ImpactReportsTab />}
          {activeTab === 'custom' && <CustomReportBuilder />}
          {activeTab === 'scheduled' && <ScheduledReportsTab />}
        </div>
      </div>
    </Layout>
  );
}

