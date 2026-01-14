// Re-export all API types
export * from './api';

// Legacy types (for backward compatibility during migration)
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
}

export interface UserStats {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  cardsStudied: number;
  correctAnswers: number;
  rank: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  rank: number;
}

export interface StudySession {
  cardId: string;
  correct: boolean;
  timeSpent: number;
  xpEarned: number;
}

export interface DailyProgress {
  date: string;
  cardsStudied: number;
  correctAnswers: number;
  xpEarned: number;
  streakMaintained: boolean;
}
