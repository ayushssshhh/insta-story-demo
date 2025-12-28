# 📸 Instagram Stories Clone
A high-performance, mobile-first Instagram Stories clone built with React, TypeScript, and Framer Motion. This project features a dynamic sorting system, intelligent navigation boundaries, and optimized media handling for large datasets.

# 🚀 Key Features
1. Dynamic Story Tray & Smart Sorting
The tray automatically prioritizes content. Unviewed stories appear at the beginning with the iconic gradient ring. Once viewed, users are moved to the end of the list with a muted, grayscale style.

Performance: Uses useMemo for sorting to ensure smooth UI updates even with 50+ users.

Animations: Powered by Framer Motion's layout prop for fluid re-ordering.

2. Intelligent Navigation
ID-Based Sticky Selection: Navigates via User IDs rather than array indexes to prevent "jumping" when the list re-sorts in the background.

Boundary Detection: The viewer automatically closes when you reach the end of your "New Stories" to prevent looping into content you've already seen.

Auto-Advance: 5-second timer per story with a watchdog timeout that skips broken or slow-loading media.

3. Media Optimization
Lazy Loading: Tray avatars use native lazy loading to save bandwidth.

Pre-fetching: The viewer silently pre-loads the next story in the background for zero-latency transitions.

Gated Progress: The progress bar is synchronized with the media's onLoad event—timer and progress only start once the media is actually visible.

# 🛠️ Tech Stack
Framework: React 18

Language: TypeScript

Animation: Framer Motion

Styling: Tailwind CSS

Icons: Lucide React

Deployment: Vercel

# 📖 Coding Logic Highlights
The Watchdog Timer
To prevent the app from hanging on a spinner, we implemented a 5-second watchdog:

TypeScript

useEffect(() => {
  const loadTimeout = setTimeout(() => {
    if (status === 'loading') setStatus('error');
  }, 5000);
  return () => clearTimeout(loadTimeout);
}, [storyIndex]);
Pointer-Events Overlay
To ensure users can always navigate (even when an error message is showing), we used a layered Z-index approach:

Nav Layer (Z-105): Invisible but spans the screen to catch clicks.

Error Layer (Z-50): Uses pointer-events: none so clicks "fall through" to the Nav Layer, while the "Retry" button uses pointer-events: auto.

# 📦 Installation & Setup
Clone the repo:

`git clone https://github.com/your-username/ig-stories-clone.git`

Install dependencies:

`npm install`

Run the development server:


`npm run dev`

Build for production:

`npm run build`
