"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Award, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/common/forms/Button';
import { useRouter } from 'next/navigation';

interface BannerSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  gradient?: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: '1',
    title: 'Start Your Learning Journey Today',
    description: 'Discover thousands of courses from expert mentors and advance your career',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop',
    ctaText: 'Browse Courses',
    ctaLink: '/portal/student/courses',
    badge: 'New',
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    id: '2',
    title: 'Learn from Industry Experts',
    description: 'Get hands-on experience with real-world projects and personalized mentorship',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=400&fit=crop',
    ctaText: 'Find Mentors',
    ctaLink: '/portal/student/mentors',
    badge: 'Popular',
    gradient: 'from-green-600 to-teal-600'
  },
  {
    id: '3',
    title: 'Earn Certificates & Build Your Portfolio',
    description: 'Complete courses and showcase your skills with verified certificates',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0b6?w=1200&h=400&fit=crop',
    ctaText: 'View Achievements',
    ctaLink: '/portal/student/settings?section=achievements',
    badge: 'Featured',
    gradient: 'from-orange-600 to-red-600'
  }
];

export function CourseBannerCarousel() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const currentBanner = bannerSlides[currentSlide];

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8 group">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentBanner.image})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.gradient || 'from-blue-600 to-purple-600'} opacity-90`} />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl space-y-4">
          {currentBanner.badge && (
            <span className="inline-flex items-center px-3 py-1 bg-card/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              {currentBanner.badge}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {currentBanner.title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-xl">
            {currentBanner.description}
          </p>
          <Button
            onClick={() => router.push(currentBanner.ctaLink)}
            className="bg-card text-primary hover:bg-card/90 dark:bg-card dark:text-primary dark:hover:bg-card/90 font-semibold px-6 py-3 mt-4"
          >
            {currentBanner.ctaText}
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/20 backdrop-blur-sm hover:bg-card/30 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/20 backdrop-blur-sm hover:bg-card/30 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-card'
                : 'w-2 bg-card/50 hover:bg-card/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-card/20">
          <div
            className="h-full bg-card transition-all duration-[5000ms] ease-linear"
            style={{
              width: `${((currentSlide + 1) / bannerSlides.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
}

