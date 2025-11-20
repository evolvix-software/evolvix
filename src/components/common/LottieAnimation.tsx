"use client";

import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface LottieAnimationProps {
  animationData?: any;
  animationUrl?: string;
  animationId?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
}

export function LottieAnimation({
  animationData,
  animationUrl,
  animationId,
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
}: LottieAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [data, setData] = useState<any>(animationData);
  const [loading, setLoading] = useState(!animationData && (!!animationUrl || !!animationId));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (lottieRef.current && data) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed, data]);

  useEffect(() => {
    // If we have animationData, use it directly
    if (animationData) {
      setData(animationData);
      setLoading(false);
      return;
    }

    // Try to load from URL or ID
    const loadAnimation = async () => {
      setLoading(true);
      setError(false);

      try {
        let url = animationUrl;
        
        // If animationId is provided, try local file first, then CDN
        if (!url && animationId) {
          // First try local file (if manually downloaded)
          const localUrl = `/animations/analytical-thinking-illustration.json`;
          try {
            const localResponse = await fetch(localUrl);
            if (localResponse.ok) {
              const json = await localResponse.json();
              setData(json);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Local file doesn't exist, continue to CDN
          }
          
          // Try CDN endpoints (may require manual download due to CORS)
          url = `https://lottie.host/${animationId}`;
        }

        if (url) {
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const json = await response.json();
            setData(json);
            setLoading(false);
          } else {
            // Response is not JSON - likely needs manual download
            console.warn('Animation needs to be downloaded manually. See public/animations/README.md');
            throw new Error('Response is not JSON - please download animation manually');
          }
        } else {
          throw new Error('No URL or ID provided');
        }
      } catch (err) {
        console.error('Failed to load Lottie animation:', err);
        console.info('Please download the animation manually from: https://lottiefiles.com/free-animation/analytical-thinking-illustration-VG6JPaMxag');
        setError(true);
        setLoading(false);
      }
    };

    loadAnimation();
  }, [animationUrl, animationId, animationData]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="text-muted-foreground text-sm">
          Animation unavailable
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Lottie
        lottieRef={lottieRef}
        animationData={data}
        loop={loop}
        autoplay={autoplay}
        className="w-full h-full"
      />
    </div>
  );
}

