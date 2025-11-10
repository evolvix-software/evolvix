"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { CourseVacancy, CourseApplication } from '@/data/mock/coursesData';
import { mockVacancies, mockApplications } from '@/data/mock/vacanciesData';
import { ArrowLeft, Upload, FileText, Send, CheckCircle2 } from 'lucide-react';

export function ApplicationForm() {
  const params = useParams();
  const router = useRouter();
  const vacancyId = params.id as string;

  const [vacancy, setVacancy] = useState<CourseVacancy | null>(null);
  const [mentorInfo, setMentorInfo] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({
    coverLetter: '',
    portfolio: '',
    experience: '',
    qualifications: '',
    demoClassUrl: '',
  });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [demoClassFile, setDemoClassFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const foundVacancy = mockVacancies.find(v => v.id === vacancyId);
    if (foundVacancy) {
      setVacancy(foundVacancy);
    }

    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorInfo({
        name: parsedData.fullName || 'Mentor',
        email: parsedData.email || 'mentor@example.com',
      });
    }
  }, [vacancyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In real app, this would be an API call
    const newApplication: CourseApplication = {
      id: `app_${Date.now()}`,
      vacancyId: vacancyId,
      mentorId: mentorInfo.email,
      mentorName: mentorInfo.name,
      mentorEmail: mentorInfo.email,
      coverLetter: formData.coverLetter,
      portfolio: formData.portfolio || (portfolioFile ? URL.createObjectURL(portfolioFile) : ''),
      experience: formData.experience,
      qualifications: formData.qualifications,
      demoClassUrl: formData.demoClassUrl || undefined,
      demoClassFile: demoClassFile ? URL.createObjectURL(demoClassFile) : undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Add to mock applications (in real app, this would be saved to backend)
    mockApplications.push(newApplication);

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      router.push('/portal/mentor/vacancies');
    }, 2000);
  };

  if (!vacancy) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Loading vacancy...</h2>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your application has been submitted successfully. You will be notified once admin reviews it.
          </p>
          <Button onClick={() => router.push('/portal/mentor/vacancies')}>
            Back to Vacancies
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Apply for Vacancy</h1>
          <p className="text-muted-foreground">Submit your application for this bundle course position</p>
        </div>
      </div>

      {/* Vacancy Details */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle>{vacancy.title}</CardTitle>
          <CardDescription>{vacancy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <p className="font-medium text-foreground">{vacancy.duration}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Course Pricing:</span>
              <p className="font-medium text-foreground">${vacancy.adminPricing.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Your Commission:</span>
              <p className="font-medium text-foreground">{vacancy.commissionSplit.mentor}%</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {vacancy.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>Fill out the form below to apply for this vacancy</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={mentorInfo.name}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={mentorInfo.email}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                rows={4}
                placeholder="Describe your relevant experience, years of experience, previous teaching experience, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="qualifications">Qualifications & Certifications</Label>
              <textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                rows={4}
                placeholder="List your qualifications, certifications, degrees, relevant courses completed, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="mt-1"
                placeholder="https://yourportfolio.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Or upload a portfolio file below
              </p>
            </div>

            <div>
              <Label htmlFor="portfolioFile">Portfolio File (Optional)</Label>
              <div className="mt-1 flex items-center space-x-2">
                <Input
                  id="portfolioFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                {portfolioFile && (
                  <span className="text-sm text-muted-foreground">
                    {portfolioFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Demo Class Required</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Please provide a demo class video showing how you would teach this subject. This helps us evaluate your teaching style and expertise.
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="demoClassUrl">Demo Class Video URL</Label>
                  <Input
                    id="demoClassUrl"
                    type="url"
                    value={formData.demoClassUrl}
                    onChange={(e) => setFormData({ ...formData, demoClassUrl: e.target.value })}
                    className="mt-1"
                    placeholder="https://youtube.com/watch?v=... or Vimeo, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="demoClassFile">Or Upload Demo Class Video</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Input
                      id="demoClassFile"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setDemoClassFile(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {demoClassFile && (
                      <span className="text-sm text-muted-foreground">
                        {demoClassFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum file size: 500MB. Formats: MP4, MOV, AVI
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                rows={6}
                placeholder="Write a cover letter explaining why you're the best fit for this position, your teaching philosophy, and how you plan to structure the course..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.coverLetter || !formData.experience || !formData.qualifications || (!formData.demoClassUrl && !demoClassFile)}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

