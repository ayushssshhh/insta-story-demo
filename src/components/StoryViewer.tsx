import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { UserStoryGroup } from '@/types/stories';
import StoryContent from './StoryContent';

interface StoryViewerProps {
  userGroup: UserStoryGroup;
  onNextUser: () => void;
  onPrevUser: () => void;
  onClose: () => void;
}


export const StoryViewer: React.FC<StoryViewerProps> = ({ 
  userGroup, onNextUser, onPrevUser, onClose 
}) => {
  const [storyIndex, setStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = () => {
    if (storyIndex < userGroup.stories.length - 1) setStoryIndex(prev => prev + 1);
    else onNextUser();
  };

  const handlePrev = () => {
    if (storyIndex > 0) setStoryIndex(prev => prev - 1);
    else onPrevUser();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex flex-col md:max-w-[450px] md:mx-auto h-[100dvh]"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <button 
        onClick={onClose} 
        className="absolute top-8 right-4 z-[120] text-white p-2 rounded-full bg-black/20"
      >
        <X className="w-6 h-6" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${userGroup.id}-${storyIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          <StoryContent
            userGroup={userGroup}
            storyIndex={storyIndex}
            isPaused={isPaused}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};