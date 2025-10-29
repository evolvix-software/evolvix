"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Trophy, Medal, Award, Download, FileText } from 'lucide-react';
import { ProjectSubmission } from '@/data/mock/coursesData';

interface ProjectsLeaderboardProps {
  courseId: string;
  submissions: ProjectSubmission[];
  courseTitle: string;
}

interface StudentRanking {
  studentId: string;
  studentName: string;
  totalScore: number;
  totalMaxScore: number;
  averageScore: number;
  submissions: ProjectSubmission[];
}

export function ProjectsLeaderboard({ courseId, submissions, courseTitle }: ProjectsLeaderboardProps) {
  const rankings = useMemo(() => {
    const studentMap = new Map<string, StudentRanking>();

    submissions.forEach(submission => {
      if (submission.status === 'reviewed' && submission.score !== undefined) {
        const existing = studentMap.get(submission.studentId);
        if (existing) {
          existing.totalScore += submission.score;
          existing.totalMaxScore += submission.maxScore;
          existing.submissions.push(submission);
        } else {
          studentMap.set(submission.studentId, {
            studentId: submission.studentId,
            studentName: submission.studentName,
            totalScore: submission.score,
            totalMaxScore: submission.maxScore,
            averageScore: 0,
            submissions: [submission],
          });
        }
      }
    });

    const rankings = Array.from(studentMap.values()).map(rank => ({
      ...rank,
      averageScore: (rank.totalScore / rank.totalMaxScore) * 100,
    }));

    return rankings.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);
  }, [submissions]);

  const generateCertificate = (student: StudentRanking, position: number) => {
    // Create certificate content
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Excellence - ${courseTitle}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; text-align: center; }
          .certificate { border: 10px solid #635bff; padding: 60px; max-width: 800px; margin: 0 auto; background: #fff; }
          .header { font-size: 48px; font-weight: bold; color: #635bff; margin-bottom: 20px; }
          .subheader { font-size: 24px; margin-bottom: 40px; color: #333; }
          .name { font-size: 36px; font-weight: bold; color: #000; margin: 40px 0; border-bottom: 2px solid #635bff; padding-bottom: 20px; display: inline-block; }
          .body { font-size: 20px; line-height: 1.6; color: #555; margin: 30px 0; }
          .footer { margin-top: 60px; display: flex; justify-content: space-around; }
          .signature { text-align: center; }
          .signature-line { border-top: 2px solid #000; width: 200px; margin: 0 auto; margin-top: 50px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">🏆 Certificate of Excellence</div>
          <div class="subheader">in recognition of outstanding achievement</div>
          <div class="body">
            This is to certify that
          </div>
          <div class="name">${student.studentName}</div>
          <div class="body">
            has demonstrated exceptional performance in the course<br/>
            <strong>${courseTitle}</strong><br/><br/>
            by achieving ${position === 1 ? 'First' : position === 2 ? 'Second' : 'Third'} place 
            with an average score of ${student.averageScore.toFixed(1)}%
          </div>
          <div class="footer">
            <div class="signature">
              <div class="signature-line"></div>
              <div>Evolvix</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div>Date: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const generateLOR = (student: StudentRanking, position: number) => {
    const lorHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Letter of Recommendation - ${student.studentName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.8; }
          .header { text-align: right; margin-bottom: 40px; }
          .date { margin-bottom: 20px; }
          .greeting { margin-bottom: 20px; }
          .body { margin: 30px 0; text-align: justify; }
          .signature { margin-top: 60px; }
          .signature-line { border-top: 2px solid #000; width: 300px; margin-top: 50px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>Evolvix Education Platform</div>
          <div>${new Date().toLocaleDateString()}</div>
        </div>
        <div class="greeting">
          <strong>To Whom It May Concern,</strong>
        </div>
        <div class="body">
          <p>
            I am writing to recommend <strong>${student.studentName}</strong> with great enthusiasm. 
            ${student.studentName} has demonstrated exceptional commitment and skill during their enrollment 
            in our <strong>${courseTitle}</strong> program.
          </p>
          <p>
            Throughout the course, ${student.studentName} achieved ${position === 1 ? 'first' : position === 2 ? 'second' : 'third'} 
            place ranking with an average score of ${student.averageScore.toFixed(1)}%. Their project submissions 
            consistently demonstrated strong technical ability, attention to detail, and innovative problem-solving skills.
          </p>
          <p>
            ${student.studentName} completed ${student.submissions.length} project${student.submissions.length > 1 ? 's' : ''}, 
            showing dedication to mastering the course material. Their work exemplifies the high standards we expect 
            from our students and demonstrates their readiness for professional opportunities.
          </p>
          <p>
            I highly recommend ${student.studentName} for any position or opportunity that requires strong technical skills, 
            dedication, and a commitment to excellence.
          </p>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <div>Evolvix Education Platform</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([lorHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (rankings.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600 dark:text-slate-400">
            No project evaluations completed yet. Rankings will appear after mentors evaluate submissions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const positions = [
    { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
    { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-800' },
    { icon: Award, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  ];

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Top 3 Students - Course Leaderboard
        </CardTitle>
        <CardDescription>
          Best performing students will receive Certificate of Excellence and Letter of Recommendation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankings.map((student, index) => {
            const position = positions[index];
            const PositionIcon = position.icon;
            
            return (
              <Card
                key={student.studentId}
                className={`border-2 ${position.border} ${position.bg}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full ${position.bg} flex items-center justify-center border-2 ${position.border}`}>
                        <PositionIcon className={`w-8 h-8 ${position.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {index + 1}. {student.studentName}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Average Score: <strong className="text-slate-900 dark:text-white">{student.averageScore.toFixed(1)}%</strong>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Total: {student.totalScore}/{student.totalMaxScore} points • {student.submissions.length} project{student.submissions.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateCertificate(student, index + 1)}
                        className="border-slate-200 dark:border-slate-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Certificate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateLOR(student, index + 1)}
                        className="border-slate-200 dark:border-slate-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Letter of Recommendation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

