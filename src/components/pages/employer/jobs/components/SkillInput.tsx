"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/common/forms/Input';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { X, Plus, TrendingUp } from 'lucide-react';
import { cn } from '@/utils';

const popularSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
  'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
  'HTML', 'CSS', 'Tailwind CSS', 'Vue.js', 'Angular', 'Next.js',
  'Express', 'Django', 'Flask', 'Spring Boot', '.NET', 'GraphQL',
  'REST APIs', 'Microservices', 'CI/CD', 'Jenkins', 'GitHub Actions',
];

const skillCategories: Record<string, string[]> = {
  'Frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js'],
  'Backend': ['Node.js', 'Python', 'Java', 'C#', '.NET', 'Django', 'Flask', 'Express', 'Spring Boot'],
  'Database': ['SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform'],
  'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
  'Other': ['Git', 'GraphQL', 'REST APIs', 'Microservices', 'Machine Learning', 'AI'],
};

interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
  minSkills?: number;
  className?: string;
}

export function SkillInput({ 
  skills, 
  onChange, 
  maxSkills = 20, 
  minSkills = 3,
  className 
}: SkillInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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

  const updateSuggestions = (value: string) => {
    if (!value.trim()) {
      const categorySkills = selectedCategory === 'All' 
        ? popularSkills 
        : skillCategories[selectedCategory] || [];
      setSuggestions(categorySkills.filter(skill => !skills.includes(skill)).slice(0, 10));
      return;
    }

    const filtered = popularSkills.filter(skill =>
      skill.toLowerCase().includes(value.toLowerCase()) &&
      !skills.includes(skill)
    );
    setSuggestions(filtered.slice(0, 10));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    updateSuggestions(value);
    setShowSuggestions(true);
  };

  const addSkill = (skill?: string) => {
    const skillToAdd = skill || inputValue.trim();
    if (
      skillToAdd &&
      !skills.includes(skillToAdd) &&
      skills.length < maxSkills
    ) {
      onChange([...skills, skillToAdd]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter(s => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addSkill(suggestions[0]);
      } else {
        addSkill();
      }
    }
  };

  const filteredCategories = selectedCategory === 'All'
    ? popularSkills.filter(skill => !skills.includes(skill))
    : (skillCategories[selectedCategory] || []).filter(skill => !skills.includes(skill));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Type to search or add skill..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            updateSuggestions(inputValue);
            setShowSuggestions(true);
          }}
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || filteredCategories.length > 0) && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {/* Category Filter */}
            <div className="p-2 border-b border-border flex gap-1 flex-wrap">
              {['All', ...Object.keys(skillCategories)].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    updateSuggestions(inputValue);
                  }}
                  className={cn(
                    "px-2 py-1 text-xs rounded border transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-accent"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Suggestions List */}
            <div className="p-2">
              {inputValue.trim() ? (
                suggestions.length > 0 ? (
                  suggestions.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => addSkill(skill)}
                      className="w-full text-left px-3 py-2 hover:bg-accent rounded text-sm text-foreground"
                    >
                      {skill}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No matching skills. Press Enter to add "{inputValue}"
                  </div>
                )
              ) : (
                <>
                  {selectedCategory === 'All' && (
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Popular Skills
                    </div>
                  )}
                  {filteredCategories.slice(0, 10).map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => addSkill(skill)}
                      className="w-full text-left px-3 py-2 hover:bg-accent rounded text-sm text-foreground"
                    >
                      {skill}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Validation Messages */}
      {skills.length < minSkills && (
        <p className="text-xs text-destructive">
          Add at least {minSkills} skills (currently {skills.length})
        </p>
      )}
      {skills.length >= maxSkills && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxSkills} skills reached
        </p>
      )}
    </div>
  );
}

