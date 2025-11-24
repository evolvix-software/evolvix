"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { Scholar } from '@/data/mock/providerData';
import { User, Mail, Phone, MapPin, Linkedin, Award, Calendar, TrendingUp, Briefcase, GraduationCap, MessageSquare, FileText, Calendar as CalendarIcon } from 'lucide-react';

interface OverviewTabProps {
  scholar: Scholar;
}

export function OverviewTab({ scholar }: OverviewTabProps) {
  const cgpaImprovement = scholar.currentCGPA
    ? scholar.currentCGPA - scholar.baselineCGPA
    : 0;
  const progressPercentage = scholar.enrollments.length > 0
    ? scholar.enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / scholar.enrollments.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {scholar.profile.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground font-medium">{scholar.profile.location}</p>
                  </div>
                </div>
              )}
              {scholar.profile.linkedinUrl && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a
                      href={scholar.profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Award Status</p>
                <StatusBadge status={scholar.awardStatus} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Award Date</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {new Date(scholar.awardDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Award Amount</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  ₹{scholar.awardAmount.toLocaleString('en-IN')} ({scholar.awardType})
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progress</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(progressPercentage)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current CGPA</p>
                <p className="text-2xl font-bold text-foreground">
                  {scholar.currentCGPA?.toFixed(2) || scholar.baselineCGPA.toFixed(2)}
                </p>
                {cgpaImprovement > 0 && (
                  <p className="text-xs text-green-600 mt-1">+{cgpaImprovement.toFixed(2)} improvement</p>
                )}
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Job Status</p>
                <p className="text-lg font-bold text-foreground">
                  {scholar.jobPlacement?.verified ? 'Placed' : 'Not Placed'}
                </p>
                {scholar.jobPlacement && (
                  <p className="text-xs text-muted-foreground mt-1">{scholar.jobPlacement.companyName}</p>
                )}
              </div>
              <Briefcase className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Graduation Status</p>
                <p className="text-lg font-bold text-foreground capitalize">
                  {scholar.graduationStatus.replace('-', ' ')}
                </p>
                {scholar.graduationDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(scholar.graduationDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Add Note
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Schedule Review
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Update Job Placement
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Record Graduation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

