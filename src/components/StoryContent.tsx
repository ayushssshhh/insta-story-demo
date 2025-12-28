import { useEffect, useState } from "react";
import { StoryMedia } from "./StoryMedia";
import { useStoryTimer } from "@/hooks/useStoryTimer";
import type { UserStoryGroup } from "@/types/stories";

const StoryContent = ({ 
  userGroup, storyIndex, isPaused, onNext, onPrev 
}: { 
  userGroup: UserStoryGroup; 
  storyIndex: number; 
  isPaused: boolean; 
  onNext: () => void;
  onPrev: () => void;
}) => {
  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading');
  const currentStory = userGroup.stories[storyIndex];

  // Logic: 5-Second Load Timeout
  useEffect(() => {
    // Reset status to loading when story changes
    setStatus('loading');

    // Start a watchdog timer
    const loadTimeout = setTimeout(() => {
      setStatus((currentStatus) => {
        // If it's still loading after 5s, move to error
        if (currentStatus === 'loading') {
          console.warn(`Story ${currentStory.id} timed out after 5s`);
          return 'error';
        }
        return currentStatus;
      });
    }, 5000);

    return () => clearTimeout(loadTimeout);
  }, [storyIndex, userGroup.id, currentStory.id]);

  const progress = useStoryTimer({
    duration: 5000,
    onNext,
    isPaused: isPaused || status !== 'playing',
    isLoading: status === 'loading',
  });

  if (!currentStory) return null;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Progress Header */}
      <div className="absolute top-0 left-0 right-0 z-[110] flex gap-1 p-3 bg-gradient-to-b from-black/80 to-transparent">
        {userGroup.stories.map((_, i) => (
          <div key={i} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ 
                width: i < storyIndex ? '100%' : i === storyIndex ? `${progress}%` : '0%',
                opacity: (i === storyIndex && status === 'loading') ? 0.5 : 1 
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Zones */}
      <div className="absolute inset-0 z-[105] flex">
        <div className="w-[30%] h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); onPrev(); }} />
        <div className="w-[70%] h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); onNext(); }} />
      </div>

      <div className="relative w-full h-full z-10">
        <StoryMedia 
          src={currentStory.url}
          status={status}
          onLoad={() => setStatus('playing')} 
          onError={() => setStatus('error')}
        />
      </div>
    </div>
  );
};

export default StoryContent;