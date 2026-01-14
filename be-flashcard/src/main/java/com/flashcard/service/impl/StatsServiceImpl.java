package com.flashcard.service.impl;

import com.flashcard.dto.stats.*;
import com.flashcard.entity.LeaderboardDaily;
import com.flashcard.entity.UserDailyStats;
import com.flashcard.entity.UserStreak;
import com.flashcard.repository.*;
import com.flashcard.security.SecurityUtils;
import com.flashcard.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final UserDailyStatsRepository userDailyStatsRepository;
    private final UserStreakRepository userStreakRepository;
    private final LeaderboardDailyRepository leaderboardDailyRepository;
    private final UserCardRepository userCardRepository;
    private final StudyLogRepository studyLogRepository;

    @Override
    public UserStatsResponse getUserStats() {
        UUID userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        UserStreak streak = userStreakRepository.findById(userId)
            .orElse(UserStreak.builder().currentStreak(0).longestStreak(0).build());

        UserDailyStats todayStats = userDailyStatsRepository.findByUserIdAndDate(userId, today)
            .orElse(UserDailyStats.builder()
                .cardsStudied(0)
                .newCards(0)
                .reviewCards(0)
                .studyTimeSeconds(0)
                .build());

        long totalCardsLearned = userCardRepository.countByUserId(userId);
        long totalReviews = studyLogRepository.countByUserId(userId);

        return UserStatsResponse.builder()
            .totalCardsLearned((int) totalCardsLearned)
            .totalReviews((int) totalReviews)
            .currentStreak(streak.getCurrentStreak())
            .longestStreak(streak.getLongestStreak())
            .lastStudyDate(streak.getLastStudyDate())
            .todayCardsStudied(todayStats.getCardsStudied())
            .todayNewCards(todayStats.getNewCards())
            .todayReviewCards(todayStats.getReviewCards())
            .todayStudyTimeSeconds(todayStats.getStudyTimeSeconds())
            .build();
    }

    @Override
    public List<DailyStatsResponse> getDailyStats(LocalDate startDate, LocalDate endDate) {
        UUID userId = SecurityUtils.getCurrentUserId();

        return userDailyStatsRepository.findByUserIdAndDateRange(userId, startDate, endDate).stream()
            .map(stats -> DailyStatsResponse.builder()
                .date(stats.getDate())
                .cardsStudied(stats.getCardsStudied())
                .newCards(stats.getNewCards())
                .reviewCards(stats.getReviewCards())
                .studyTimeSeconds(stats.getStudyTimeSeconds())
                .build())
            .toList();
    }

    @Override
    public StreakResponse getStreak() {
        UUID userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        UserStreak streak = userStreakRepository.findById(userId)
            .orElse(UserStreak.builder().currentStreak(0).longestStreak(0).build());

        boolean studiedToday = streak.getLastStudyDate() != null && streak.getLastStudyDate().equals(today);

        return StreakResponse.builder()
            .currentStreak(streak.getCurrentStreak())
            .longestStreak(streak.getLongestStreak())
            .lastStudyDate(streak.getLastStudyDate())
            .studiedToday(studiedToday)
            .build();
    }

    @Override
    public List<LeaderboardEntryResponse> getLeaderboard(LocalDate date) {
        List<LeaderboardDaily> entries = leaderboardDailyRepository.findTop10ByDateOrderByScoreDesc(date);

        return entries.stream()
            .map(entry -> LeaderboardEntryResponse.builder()
                .rank(entry.getRank())
                .userId(entry.getUser().getId())
                .username(entry.getUser().getUsername())
                .score(entry.getScore())
                .build())
            .toList();
    }
}
