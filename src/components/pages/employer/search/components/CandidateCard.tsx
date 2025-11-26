"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { 
  User, 
  MapPin, 
  Briefcase, 
  MessageSquare, 
  Star, 
  Plus,
  Download,
  ExternalLink
} from 'lucide-react';
import { Candidate } from '../types';
import { cn } from '@/utils';
import Image from 'next/image';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onView?: (id: string) => void;
  onAddToPool?: (id: string) => void;
  onMessage?: (id: string) => void;
  onSave?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export function CandidateCard({
  candidate,
  isSelected = false,
  onSelect,
  onView,
  onAddToPool,
  onMessage,
  onSave,
  viewMode = 'grid'
}: CandidateCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 60) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getAvailabilityLabel = (availability: string) => {
    const labels: Record<string, string> = {
      immediate: 'Immediate',
      '2weeks': '2 Weeks',
      '1month': '1 Month',
      '3months': '3+ Months',
      'not-looking': 'Not Looking'
    };
    return labels[availability] || availability;
  };

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          "flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer",
          isSelected && "bg-primary/5 ring-2 ring-primary"
        )}
        onClick={() => onView?.(candidate.id)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
            {candidate.photo ? (
              <Image src={candidate.photo} alt={candidate.name} width={48} height={48} className="rounded-full" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
              <Badge className={cn("text-xs", getMatchScoreColor(candidate.matchScore))}>
                {candidate.matchScore}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{candidate.headline}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {candidate.currentCompany}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {candidate.location}
              </span>
              <span>{candidate.experience} years exp.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {candidate.skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 3 && (
                <Badge variant="default" className="text-xs">
                  +{candidate.skills.length - 3}
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onMessage?.(candidate.id); }}>
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onSave?.(candidate.id); }}>
                <Star className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onAddToPool?.(candidate.id); }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "border border-border hover:shadow-lg transition-all cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onView?.(candidate.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
            {candidate.photo ? (
              <Image src={candidate.photo} alt={candidate.name} width={64} height={64} className="rounded-full" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{candidate.headline}</p>
              </div>
              <Badge className={cn("text-xs flex-shrink-0", getMatchScoreColor(candidate.matchScore))}>
                {candidate.matchScore}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {candidate.currentCompany}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {candidate.skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 5 && (
              <Badge variant="default" className="text-xs">
                +{candidate.skills.length - 5}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{candidate.experience} years exp.</span>
            <span>{getAvailabilityLabel(candidate.availability)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {candidate.education}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onMessage?.(candidate.id); 
              }}
              title="Send Message"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onSave?.(candidate.id); 
              }}
              title="Save Candidate"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onAddToPool?.(candidate.id); 
              }}
              title="Add to Talent Pool"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

