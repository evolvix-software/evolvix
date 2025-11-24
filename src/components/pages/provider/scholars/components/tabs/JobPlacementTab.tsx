"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { Scholar } from '@/data/mock/providerData';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, CheckCircle, Award, Share2, Linkedin } from 'lucide-react';

interface JobPlacementTabProps {
  scholar: Scholar;
}

export function JobPlacementTab({ scholar }: JobPlacementTabProps) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleVerifyPlacement = () => {
    // TODO: Implement verification
    alert('Placement verification will be implemented');
  };

  const handleCelebrate = () => {
    // TODO: Implement celebration
    alert('Success celebration will be implemented');
  };

  if (!scholar.jobPlacement) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Job Placement Recorded</h3>
          <p className="text-muted-foreground mb-6">
            This scholar has not been placed yet. Update their job placement information when available.
          </p>
          <Button onClick={() => setShowUpdateForm(true)}>
            Update Job Placement
          </Button>
        </CardContent>
      </Card>
    );
  }

  const placement = scholar.jobPlacement;

  return (
    <div className="space-y-6">
      {/* Job Placement Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Placement Details
            </h3>
            {placement.verified && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Title
              </p>
              <p className="text-lg font-semibold text-foreground">{placement.jobTitle}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Name
              </p>
              <p className="text-lg font-semibold text-foreground">{placement.companyName}</p>
            </div>
            {placement.location && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </p>
                <p className="text-foreground">{placement.location}</p>
              </div>
            )}
            {placement.salary && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Salary
                </p>
                <p className="text-lg font-semibold text-foreground">
                  ₹{placement.salary.amount.toLocaleString('en-IN')} / {placement.salary.period}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </p>
              <p className="text-foreground">{new Date(placement.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <StatusBadge status={placement.status} />
            </div>
          </div>

          {scholar.profile.linkedinUrl && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">LinkedIn Profile</span>
                </div>
                <a
                  href={scholar.profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View Profile
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowUpdateForm(true)}>
              Update Job Details
            </Button>
            {!placement.verified && (
              <Button variant="outline" onClick={handleVerifyPlacement}>
                Verify Placement
              </Button>
            )}
            <Button variant="outline" onClick={handleCelebrate} className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Celebrate Achievement
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Achievement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placement Timeline */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Placement Timeline</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-foreground">Job Started</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(placement.startDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started position at {placement.companyName}
                </p>
              </div>
            </div>
            {placement.verified && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-foreground">Placement Verified</h4>
                    <span className="text-xs text-muted-foreground">Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placement has been verified and confirmed
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Celebration */}
      {placement.verified && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5" />
              Success Celebration
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Congratulations! {scholar.profile.name} has successfully been placed at {placement.companyName}.
              This achievement has been added to success stories and impact metrics.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleCelebrate} className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Generate Achievement Badge
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share on Social Media
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

