"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { GraduationCap, Award, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { scholarService } from '@/data/mock/providerData';
import { Scholar } from '@/data/mock/providerData';

interface GraduationRatesProps {
  providerId?: string;
  campaignId?: string;
  detailed?: boolean;
}

export function GraduationRates({ providerId, campaignId, detailed = false }: GraduationRatesProps) {
  const [stats, setStats] = useState({
    graduationRate: 0,
    totalGraduated: 0,
    averageGraduationCGPA: 0,
    averageTimeToGraduation: 0,
    graduationsByCourse: {} as Record<string, number>,
    topGraduates: [] as Scholar[],
  });

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    const graduatedScholars = filteredScholars.filter(s => s.graduationStatus === 'graduated');
    const totalScholars = filteredScholars.length;

    // Calculate graduation rate
    const graduationRate = totalScholars > 0
      ? (graduatedScholars.length / totalScholars) * 100
      : 0;

    // Calculate average graduation CGPA
    const graduationCGPAs = graduatedScholars
      .map(s => s.graduationCGPA)
      .filter((cgpa): cgpa is number => cgpa !== undefined);
    const averageGraduationCGPA = graduationCGPAs.length > 0
      ? graduationCGPAs.reduce((sum, cgpa) => sum + cgpa, 0) / graduationCGPAs.length
      : 0;

    // Calculate average time to graduation (days from award date to graduation date)
    const graduationsWithDates = graduatedScholars.filter(s => s.graduationDate && s.awardDate);
    const averageTimeToGraduation = graduationsWithDates.length > 0
      ? graduationsWithDates.reduce((sum, s) => {
          const awardDate = new Date(s.awardDate);
          const graduationDate = new Date(s.graduationDate!);
          const days = Math.floor((graduationDate.getTime() - awardDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / graduationsWithDates.length
      : 0;

    // Graduations by course
    const graduationsByCourse: Record<string, number> = {};
    graduatedScholars.forEach(s => {
      s.enrollments?.forEach(e => {
        graduationsByCourse[e.courseId] = (graduationsByCourse[e.courseId] || 0) + 1;
      });
    });

    // Top graduates (by CGPA)
    const topGraduates = [...graduatedScholars]
      .filter(s => s.graduationCGPA)
      .sort((a, b) => (b.graduationCGPA || 0) - (a.graduationCGPA || 0))
      .slice(0, 5);

    setStats({
      graduationRate: Math.round(graduationRate * 10) / 10,
      totalGraduated: graduatedScholars.length,
      averageGraduationCGPA: Math.round(averageGraduationCGPA * 10) / 10,
      averageTimeToGraduation: Math.round(averageTimeToGraduation),
      graduationsByCourse,
      topGraduates,
    });
  }, [providerId, campaignId]);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Graduation Statistics
        </h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Graduation Rate</p>
            <p className="text-3xl font-bold text-foreground">{stats.graduationRate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Graduated</p>
            <p className="text-3xl font-bold text-foreground">{stats.totalGraduated}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Graduation CGPA</p>
            <p className="text-3xl font-bold text-foreground">{stats.averageGraduationCGPA || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Time to Graduation</p>
            <p className="text-3xl font-bold text-foreground">{stats.averageTimeToGraduation} days</p>
          </div>
        </div>

        {detailed && (
          <>
            <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Graduation Trends Chart</p>
                <p className="text-sm">Chart visualization will be implemented</p>
              </div>
            </div>

            {stats.topGraduates.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Top Graduates
                </h4>
                <div className="space-y-2">
                  {stats.topGraduates.map((scholar, index) => (
                    <div key={scholar.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{scholar.profile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Graduated: {scholar.graduationDate ? new Date(scholar.graduationDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">CGPA: {scholar.graduationCGPA?.toFixed(1)}</p>
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
  );
}
