"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Clock, X, Search } from 'lucide-react';
import { cn } from '@/utils';
import { Job } from '@/store/features/employer/employerSlice';

interface SearchSuggestionsProps {
  searchQuery: string;
  jobs: Job[];
  onSelectSuggestion: (query: string) => void;
  onClearHistory: () => void;
}

const RECENT_SEARCHES_KEY = 'employer_recent_searches';
const MAX_RECENT_SEARCHES = 5;
const MAX_SUGGESTIONS = 5;

export function SearchSuggestions({
  searchQuery,
  jobs,
  onSelectSuggestion,
  onClearHistory,
}: SearchSuggestionsProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      generateSuggestions(searchQuery);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchQuery, jobs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }
  };

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [
      query.trim(),
      ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const generateSuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const jobTitles = new Set<string>();
    const locations = new Set<string>();
    const skills = new Set<string>();

    jobs.forEach(job => {
      if (job.title.toLowerCase().includes(lowerQuery)) {
        jobTitles.add(job.title);
      }
      if (job.location.toLowerCase().includes(lowerQuery)) {
        locations.add(job.location);
      }
      if (job.skills) {
        job.skills.forEach(skill => {
          if (skill.toLowerCase().includes(lowerQuery)) {
            skills.add(skill);
          }
        });
      }
    });

    const allSuggestions = [
      ...Array.from(jobTitles).slice(0, 3),
      ...Array.from(locations).slice(0, 2),
      ...Array.from(skills).slice(0, 2),
    ].slice(0, MAX_SUGGESTIONS);

    setSuggestions(allSuggestions);
  };

  const handleSelect = (query: string) => {
    onSelectSuggestion(query);
    saveRecentSearch(query);
    setShowSuggestions(false);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    onClearHistory();
  };

  if (!showSuggestions && recentSearches.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 border border-border shadow-lg">
          <CardContent className="p-0">
            {suggestions.length > 0 && (
              <div className="p-2 border-b border-border">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Recent Searches
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(search)}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

