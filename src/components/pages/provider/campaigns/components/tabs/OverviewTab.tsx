"use client";

import { Campaign, courseService, Course } from '@/data/mock/providerData';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { Calendar, Users, Wallet, FileText, Award, ExternalLink, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OverviewTabProps {
  campaign: Campaign;
}

export function OverviewTab({ campaign }: OverviewTabProps) {
  const router = useRouter();

  const isOpen =
    new Date(campaign.applicationOpenDate) <= new Date() &&
    new Date(campaign.applicationCloseDate) >= new Date() &&
    campaign.status === 'open';

  const daysRemaining = isOpen
    ? Math.ceil(
        (new Date(campaign.applicationCloseDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Campaign Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Campaign Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <StatusBadge status={campaign.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <p className="text-foreground capitalize">{campaign.campaignType.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Award Type</p>
              <p className="text-foreground capitalize">{campaign.awardType}</p>
            </div>
            {campaign.partialAmount && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Partial Amount</p>
                <p className="text-foreground">₹{campaign.partialAmount.toLocaleString('en-IN')}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-foreground whitespace-pre-wrap">{campaign.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Application Window</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Open Date
              </p>
              <p className="text-foreground">
                {new Date(campaign.applicationOpenDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Close Date
              </p>
              <p className="text-foreground">
                {new Date(campaign.applicationCloseDate).toLocaleDateString()}
              </p>
            </div>
            {isOpen && daysRemaining !== null && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {daysRemaining} days remaining
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Eligibility Rules</p>
              <div className="space-y-2">
                {campaign.eligibilityRules.minCGPA && (
                  <p className="text-sm text-foreground">
                    Min CGPA: {campaign.eligibilityRules.minCGPA}
                  </p>
                )}
                {campaign.eligibilityRules.maxCGPA && (
                  <p className="text-sm text-foreground">
                    Max CGPA: {campaign.eligibilityRules.maxCGPA}
                  </p>
                )}
                {campaign.eligibilityRules.meritBased && (
                  <p className="text-sm text-foreground">Merit-Based</p>
                )}
                {campaign.eligibilityRules.needBased && (
                  <p className="text-sm text-foreground">Need-Based</p>
                )}
                {campaign.eligibilityRules.financialNeedRequired && (
                  <p className="text-sm text-foreground">Financial Need Required</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linked Courses */}
      {campaign.linkedCourseIds && campaign.linkedCourseIds.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Linked Courses</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaign.linkedCourseIds.map((courseId) => {
                const course = courseService.getById(courseId);
                if (!course) return null;
                return (
                  <div
                    key={courseId}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => router.push(`/portal/provider/programs/${courseId}`)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{course.scholarshipSlotsAvailable} slots available</span>
                          <span>{course.enrolledCount || 0} enrolled</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => router.push(`/portal/provider/campaigns/${campaign.id}/applications`)}
              className="flex-1"
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Applications
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/portal/provider/scholars?campaign=${campaign.id}`)}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              View Scholars
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/portal/provider/campaigns/${campaign.id}?tab=analytics`)}
              className="flex-1"
            >
              <Award className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/portal/provider/funds?campaign=${campaign.id}`)}
              className="flex-1"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Transfer Funds
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

