package com.flashcard.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private Integer totalCardsLearned;
    private Integer totalReviews;
    private Integer currentStreak;
    private Integer longestStreak;
    private LocalDate lastStudyDate;
    private Integer todayCardsStudied;
    private Integer todayNewCards;
    private Integer todayReviewCards;
    private Integer todayStudyTimeSeconds;
}
