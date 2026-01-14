import {
  ApiResponse,
  UserStatsResponse,
  StreakResponse,
  LeaderboardEntryResponse,
  DailyStatsResponse,
} from '@/types';
import { get } from './api-client';
import { API_CONFIG, isMockMode } from './config';
import {
  getMockUserStats,
  getMockStreak,
  getMockLeaderboard,
  getMockDailyStats,
} from '@/mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const statsService = {
  // Get current user's learning statistics
  getUserStats: async (): Promise<ApiResponse<UserStatsResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'User stats retrieved successfully',
        data: getMockUserStats(),
      };
    }
    return get<UserStatsResponse>('/api/stats');
  },

  // Get current and longest streak
  getStreak: async (): Promise<ApiResponse<StreakResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Streak info retrieved successfully',
        data: getMockStreak(),
      };
    }
    return get<StreakResponse>('/api/stats/streak');
  },

  // Get daily leaderboard
  getLeaderboard: async (date?: string): Promise<ApiResponse<LeaderboardEntryResponse[]>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Leaderboard retrieved successfully',
        data: getMockLeaderboard(date),
      };
    }

    let path = '/api/stats/leaderboard';
    if (date) {
      path += `?date=${date}`;
    }
    return get<LeaderboardEntryResponse[]>(path);
  },

  // Get daily stats for a date range
  getDailyStats: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<DailyStatsResponse[]>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Daily stats retrieved successfully',
        data: getMockDailyStats(startDate, endDate),
      };
    }
    return get<DailyStatsResponse[]>(
      `/api/stats/daily?startDate=${startDate}&endDate=${endDate}`
    );
  },
};
