"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Download, User, Mail, Phone, MapPin, GraduationCap, Calendar, ExternalLink, BookOpen, DollarSign } from 'lucide-react';
import { mockApplications } from '@/data/mock/providerApplicationsData';
import { Application } from '@/interfaces/providerApplications';
import { StatusBadge } from './components/StatusBadge';
import { courseService } from '@/data/mock/providerData';

interface ApplicationDetailPageProps {
    applicationId?: string;
}

export function ApplicationDetailPage({ applicationId }: ApplicationDetailPageProps) {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [formattedDate, setFormattedDate] = useState<string>('');

    // determine id from prop, route params or pathname fallback
    const resolvedId = (
        applicationId ??
        (params as any)?.applicationId ??
        (params as any)?.id ??
        pathname?.split('/').filter(Boolean).pop()
    ) ?? '';

    const normalizedId = resolvedId ? String(resolvedId).toUpperCase() : '';

    useEffect(() => {
        if (!normalizedId) {
            setApplication(null);
            setLoading(false);
            return;
        }

        const foundApp = mockApplications.find(app => String(app.id).toUpperCase() === normalizedId);

        setLoading(true);
        const t = setTimeout(() => {
            setApplication(foundApp || null);
            setLoading(false);
        }, 500);

        return () => clearTimeout(t);
    }, [normalizedId]);

    useEffect(() => {
        if (application?.submittedAt) {
            const dateStr = new Date(application.submittedAt).toLocaleDateString();
            setFormattedDate(dateStr);
        } else {
            setFormattedDate('');
        }
    }, [application?.submittedAt]);

    // Get course details if courseId exists
    const course = application?.courseId ? courseService.getById(application.courseId) : null;

    if (loading) {
        return (
            <Layout title="Application Details" role="provider" noCard>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    if (!application) {
        return (
            <Layout title="Application Details" role="provider" noCard>
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold">Application Not Found</h2>
                    <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`Application: ${application.id}`} role="provider" noCard>
            <div className="p-6 max-w-[1600px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-4">
                            {application.studentAvatar && (
                                <img
                                    src={application.studentAvatar}
                                    alt={application.studentName}
                                    className="w-16 h-16 rounded-full border-2 border-primary"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{application.studentName}</h1>
                                <p className="text-muted-foreground">{application.campaignName}</p>
                            </div>
                        </div>
                        <StatusBadge status={application.status} />
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Shortlist
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Student Info & Documents */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Student Profile */}
                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Student Profile
                                </CardTitle>
                                <Link href={`/portal/provider/scholars/${application.studentId}`}>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        View Full Profile
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                            <User className="w-4 h-4" />
                                            Student ID
                                        </p>
                                        <p className="font-medium">{application.studentId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </p>
                                        <p className="font-medium">{application.studentEmail}</p>
                                    </div>
                                    {application.studentPhone && (
                                        <div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                                <Phone className="w-4 h-4" />
                                                Phone
                                            </p>
                                            <p className="font-medium">{application.studentPhone}</p>
                                        </div>
                                    )}
                                    {application.studentLocation && (
                                        <div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                                <MapPin className="w-4 h-4" />
                                                Location
                                            </p>
                                            <p className="font-medium">{application.studentLocation}</p>
                                        </div>
                                    )}
                                    {application.studentInstitution && (
                                        <div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                                <GraduationCap className="w-4 h-4" />
                                                Institution
                                            </p>
                                            <p className="font-medium">{application.studentInstitution}</p>
                                        </div>
                                    )}
                                    {application.studentGraduationYear && (
                                        <div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                                <Calendar className="w-4 h-4" />
                                                Graduation Year
                                            </p>
                                            <p className="font-medium">{application.studentGraduationYear}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">CGPA</p>
                                        <p className="font-medium text-lg text-primary">{application.cgpa} / 10.0</p>
                                    </div>
                                    {application.familyIncome && (
                                        <div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                                <DollarSign className="w-4 h-4" />
                                                Family Income
                                            </p>
                                            <p className="font-medium">₹{application.familyIncome.toLocaleString('en-IN')} / year</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Submitted At</p>
                                        <p className="font-medium">{formattedDate}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Information */}
                        {course && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Applied Course
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Course Name</p>
                                            <p className="font-semibold text-lg">{course.title}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                                                <p className="font-medium">{course.instructor}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                                                <p className="font-medium">{course.duration}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Course Fee</p>
                                                <p className="font-medium">₹{course.price.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Scholarship Slots</p>
                                                <p className="font-medium">{course.scholarshipSlotsAvailable} / {course.scholarshipSlots} available</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                                            <p className="text-sm">{course.description}</p>
                                        </div>
                                        <Link href={`/portal/provider/programs/${course.id}`}>
                                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                                View Course Details
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Scholarship Justification */}
                        {application.scholarshipJustification && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Scholarship Justification</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{application.scholarshipJustification}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {application.documents.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">No documents uploaded.</p>
                                    ) : (
                                        application.documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <div className="p-2 bg-primary/10 rounded">
                                                        <FileText className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{doc.name}</p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className="text-xs text-muted-foreground uppercase">{doc.type.replace('_', ' ')}</span>
                                                            <StatusBadge status={doc.status} type="verification" />
                                                        </div>
                                                        {doc.notes && (
                                                            <p className="text-xs text-muted-foreground mt-1">{doc.notes}</p>
                                                        )}
                                                        {doc.verifiedAt && (
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Verified by {doc.verifiedBy} on {new Date(doc.verifiedAt).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    {doc.status !== 'verified' && (
                                                        <Button variant="outline" size="sm">
                                                            Verify
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Review & Scoring */}
                    <div className="space-y-6">
                        {/* Review Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Review Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Verification</span>
                                        <span className="text-sm text-muted-foreground capitalize">{application.verificationStatus.replace('_', ' ')}</span>
                                    </div>
                                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${
                                                application.verificationStatus === 'completed' 
                                                    ? 'bg-green-500' 
                                                    : application.verificationStatus === 'in_progress'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-gray-500'
                                            }`}
                                            style={{ 
                                                width: application.verificationStatus === 'completed' 
                                                    ? '100%' 
                                                    : application.verificationStatus === 'in_progress'
                                                    ? '50%'
                                                    : '25%'
                                            }}
                                        />
                                    </div>
                                </div>

                                {application.flags.length > 0 && (
                                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                                        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 flex items-center mb-2">
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Flags ({application.flags.length})
                                        </h4>
                                        <ul className="space-y-1">
                                            {application.flags.map(flag => (
                                                <li key={flag.id} className="text-xs text-yellow-700 dark:text-yellow-400">
                                                    • {flag.message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Scoring */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Scoring</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {application.totalScore ? (
                                    <div className="space-y-4">
                                        <div className="text-center py-4">
                                            <div className="text-4xl font-bold text-primary mb-1">{application.totalScore}</div>
                                            <p className="text-sm text-muted-foreground">Total Score</p>
                                            {application.ranking && (
                                                <p className="text-xs text-muted-foreground mt-1">Ranking: #{application.ranking}</p>
                                            )}
                                        </div>
                                        {application.reviewerScores.length > 0 && (
                                            <div className="space-y-3 pt-4 border-t">
                                                {application.reviewerScores.map((score, idx) => (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Academic</span>
                                                            <span className="font-medium">{score.academicScore}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Financial Need</span>
                                                            <span className="font-medium">{score.financialScore}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Motivation</span>
                                                            <span className="font-medium">{score.motivationScore}</span>
                                                        </div>
                                                        {score.notes && (
                                                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                                                                <p className="font-medium mb-1">Reviewer Notes:</p>
                                                                <p className="text-muted-foreground">{score.notes}</p>
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Reviewed by {score.reviewerName} on {new Date(score.submittedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Not yet scored
                                    </div>
                                )}
                                <Button className="w-full mt-4">
                                    Open Scorecard
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
