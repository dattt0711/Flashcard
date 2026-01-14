package com.flashcard.service;

import com.flashcard.dto.stats.*;

import java.time.LocalDate;
import java.util.List;

public interface StatsService {
    UserStatsResponse getUserStats();
    List<DailyStatsResponse> getDailyStats(LocalDate startDate, LocalDate endDate);
    StreakResponse getStreak();
    List<LeaderboardEntryResponse> getLeaderboard(LocalDate date);
}
