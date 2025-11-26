"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/common/forms/Input';
import { MapPin } from 'lucide-react';
import { cn } from '@/utils';

const popularLocations = [
  'Remote',
  'San Francisco, CA',
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Denver, CO',
  'Washington, DC',
  'Atlanta, GA',
  'Miami, FL',
  'Portland, OR',
  'Philadelphia, PA',
  'Dallas, TX',
  'Houston, TX',
  'Phoenix, AZ',
  'San Diego, CA',
  'London, UK',
  'Toronto, Canada',
  'Berlin, Germany',
  'Amsterdam, Netherlands',
  'Singapore',
  'Bangalore, India',
  'Mumbai, India',
  'Delhi, India',
  'Hyderabad, India',
  'Pune, India',
];

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Enter location...",
  className,
  required
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateSuggestions = (inputValue: string) => {
    if (!inputValue.trim()) {
      setSuggestions(popularLocations.slice(0, 8));
      return;
    }

    const filtered = popularLocations.filter(location =>
      location.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 8));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    updateSuggestions(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSelect = (location: string) => {
    onChange(location);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        } else if (suggestions.length > 0) {
          handleSelect(suggestions[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            updateSuggestions(value);
            setShowSuggestions(true);
          }}
          placeholder={placeholder}
          required={required}
          className="pl-10"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((location, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(location)}
              className={cn(
                "w-full text-left px-4 py-2 hover:bg-accent rounded text-sm text-foreground flex items-center gap-2",
                index === selectedIndex && "bg-accent"
              )}
            >
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

