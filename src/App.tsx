import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { UserStoryGroup } from "./types/stories";
import { fetchStories } from "./lib/api";
import { StoryViewer } from "./components/StoryViewer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export default function App() {
  const [userGroups, setUserGroups] = useState<UserStoryGroup[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persistence: Track viewed users
  const [viewedUserIds, setViewedUserIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('viewed-users');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  useEffect(() => {
    localStorage.setItem('viewed-users', JSON.stringify(Array.from(viewedUserIds)));
  }, [viewedUserIds]);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchStories();
    setUserGroups(data);
    setIsRefreshing(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Optimized Sorting: New stories first, viewed at the end
  const sortedUsers = useMemo(() => {
    return [...userGroups].sort((a, b) => {
      const aViewed = viewedUserIds.has(a.id);
      const bViewed = viewedUserIds.has(b.id);
      if (aViewed === bViewed) return 0;
      return aViewed ? 1 : -1;
    });
  }, [userGroups, viewedUserIds]);

  const activeUser = useMemo(() => 
    sortedUsers.find(u => u.id === activeUserId), 
    [sortedUsers, activeUserId]
  );

  const handleNextUser = useCallback(() => {
    const currentIndex = sortedUsers.findIndex(u => u.id === activeUserId);
    if (activeUserId) setViewedUserIds(prev => new Set(prev).add(activeUserId));

    const nextUser = sortedUsers[currentIndex + 1];
    // Boundary: Stop if next user doesn't exist or is already viewed
    if (nextUser && !viewedUserIds.has(nextUser.id)) {
      setActiveUserId(nextUser.id);
    } else {
      setActiveUserId(null);
    }
  }, [sortedUsers, activeUserId, viewedUserIds]);

  const handlePrevUser = useCallback(() => {
    const currentIndex = sortedUsers.findIndex(u => u.id === activeUserId);
    if (currentIndex > 0) {
      setActiveUserId(sortedUsers[currentIndex - 1].id);
    }
  }, [sortedUsers, activeUserId]);

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 80], [0, 1]);
  const rotate = useTransform(y, [0, 100], [0, 360]);

  return (
    <motion.div 
      className="min-h-screen bg-black text-white p-4 font-sans select-none overflow-x-hidden"
      style={{ y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={() => { if (y.get() > 80) loadData(); y.set(0); }}
    >
      <motion.div style={{ opacity, rotate, marginBottom: -40 }} className="flex justify-center pt-2 h-10">
        <Loader2 className={`w-6 h-6 text-purple-500 ${isRefreshing ? 'animate-spin' : ''}`} />
      </motion.div>

      <header className="py-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent italic tracking-tighter">
          Instagram
        </h1>
      </header>
      
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar touch-pan-x">
        {sortedUsers.map((group) => {
          const isViewed = viewedUserIds.has(group.id);
          return (
            <motion.div 
              layout 
              key={group.id} 
              className="flex flex-col items-center gap-2 min-w-[75px] cursor-pointer"
              onClick={() => setActiveUserId(group.id)}
            >
              <div className={`p-[2.5px] rounded-full transition-all duration-500 ${
                isViewed ? 'bg-zinc-800' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
              }`}>
                <div className="p-[2px] bg-black rounded-full">
                  <Avatar className="w-16 h-16 border-none">
                    <AvatarImage 
                        src={group.avatar} 
                        loading="lazy" // Optimization for 50+ users
                        className={isViewed ? "opacity-40 grayscale-[0.2]" : ""} 
                    />
                    <AvatarFallback>{group.username[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className={`text-[11px] truncate w-full text-center ${isViewed ? 'text-zinc-500' : 'text-zinc-200'}`}>
                {group.username}
              </span>
            </motion.div>
          );
        })}
      </div>

      {activeUser && (
        <StoryViewer 
          key={activeUser.id}
          userGroup={activeUser}
          onNextUser={handleNextUser}
          onPrevUser={handlePrevUser}
          onClose={() => {
            if (activeUserId) setViewedUserIds(prev => new Set(prev).add(activeUserId));
            setActiveUserId(null);
          }}
        />
      )}
    </motion.div>
  );
}