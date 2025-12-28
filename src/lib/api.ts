import type { UserStoryGroup } from '@/types/stories';
import storyData from '../data/stories.json';

export const fetchStories = async (): Promise<UserStoryGroup[]> => {
  // Simulating network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(storyData as UserStoryGroup[]);
    }, 800);
  });
};