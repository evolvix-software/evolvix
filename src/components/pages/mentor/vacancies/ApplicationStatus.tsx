"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { CourseVacancy, CourseApplication } from '@/data/mock/coursesData';
import { mockVacancies, mockApplications } from '@/data/mock/vacanciesData';
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, DollarSign, Users, Calendar, AlertCircle } from 'lucide-react';

export function ApplicationStatus() {
  const params = useParams();
  const router = useRouter();
  const vacancyId = params.id as string;

  const [vacancy, setVacancy] = useState<CourseVacancy | null>(null);
  const [application, setApplication] = useState<CourseApplication | null>(null);
  const [mentorId, setMentorId] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || 'mentor_1');
    }

    const foundVacancy = mockVacancies.find(v => v.id === vacancyId);
    const foundApplication = mockApplications.find(
      app => app.vacancyId === vacancyId && app.mentorId === mentorId
    );

    if (foundVacancy) {
      setVacancy(foundVacancy);
    }
    if (foundApplication) {
      setApplication(foundApplication);
    }
  }, [vacancyId, mentorId]);

  if (!vacancy || !application) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Loading application...</h2>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (application.status) {
      case 'accepted':
        return <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getStatusColor = () => {
    switch (application.status) {
      case 'accepted':
        return 'text-green-600 dark:text-green-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getStatusBadge = () => {
    switch (application.status) {
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'verified':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push('/portal/mentor/vacancies')}
          className="border-border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vacancies
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Application Status</h1>
          <p className="text-muted-foreground">View your application details and status</p>
        </div>
      </div>

      {/* Status Card */}
      <Card className="border border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">Application {application.status.charAt(0).toUpperCase() + application.status.slice(1)}</h2>
              <p className="text-muted-foreground">
                {application.status === 'pending' && 'Your application is under review by admin'}
                {application.status === 'accepted' && 'Congratulations! Your application has been accepted'}
                {application.status === 'verified' && 'Your qualifications and demo class have been verified'}
                {application.status === 'rejected' && 'Unfortunately, your application was not selected'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge()}`}>
              {application.status === 'accepted' ? 'Accepted' : 
               application.status === 'verified' ? 'Verified' :
               application.status === 'rejected' ? 'Rejected' : 'Pending Review'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Vacancy Details */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle>Vacancy Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">{vacancy.title}</h3>
              <p className="text-sm text-muted-foreground">{vacancy.description}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{vacancy.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Course Pricing</p>
                  <p className="font-medium text-foreground">${vacancy.adminPricing.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Your Commission</p>
                  <p className="font-medium text-foreground">{vacancy.commissionSplit.mentor}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle>Your Application</CardTitle>
          <CardDescription>Submitted on {new Date(application.createdAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Experience</h4>
            <p className="text-sm text-muted-foreground">{application.experience}</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Cover Letter</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{application.coverLetter}</p>
          </div>
          {application.portfolio && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Portfolio</h4>
              <a
                href={application.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center space-x-1"
              >
                <FileText className="w-4 h-4" />
                <span>View Portfolio</span>
              </a>
            </div>
          )}
          {application.qualifications && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Qualifications</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{application.qualifications}</p>
            </div>
          )}
          {(application.demoClassUrl || application.demoClassFile) && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Demo Class</h4>
              {application.demoClassUrl ? (
                <a
                  href={application.demoClassUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Watch Demo Class</span>
                </a>
              ) : application.demoClassFile ? (
                <a
                  href={application.demoClassFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Demo Class</span>
                </a>
              ) : null}
            </div>
          )}
          {application.adminNotes && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Admin Notes</span>
              </h4>
              <p className="text-sm text-muted-foreground">{application.adminNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      {application.status === 'accepted' && (
        <Card className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">Application Accepted!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                Congratulations! Your application has been accepted. Admin has verified your qualifications and demo class.
              </p>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                Next Step: Create Your Course Gig
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Now you can create your course content. Once submitted, admin will verify it, set the pricing, and send you a contract.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => router.push(`/portal/mentor/courses?createBundle=true&vacancyId=${vacancyId}&applicationId=${application.id}`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Course Gig
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {application.status === 'verified' && (
        <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Verified & Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your qualifications and demo class have been verified by admin. You can now create your course gig.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => router.push(`/portal/mentor/courses?createBundle=true&vacancyId=${vacancyId}&applicationId=${application.id}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Course Gig
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {application.status === 'rejected' && (
        <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">Application Not Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Thank you for your interest. Unfortunately, your application was not selected for this vacancy.
              You can apply for other available vacancies or improve your application and try again in the future.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/portal/mentor/vacancies')}
              className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
            >
              Browse Other Vacancies
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

