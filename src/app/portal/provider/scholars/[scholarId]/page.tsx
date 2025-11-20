"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { StatCard } from '@/components/provider/common/StatCard';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Award,
  Mail,
  Phone,
} from 'lucide-react';
import { providerService, scholarService, Scholar } from '@/data/mock/providerData';

export default function ScholarProfilePage() {
  const router = useRouter();
  const params = useParams();
  const scholarId = params.scholarId as string;
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [scholar, setScholar] = useState<Scholar | null>(null);

  useEffect(() => {
    // If no provider exists, create one from registration data
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
  }, [provider, router, scholarId]);

  if (!scholar) {
    return (
      <Layout title="Scholar Profile" role="provider">
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

  return (
    <Layout title={scholar.profile.name} role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{scholar.profile.name}</h1>
              <p className="text-muted-foreground mt-1">Scholar Profile</p>
            </div>
          </div>
          <StatusBadge status={scholar.awardStatus} />
        </div>

        {/* Stats */}
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

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-foreground font-medium">{scholar.profile.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">{scholar.profile.email}</p>
                </div>
              </div>
              {scholar.profile.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-foreground font-medium">{scholar.profile.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Academic Progress</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Baseline CGPA</p>
                <p className="text-2xl font-bold text-foreground">
                  {scholar.baselineCGPA.toFixed(2)}
                </p>
              </div>
              {scholar.currentCGPA && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current CGPA</p>
                  <p className="text-2xl font-bold text-primary">
                    {scholar.currentCGPA.toFixed(2)}
                  </p>
                </div>
              )}
              {scholar.graduationStatus === 'graduated' && scholar.graduationCGPA && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Graduation CGPA</p>
                  <p className="text-2xl font-bold text-success">
                    {scholar.graduationCGPA.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Job Placement */}
        {scholar.jobPlacement && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Job Placement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Job Title</p>
                <p className="text-foreground font-medium">{scholar.jobPlacement.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Company</p>
                <p className="text-foreground font-medium">{scholar.jobPlacement.companyName}</p>
              </div>
              {scholar.jobPlacement.salary && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Salary</p>
                  <p className="text-foreground font-medium">
                    ₹{scholar.jobPlacement.salary.amount.toLocaleString()} / {scholar.jobPlacement.salary.period}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <StatusBadge status={scholar.jobPlacement.status} />
              </div>
            </div>
          </Card>
        )}

        {/* Achievements */}
        {scholar.achievements.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scholar.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border border-border rounded-lg bg-primary/5"
                >
                  <p className="font-medium text-foreground">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

