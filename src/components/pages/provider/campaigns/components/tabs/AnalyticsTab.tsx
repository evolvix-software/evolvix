"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { BarChart3, TrendingUp, Users, FileText, Award, Wallet } from 'lucide-react';

interface AnalyticsTabProps {
  campaignId: string;
  providerId: string;
}

export function AnalyticsTab({ campaignId, providerId }: AnalyticsTabProps) {
  // Mock analytics data - replace with actual API call
  const analytics = {
    applicationMetrics: {
      views: 1250,
      applications: 85,
      conversionRate: 6.8,
    },
    awardMetrics: {
      awardsMade: 12,
      acceptanceRate: 14.1,
    },
    scholarMetrics: {
      active: 10,
      graduated: 2,
      placed: 1,
    },
    financialMetrics: {
      funded: 600000,
      disbursed: 500000,
      roi: 120,
    },
    impactMetrics: {
      graduationRate: 20,
      placementRate: 10,
      cgpaImprovement: 0.8,
    },
  };

  return (
    <div className="space-y-6">
      {/* Application Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Campaign Views</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.applicationMetrics.views.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.applicationMetrics.applications}
                </p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.applicationMetrics.conversionRate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Award Metrics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Award Metrics</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Awards Made</p>
              <p className="text-3xl font-bold text-foreground">{analytics.awardMetrics.awardsMade}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {analytics.awardMetrics.acceptanceRate}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scholar Metrics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Scholar Metrics</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Scholars</p>
              <p className="text-3xl font-bold text-foreground">{analytics.scholarMetrics.active}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Graduated</p>
              <p className="text-3xl font-bold text-foreground">{analytics.scholarMetrics.graduated}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Job Placed</p>
              <p className="text-3xl font-bold text-foreground">{analytics.scholarMetrics.placed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Financial Metrics</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Funded</p>
              <p className="text-3xl font-bold text-foreground">
                ₹{(analytics.financialMetrics.funded / 100000).toFixed(1)}L
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Disbursed</p>
              <p className="text-3xl font-bold text-foreground">
                ₹{(analytics.financialMetrics.disbursed / 100000).toFixed(1)}L
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-3xl font-bold text-foreground">{analytics.financialMetrics.roi}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Impact Metrics</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Graduation Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {analytics.impactMetrics.graduationRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Placement Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {analytics.impactMetrics.placementRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">CGPA Improvement</p>
              <p className="text-3xl font-bold text-foreground">
                +{analytics.impactMetrics.cgpaImprovement}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

