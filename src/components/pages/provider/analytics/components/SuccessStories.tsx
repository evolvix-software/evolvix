"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Award, Quote, Share2, Eye, Filter } from 'lucide-react';
import { scholarService } from '@/data/mock/providerData';
import { Scholar } from '@/data/mock/providerData';
import { Button } from '@/components/common/forms/Button';

interface SuccessStoriesProps {
  providerId?: string;
  campaignId?: string;
}

interface SuccessStory {
  id: string;
  scholar: Scholar;
  beforeMetric: string;
  afterMetric: string;
  quote?: string;
  achievements: string[];
  impactStatement: string;
}

export function SuccessStories({ providerId, campaignId }: SuccessStoriesProps) {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    // Generate success stories from scholars with significant achievements
    const successStories: SuccessStory[] = filteredScholars
      .filter(s => {
        // Include scholars who have graduated, been placed, or shown significant CGPA improvement
        return (
          s.graduationStatus === 'graduated' ||
          s.jobPlacement?.verified ||
          ((s.currentCGPA || s.baselineCGPA) - s.baselineCGPA > 1.0)
        );
      })
      .map(scholar => {
        const improvement = (scholar.currentCGPA || scholar.baselineCGPA) - scholar.baselineCGPA;
        const achievements: string[] = [];

        if (scholar.graduationStatus === 'graduated') {
          achievements.push('Graduated');
          if (scholar.graduationCGPA && scholar.graduationCGPA >= 8.5) {
            achievements.push('High CGPA Graduate');
          }
        }

        if (scholar.jobPlacement?.verified) {
          achievements.push('Job Placed');
          if (scholar.jobPlacement.salary && scholar.jobPlacement.salary.amount >= 800000) {
            achievements.push('High Salary Placement');
          }
        }

        if (improvement > 1.0) {
          achievements.push('Significant CGPA Improvement');
        }

        const beforeMetric = `CGPA: ${scholar.baselineCGPA.toFixed(1)}`;
        let afterMetric = `CGPA: ${(scholar.currentCGPA || scholar.baselineCGPA).toFixed(1)}`;
        
        if (scholar.graduationCGPA) {
          afterMetric += `, Graduated: ${scholar.graduationCGPA.toFixed(1)}`;
        }
        
        if (scholar.jobPlacement?.verified) {
          afterMetric += `, Placed at ${scholar.jobPlacement.companyName}`;
        }

        const impactStatement = `From a baseline CGPA of ${scholar.baselineCGPA.toFixed(1)} to ${(scholar.currentCGPA || scholar.baselineCGPA).toFixed(1)}, ${scholar.profile.name} has shown remarkable growth.${scholar.jobPlacement?.verified ? ` Successfully placed at ${scholar.jobPlacement.companyName} with a salary of ₹${scholar.jobPlacement.salary ? (scholar.jobPlacement.salary.amount / 100000).toFixed(1) : '0'}L.` : ''}`;

        return {
          id: scholar.id,
          scholar,
          beforeMetric,
          afterMetric,
          quote: `This scholarship changed my life completely. I'm forever grateful for this opportunity.`,
          achievements,
          impactStatement,
        };
      })
      .slice(0, 10); // Limit to top 10

    setStories(successStories);
    setFilteredStories(successStories);
  }, [providerId, campaignId]);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredStories(stories);
    } else if (selectedFilter === 'graduated') {
      setFilteredStories(stories.filter(s => s.scholar.graduationStatus === 'graduated'));
    } else if (selectedFilter === 'placed') {
      setFilteredStories(stories.filter(s => s.scholar.jobPlacement?.verified));
    } else if (selectedFilter === 'improved') {
      setFilteredStories(stories.filter(s => {
        const improvement = (s.scholar.currentCGPA || s.scholar.baselineCGPA) - s.scholar.baselineCGPA;
        return improvement > 1.0;
      }));
    }
  }, [selectedFilter, stories]);

  const handleShare = (story: SuccessStory) => {
    // TODO: Implement share functionality
    console.log('Sharing story:', story.id);
    alert('Share functionality will be implemented');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5" />
              Success Stories & Impact Showcase
            </h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-1 rounded-lg border border-input bg-background text-foreground text-sm"
              >
                <option value="all">All Stories</option>
                <option value="graduated">Graduated</option>
                <option value="placed">Job Placed</option>
                <option value="improved">High Improvement</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No success stories found for the selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedStory(story)}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{story.scholar.profile.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {story.beforeMetric} → {story.afterMetric}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {story.achievements.map((achievement, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mb-4">
                      <Quote className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm text-foreground italic flex-1">"{story.quote}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStory(story);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Full Story
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(story);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStory(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Success Story</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStory(null)}>×</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-1">{selectedStory.scholar.profile.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedStory.scholar.profile.email}</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">Journey</h5>
                <p className="text-sm text-foreground mb-2">
                  <span className="font-medium">Before:</span> {selectedStory.beforeMetric}
                </p>
                <p className="text-sm text-foreground mb-4">
                  <span className="font-medium">After:</span> {selectedStory.afterMetric}
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">Achievements</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedStory.achievements.map((achievement, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">Testimonial</h5>
                <div className="flex items-start gap-2">
                  <Quote className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <p className="text-foreground italic">"{selectedStory.quote}"</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">Impact Statement</h5>
                <p className="text-foreground">{selectedStory.impactStatement}</p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button onClick={() => handleShare(selectedStory)} className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Story
                </Button>
                <Button variant="outline" onClick={() => setSelectedStory(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
