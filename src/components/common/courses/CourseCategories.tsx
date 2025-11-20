"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { 
  Code, 
  Database, 
  Smartphone, 
  Palette, 
  BarChart3, 
  Shield, 
  Cloud, 
  Zap,
  Brain,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  courseCount: number;
}

const categories: Category[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    icon: <Code className="w-6 h-6" />,
    description: 'Frontend, Backend, Full-Stack',
    color: 'from-blue-500 to-cyan-500',
    courseCount: 45
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Python, ML, Analytics',
    color: 'from-purple-500 to-pink-500',
    courseCount: 32
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'React Native, Flutter, iOS',
    color: 'from-green-500 to-emerald-500',
    courseCount: 28
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    icon: <Palette className="w-6 h-6" />,
    description: 'Figma, Design Systems',
    color: 'from-orange-500 to-red-500',
    courseCount: 24
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: <Shield className="w-6 h-6" />,
    description: 'Ethical Hacking, Security',
    color: 'from-red-500 to-rose-500',
    courseCount: 18
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: <Cloud className="w-6 h-6" />,
    description: 'AWS, Azure, GCP',
    color: 'from-indigo-500 to-blue-500',
    courseCount: 22
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: <Brain className="w-6 h-6" />,
    description: 'Deep Learning, NLP',
    color: 'from-violet-500 to-purple-500',
    courseCount: 35
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: <Zap className="w-6 h-6" />,
    description: 'Docker, Kubernetes, CI/CD',
    color: 'from-yellow-500 to-orange-500',
    courseCount: 20
  },
  {
    id: 'business',
    name: 'Business & Entrepreneurship',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Startups, Marketing',
    color: 'from-teal-500 to-cyan-500',
    courseCount: 15
  },
  {
    id: 'academic',
    name: 'Academic & Test Prep',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Exams, Certifications',
    color: 'from-slate-500 to-gray-500',
    courseCount: 12
  }
];

export function CourseCategories() {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to courses with category filter
    router.push(`/portal/student/courses?category=${categoryId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`border border-slate-200 dark:border-border cursor-pointer transition-all duration-300 hover:shadow-lg ${
              hoveredCategory === category.id ? 'scale-105' : ''
            }`}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick(category.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-foreground mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {category.description}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                {category.courseCount} courses
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

