// src/types/stories.ts

export interface Story {
  id: string;
  url: string;
  // You could add "duration" here if you wanted different 
  // times per story, but we'll stick to 5s for now.
}

export interface UserStoryGroup {
  id: string;          // Unique ID for the user group
  username: string;
  avatar: string;      // URL for the profile picture
  stories: Story[];    // Array of story images
}

export type StoryStatus = 'loading' | 'playing' | 'error' | 'paused';