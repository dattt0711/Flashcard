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
public class DailyStatsResponse {
    private LocalDate date;
    private Integer cardsStudied;
    private Integer newCards;
    private Integer reviewCards;
    private Integer studyTimeSeconds;
}
