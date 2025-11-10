"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { CourseVacancy, CourseApplication } from '@/data/mock/coursesData';
import { mockVacancies, mockApplications } from '@/data/mock/vacanciesData';
import { BookOpen, Clock, DollarSign, Users, Search, Filter, Calendar, CheckCircle2, XCircle, AlertCircle, Code, Palette, Shield, Smartphone, Gamepad2, Gem, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CATEGORIES = [
  { id: 'development', name: 'Full Stack Development', icon: Code, bgColor: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', description: 'Web, Mobile, Backend Development' },
  { id: 'design', name: 'Design', icon: Palette, bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', description: 'UI/UX, Graphic, Product Design' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield, bgColor: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', description: 'Security, Ethical Hacking, Compliance' },
  { id: 'app-development', name: 'App Development', icon: Smartphone, bgColor: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', description: 'iOS, Android, Cross-platform' },
  { id: 'gaming', name: 'Game Development', icon: Gamepad2, bgColor: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', description: 'Unity, Unreal, Game Design' },
  { id: 'jewelry-design', name: 'Jewelry Design', icon: Gem, bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600 dark:text-yellow-400', description: 'CAD Design, Manufacturing' },
];

export function VacanciesPage() {
  const router = useRouter();
  const [vacancies, setVacancies] = useState<CourseVacancy[]>(mockVacancies);
  const [applications, setApplications] = useState<CourseApplication[]>(mockApplications);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  // Get mentor ID from localStorage
  const [mentorId, setMentorId] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || 'mentor_1');
    }
  }, []);

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || vacancy.category === selectedCategory;
    const matchesDuration = selectedDuration === 'all' || vacancy.duration === selectedDuration;
    const matchesStatus = activeTab === 'all' || 
                         (activeTab === 'open' && vacancy.status === 'open') ||
                         (activeTab === 'applied' && applications.some(app => app.vacancyId === vacancy.id && app.mentorId === mentorId));

    return matchesSearch && matchesCategory && matchesDuration && matchesStatus;
  });

  const getApplicationStatus = (vacancyId: string) => {
    const application = applications.find(app => app.vacancyId === vacancyId && app.mentorId === mentorId);
    return application ? application.status : null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    }
  };

  const categories = ['all', 'development', 'design', 'cybersecurity', 'app-development', 'gaming', 'jewelry-design'];

  // Show category cards if no category is selected
  if (selectedCategory === null) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Course Vacancies</h1>
          <p className="text-muted-foreground">
            Browse categories and apply for full-stack master course positions. These courses support both regular enrollment and scholarship applications.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            const categoryVacancies = vacancies.filter(v => v.category === category.id);
            const Icon = category.icon;
            
            return (
              <Card
                key={category.id}
                className="border border-border bg-card hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${category.bgColor}`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {categoryVacancies.length} {categoryVacancies.length === 1 ? 'course' : 'courses'} available
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setSelectedCategory(null)}
          className="border-border"
        >
          ← Back to Categories
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Course Vacancies'}
          </h1>
          <p className="text-muted-foreground">
            Full-stack master courses in this category. Apply to become a tutor.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Durations</option>
                <option value="4-months">4 Months</option>
                <option value="5-months">5 Months</option>
                <option value="6-months">6 Months</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Vacancies</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="applied">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filteredVacancies.length === 0 ? (
            <Card className="border border-border bg-card">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Vacancies Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' || selectedDuration !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No vacancies available at the moment'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredVacancies.map((vacancy) => {
              const applicationStatus = getApplicationStatus(vacancy.id);
              const hasApplied = applicationStatus !== null;

              return (
                <Card key={vacancy.id} className="border border-border bg-card hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-xl">{vacancy.title}</CardTitle>
                          {hasApplied && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(applicationStatus!)}`}>
                              {applicationStatus === 'accepted' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                              {applicationStatus === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                              {applicationStatus === 'pending' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                              {applicationStatus === 'accepted' ? 'Accepted' : applicationStatus === 'rejected' ? 'Rejected' : 'Pending Review'}
                            </span>
                          )}
                          {vacancy.status === 'open' && !hasApplied && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              Open
                            </span>
                          )}
                        </div>
                        <CardDescription className="mt-2">{vacancy.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium text-foreground">{vacancy.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Pricing:</span>
                        <span className="font-medium text-foreground">${vacancy.adminPricing.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Commission:</span>
                        <span className="font-medium text-foreground">{vacancy.commissionSplit.mentor}%</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium text-foreground">
                          {new Date(vacancy.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {vacancy.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                        {vacancy.requirements.length > 3 && (
                          <li className="text-primary">+{vacancy.requirements.length - 3} more requirements</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {vacancy.skills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        <span>Commission Split: </span>
                        <span className="font-medium text-foreground">
                          Evolvix {vacancy.commissionSplit.evolvix}% | Mentor {vacancy.commissionSplit.mentor}%
                        </span>
                      </div>
                      {vacancy.status === 'open' && (
                        <div className="flex gap-2">
                          {hasApplied ? (
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/portal/mentor/vacancies/${vacancy.id}/application`)}
                            >
                              View Application
                            </Button>
                          ) : (
                            <Button
                              onClick={() => router.push(`/portal/mentor/vacancies/${vacancy.id}/apply`)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Apply Now
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

