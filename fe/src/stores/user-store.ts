import { create } from "zustand";
import { UserStatsResponse, UserResponse } from "@/types";

// Combined user state for UI display
interface UserProfile {
  // From auth
  id: string;
  email: string;
  username: string;
  avatar: string;
  // From stats
  totalCardsLearned: number;
  totalReviews: number;
  currentStreak: number;
  longestStreak: number;
  todayCardsStudied: number;
  todayNewCards: number;
  todayReviewCards: number;
  // Computed/mock for gamification
  level: number;
  xp: number;
  xpToNextLevel: number;
}

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  setUserFromAuth: (authUser: UserResponse) => void;
  setUserStats: (stats: UserStatsResponse) => void;
  updateStats: (correct: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

// Calculate level from total reviews (simple formula)
const calculateLevel = (totalReviews: number): { level: number; xp: number; xpToNextLevel: number } => {
  let level = 1;
  let xpNeeded = 100;
  let totalXp = totalReviews * 10; // 10 XP per review

  while (totalXp >= xpNeeded) {
    totalXp -= xpNeeded;
    level += 1;
    xpNeeded = Math.floor(xpNeeded * 1.2);
  }

  return { level, xp: totalXp, xpToNextLevel: xpNeeded };
};

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  isLoading: false,

  setUserFromAuth: (authUser) => {
    const { user } = get();
    set({
      user: {
        ...user,
        id: authUser.id,
        email: authUser.email,
        username: authUser.username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.username}`,
        totalCardsLearned: user?.totalCardsLearned || 0,
        totalReviews: user?.totalReviews || 0,
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
        todayCardsStudied: user?.todayCardsStudied || 0,
        todayNewCards: user?.todayNewCards || 0,
        todayReviewCards: user?.todayReviewCards || 0,
        level: user?.level || 1,
        xp: user?.xp || 0,
        xpToNextLevel: user?.xpToNextLevel || 100,
      } as UserProfile,
    });
  },

  setUserStats: (stats) => {
    const { user } = get();
    const { level, xp, xpToNextLevel } = calculateLevel(stats.totalReviews);

    set({
      user: {
        id: user?.id || "mock-user",
        email: user?.email || "user@example.com",
        username: user?.username || "StudyMaster",
        avatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=StudyMaster",
        totalCardsLearned: stats.totalCardsLearned,
        totalReviews: stats.totalReviews,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        todayCardsStudied: stats.todayCardsStudied,
        todayNewCards: stats.todayNewCards,
        todayReviewCards: stats.todayReviewCards,
        level,
        xp,
        xpToNextLevel,
      },
    });
  },

  updateStats: (correct) => {
    const { user } = get();
    if (!user) return;

    const newTotalReviews = user.totalReviews + 1;
    const newTotalCardsLearned = correct ? user.totalCardsLearned + 1 : user.totalCardsLearned;
    const { level, xp, xpToNextLevel } = calculateLevel(newTotalReviews);

    set({
      user: {
        ...user,
        totalReviews: newTotalReviews,
        totalCardsLearned: newTotalCardsLearned,
        todayCardsStudied: user.todayCardsStudied + 1,
        level,
        xp,
        xpToNextLevel,
      },
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  clearUser: () => set({ user: null }),
}));
