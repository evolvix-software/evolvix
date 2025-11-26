"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/common/forms/Input';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  recentSearches?: string[];
  suggestions?: string[];
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search by name, skills, location, or keywords...",
  recentSearches = [],
  suggestions = []
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const displaySuggestions = focused && (recentSearches.length > 0 || suggestions.length > 0 || value.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              // Delay to allow click events on suggestions
              setTimeout(() => setFocused(false), 200);
            }}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-10"
          />
          {value && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>

      {displaySuggestions && showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border border-border shadow-lg">
          <CardContent className="p-0">
            {value.length === 0 && recentSearches.length > 0 && (
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </div>
                <div className="space-y-1">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <TrendingUp className="w-3 h-3" />
                  Suggestions
                </div>
                <div className="space-y-1">
                  {suggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {value.length > 0 && (
              <div className="p-3">
                <button
                  onClick={handleSearch}
                  className="w-full text-left px-2 py-1.5 text-sm text-primary hover:bg-accent rounded transition-colors font-medium"
                >
                  Search for "{value}"
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

