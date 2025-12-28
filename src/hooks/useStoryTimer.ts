import { useState, useEffect, useRef } from 'react';

interface UseStoryTimerProps {
  duration: number;        // Total time per story (e.g., 5000ms)
  onNext: () => void;      // Callback when timer finishes
  isPaused: boolean;       // For "Long Press"
  isLoading: boolean;      // For "Waiting for image"
  activeStoryId: string;   // To reset timer when story changes
}

// Updated src/hooks/useStoryTimer.ts
export const useStoryTimer = ({
  duration,
  onNext,
  isPaused,
  isLoading
}: Omit<UseStoryTimerProps, 'activeStoryId'>) => { // Remove activeStoryId from here
  const [progress, setProgress] = useState(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // REMOVE the reset useEffect entirely. 
  // The 'key' on the parent component will handle this now.

  useEffect(() => {
    if (isLoading) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (time: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time - pausedTimeRef.current;
      }

      if (!isPaused) {
        const elapsed = time - startTimeRef.current;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          onNext();
          return;
        }
        requestRef.current = requestAnimationFrame(animate);
      } else {
        pausedTimeRef.current = time - (startTimeRef.current || time);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPaused, isLoading, duration, onNext]);

  return progress;
};