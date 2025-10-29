import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
}

interface StrengthLevel {
  label: string;
  color: string;
  bgColor: string;
  requirements: string[];
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  const levels: StrengthLevel[] = [
    {
      label: 'Very Weak',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      requirements: []
    },
    {
      label: 'Weak',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500',
      requirements: []
    },
    {
      label: 'Fair',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      requirements: []
    },
    {
      label: 'Good',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      requirements: []
    },
    {
      label: 'Strong',
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      requirements: []
    }
  ];

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback([]);
      return;
    }

    let score = 0;
    const checks: string[] = [];

    // Length check
    if (password.length >= 8) {
      score++;
      checks.push('At least 8 characters');
    } else {
      checks.push('Need at least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score++;
      checks.push('Contains lowercase letters');
    } else {
      checks.push('Add lowercase letters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score++;
      checks.push('Contains uppercase letters');
    } else {
      checks.push('Add uppercase letters');
    }

    // Number check
    if (/\d/.test(password)) {
      score++;
      checks.push('Contains numbers');
    } else {
      checks.push('Add numbers');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score++;
      checks.push('Contains special characters');
    } else {
      checks.push('Add special characters');
    }

    // Length bonus
    if (password.length >= 12) {
      score = Math.min(score + 1, 4);
    }

    setStrength(Math.min(score, 4));
    setFeedback(checks);
  }, [password]);

  const currentLevel = levels[strength] || levels[0];
  const progress = ((strength + 1) / levels.length) * 100;

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Password Strength</span>
          <span className={cn('font-medium', currentLevel.color)}>
            {currentLevel.label}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', currentLevel.bgColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        {feedback.map((item, index) => {
          const isMet = item.startsWith('Contains') || item.startsWith('At least');
          return (
            <div
              key={index}
              className={cn(
                'flex items-center space-x-2 text-sm',
                isMet ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  isMet
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-400'
                    : 'border-gray-300 dark:border-gray-600'
                )}
              >
                {isMet && <Check className="w-3 h-3 text-green-600 dark:text-green-400" />}
              </div>
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;


