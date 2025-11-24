"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Scholar } from '@/data/mock/providerData';
import { GraduationCap, Award, Calendar, FileText, Download, CheckCircle, Award as AwardIcon } from 'lucide-react';

interface GraduationTabProps {
  scholar: Scholar;
}

export function GraduationTab({ scholar }: GraduationTabProps) {
  const [showGraduationForm, setShowGraduationForm] = useState(false);

  const isGraduated = scholar.graduationStatus === 'graduated';
  const isDroppedOut = scholar.graduationStatus === 'dropped-out';

  return (
    <div className="space-y-6">
      {/* Graduation Status Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Graduation Status
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className={`text-lg font-semibold capitalize ${
                isGraduated ? 'text-green-600' : isDroppedOut ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {scholar.graduationStatus.replace('-', ' ')}
              </p>
            </div>
            {isGraduated && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Graduated
              </span>
            )}
          </div>

          {isGraduated && scholar.graduationDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Graduation Date
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(scholar.graduationDate).toLocaleDateString()}
                </p>
              </div>
              {scholar.graduationCGPA && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Final CGPA
                  </p>
                  <p className="text-lg font-semibold text-foreground">{scholar.graduationCGPA.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {!isGraduated && !isDroppedOut && (
            <div className="p-6 bg-muted/50 rounded-lg text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">
                This scholar has not graduated yet. Record graduation when they complete their course.
              </p>
              <Button onClick={() => setShowGraduationForm(true)}>
                Record Graduation
              </Button>
            </div>
          )}

          {isGraduated && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Issue Certificate
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Certificate
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <AwardIcon className="w-4 h-4" />
                Celebrate Achievement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates Earned */}
      {isGraduated && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Certificates Earned</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scholar.enrollments.map((enrollment, idx) => (
                <div key={enrollment.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">Course {idx + 1} Certificate</h4>
                      <p className="text-sm text-muted-foreground">
                        Issued: {scholar.graduationDate ? new Date(scholar.graduationDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {scholar.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AwardIcon className="w-5 h-5" />
              Achievements
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scholar.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border border-border rounded-lg bg-primary/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <AwardIcon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">{achievement.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Celebration */}
      {isGraduated && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AwardIcon className="w-5 h-5" />
              Success Celebration
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Congratulations! {scholar.profile.name} has successfully graduated with a CGPA of {scholar.graduationCGPA?.toFixed(2)}.
              This achievement has been added to success stories and impact metrics.
            </p>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Generate Graduation Certificate
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <AwardIcon className="w-4 h-4" />
                Add to Success Stories
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

