"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { 
  Bookmark, 
  Play, 
  Edit, 
  Trash2, 
  Bell, 
  BellOff,
  MoreVertical,
  X
} from 'lucide-react';
import { SavedSearch } from '../types';
import { cn } from '@/utils';

interface SavedSearchesProps {
  searches: SavedSearch[];
  onRunSearch: (search: SavedSearch) => void;
  onEditSearch: (search: SavedSearch) => void;
  onDeleteSearch: (id: string) => void;
  onToggleAlerts: (id: string) => void;
}

export function SavedSearches({
  searches,
  onRunSearch,
  onEditSearch,
  onDeleteSearch,
  onToggleAlerts
}: SavedSearchesProps) {
  if (searches.length === 0) {
    return (
      <Card className="border border-border">
        <CardContent className="p-12 text-center">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No saved searches</h3>
          <p className="text-muted-foreground">
            Save your searches to quickly access them later
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {searches.map((search) => (
        <Card key={search.id} className="border border-border hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">{search.name}</CardTitle>
                  {search.alertsEnabled && (
                    <Badge variant="primary" className="flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      Alerts On
                    </Badge>
                  )}
                </div>
                {search.resultCount !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    {search.resultCount} candidates found
                  </p>
                )}
                {search.lastSearched && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last searched: {new Date(search.lastSearched).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleAlerts(search.id)}
                  title={search.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                >
                  {search.alertsEnabled ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditSearch(search)}
                  title="Edit search"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteSearch(search.id)}
                  title="Delete search"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {search.filters.skills && search.filters.skills.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Skills:</span>
                  {search.filters.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {search.filters.skills.length > 3 && (
                    <Badge variant="default" className="text-xs">
                      +{search.filters.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              {search.filters.location && (
                <Badge variant="default" className="text-xs">
                  {search.filters.location}
                </Badge>
              )}
              {search.filters.experience && (
                <Badge variant="default" className="text-xs">
                  {search.filters.experience.min}-{search.filters.experience.max} years
                </Badge>
              )}
            </div>
            <Button
              className="w-full"
              onClick={() => onRunSearch(search)}
            >
              <Play className="w-4 h-4 mr-2" />
              Run Search
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

