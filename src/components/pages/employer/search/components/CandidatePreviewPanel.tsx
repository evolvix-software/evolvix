"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Mail,
  Phone,
  MessageSquare,
  Plus,
  Star,
  Download,
  ExternalLink,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';
import { Candidate } from '../types';
import { cn } from '@/utils';
import Image from 'next/image';

interface CandidatePreviewPanelProps {
  candidate: Candidate | null;
  onClose?: () => void;
  onMessage?: (id: string) => void;
  onAddToPool?: (id: string) => void;
  onSave?: (id: string) => void;
  onViewFullProfile?: (id: string) => void;
}

export function CandidatePreviewPanel({
  candidate,
  onClose,
  onMessage,
  onAddToPool,
  onSave,
  onViewFullProfile
}: CandidatePreviewPanelProps) {
  if (!candidate) {
    return (
      <div className="w-80 border-l border-border bg-card p-6">
        <div className="text-center text-muted-foreground">
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select a candidate to view details</p>
        </div>
      </div>
    );
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 60) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getAvailabilityLabel = (availability: string) => {
    const labels: Record<string, string> = {
      immediate: 'Immediately Available',
      '2weeks': 'Available in 2 Weeks',
      '1month': 'Available in 1 Month',
      '3months': 'Available in 3+ Months',
      'not-looking': 'Not Currently Looking'
    };
    return labels[availability] || availability;
  };

  return (
    <div className="w-80 border-l border-border bg-card overflow-y-auto h-full">
      <CardHeader className="border-b border-border sticky top-0 bg-card z-10">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg">Candidate Preview</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
            {candidate.photo ? (
              <Image src={candidate.photo} alt={candidate.name} width={64} height={64} className="rounded-full" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{candidate.headline}</p>
            <Badge className={cn("text-xs mt-1", getMatchScoreColor(candidate.matchScore))}>
              {candidate.matchScore}% Match
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onMessage?.(candidate.id)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddToPool?.(candidate.id)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Pool
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSave?.(candidate.id)}
          >
            <Star className="w-4 h-4" />
          </Button>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          {candidate.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${candidate.email}`} className="hover:text-primary">
                {candidate.email}
              </a>
            </div>
          )}
          {candidate.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <a href={`tel:${candidate.phone}`} className="hover:text-primary">
                {candidate.phone}
              </a>
            </div>
          )}
        </div>

        {/* Current Position */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Current Position</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>{candidate.currentPosition} at {candidate.currentCompany}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{candidate.location}</span>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Experience</h4>
          <p className="text-sm text-muted-foreground">{candidate.experience} years</p>
        </div>

        {/* Education */}
        {candidate.education && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Education</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{candidate.education}</span>
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Availability</h4>
          <Badge variant="default" className="text-xs">
            {getAvailabilityLabel(candidate.availability)}
          </Badge>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.map((skill, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages */}
        {candidate.languages && candidate.languages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Languages</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.languages.map((lang, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {candidate.certifications && candidate.certifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Certifications</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.certifications.map((cert, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Salary Expectations */}
        {candidate.salaryExpectation && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Salary Expectations</h4>
            <p className="text-sm text-muted-foreground">
              {candidate.salaryExpectation.currency} {candidate.salaryExpectation.min.toLocaleString()} - {candidate.salaryExpectation.max.toLocaleString()}
            </p>
          </div>
        )}

        {/* Social Links */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Links</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.linkedInUrl && (
              <a 
                href={candidate.linkedInUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {candidate.githubUrl && (
              <a 
                href={candidate.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {candidate.portfolioUrl && (
              <a 
                href={candidate.portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Globe className="w-4 h-4" />
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onViewFullProfile?.(candidate.id)}
          >
            View Full Profile
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          {candidate.resumeUrl && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(candidate.resumeUrl, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          )}
        </div>
      </CardContent>
    </div>
  );
}

