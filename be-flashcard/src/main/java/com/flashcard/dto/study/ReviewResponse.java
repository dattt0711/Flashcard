package com.flashcard.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID cardId;
    private Integer newRepetition;
    private Integer newIntervalDays;
    private Double newEaseFactor;
    private OffsetDateTime nextReviewAt;
    private String message;
}
