"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { SuccessStory } from '@/interfaces/providerDashboard';

interface SuccessStoriesCarouselProps {
    stories: SuccessStory[];
}

export function SuccessStoriesCarousel({ stories }: SuccessStoriesCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % stories.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };

    const currentStory = stories[currentIndex];

    return (
        <Card className="h-full border-0 shadow-sm bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-900/10">
            <CardContent className="p-6 flex flex-col h-full justify-center relative">
                <div className="absolute top-4 right-4 flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={prevSlide} className="h-8 w-8 rounded-full p-0">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={nextSlide} className="h-8 w-8 rounded-full p-0">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Quote className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{currentStory.title}</h3>
                    <p className="text-muted-foreground italic mb-6">"{currentStory.quote}"</p>
                </div>

                <div className="flex items-center space-x-4 mt-auto">
                    {currentStory.scholarPhoto ? (
                        <img
                            src={currentStory.scholarPhoto}
                            alt={currentStory.scholarName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {currentStory.scholarName.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-foreground">{currentStory.scholarName}</p>
                        <div className="flex space-x-3 text-xs text-muted-foreground mt-1">
                            {currentStory.beforeMetric && <span>Before: {currentStory.beforeMetric}</span>}
                            {currentStory.afterMetric && <span className="font-medium text-green-600 dark:text-green-400">After: {currentStory.afterMetric}</span>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
