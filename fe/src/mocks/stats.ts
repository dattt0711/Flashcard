import {
  UserStatsResponse,
  StreakResponse,
  LeaderboardEntryResponse,
  DailyStatsResponse,
} from '@/types';

export const mockUserStats: UserStatsResponse = {
  totalCardsLearned: 342,
  totalReviews: 1250,
  currentStreak: 7,
  longestStreak: 21,
  lastStudyDate: new Date().toISOString().split('T')[0],
  todayCardsStudied: 25,
  todayNewCards: 10,
  todayReviewCards: 15,
  todayStudyTimeSeconds: 1800,
};

export const mockStreakResponse: StreakResponse = {
  currentStreak: 7,
  longestStreak: 21,
  lastStudyDate: new Date().toISOString().split('T')[0],
  studiedToday: true,
};

export const mockLeaderboard: LeaderboardEntryResponse[] = [
  {
    rank: 1,
    userId: 'u-leader-1',
    username: 'BrainiacPro',
    score: 12500,
  },
  {
    rank: 2,
    userId: 'u-leader-2',
    username: 'QuizWhiz',
    score: 11200,
  },
  {
    rank: 3,
    userId: 'u-leader-3',
    username: 'MemoryKing',
    score: 9800,
  },
  {
    rank: 4,
    userId: 'u-leader-4',
    username: 'LearnLord',
    score: 8500,
  },
  {
    rank: 5,
    userId: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    username: 'StudyMaster',
    score: 2450,
  },
  {
    rank: 6,
    userId: 'u-leader-6',
    username: 'FlashGenius',
    score: 2200,
  },
  {
    rank: 7,
    userId: 'u-leader-7',
    username: 'CardShark',
    score: 1900,
  },
  {
    rank: 8,
    userId: 'u-leader-8',
    username: 'StudyBuddy',
    score: 1650,
  },
  {
    rank: 9,
    userId: 'u-leader-9',
    username: 'QuizNinja',
    score: 1400,
  },
  {
    rank: 10,
    userId: 'u-leader-10',
    username: 'BrainBoost',
    score: 1200,
  },
];

// Generate daily stats for a date range
export const generateMockDailyStats = (
  startDate: string,
  endDate: string
): DailyStatsResponse[] => {
  const stats: DailyStatsResponse[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Simulate lower activity on weekends
    const baseCards = isWeekend ? 10 : 25;
    const variance = Math.floor(Math.random() * 10);

    stats.push({
      date: d.toISOString().split('T')[0],
      cardsStudied: baseCards + variance,
      newCards: Math.floor((baseCards + variance) * 0.4),
      reviewCards: Math.ceil((baseCards + variance) * 0.6),
      studyTimeSeconds: (baseCards + variance) * 60 + Math.floor(Math.random() * 600),
    });
  }

  return stats;
};

export const getMockUserStats = (): UserStatsResponse => ({ ...mockUserStats });

export const getMockStreak = (): StreakResponse => ({ ...mockStreakResponse });

export const getMockLeaderboard = (date?: string): LeaderboardEntryResponse[] => {
  // In a real app, leaderboard might vary by date
  return [...mockLeaderboard];
};

export const getMockDailyStats = (
  startDate: string,
  endDate: string
): DailyStatsResponse[] => {
  return generateMockDailyStats(startDate, endDate);
};
