import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryMediaProps {
  src: string;
  status: 'loading' | 'playing' | 'error';
  onLoad: () => void;
  onError: () => void;
}

export const StoryMedia: React.FC<StoryMediaProps> = ({ src, status, onLoad, onError }) => {
  // Local state to handle the high-res transition
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    // Reset state when source changes
    setIsHighResLoaded(false);
  }, [src]);

  return (
    <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
      {/* PRE-FETCHING STRATEGY: 
        We use a hidden link tag to tell the browser to prioritize this image 
        if the status is 'loading'
      */}
      {status === 'loading' && (
        <link rel="preload" as="image" href={src} />
      )}

      <img
        src={src}
        alt="Story content"
        loading="eager" // Stories need to be eager once the viewer is open
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isHighResLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          setIsHighResLoaded(true);
          onLoad();
        }}
        onError={onError}
      />

      {/* Spinner for slow connections */}
      {!isHighResLoaded && status !== 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 px-6 text-center bg-zinc-900/90 pointer-events-none">
          <AlertCircle className="w-12 h-12 text-zinc-500 mb-2" />
          <p className="text-white text-sm font-medium mb-4">Something went wrong</p>
          <div className="pointer-events-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};