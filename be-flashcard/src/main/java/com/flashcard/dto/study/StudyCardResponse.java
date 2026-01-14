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
public class StudyCardResponse {
    private UUID cardId;
    private String frontText;
    private String frontImageUrl;
    private String frontAudioUrl;
    private String backText;
    private String backImageUrl;
    private String backAudioUrl;
    private UUID collectionId;
    private String collectionTitle;
    private Integer repetition;
    private Integer intervalDays;
    private Double easeFactor;
    private OffsetDateTime lastReviewedAt;
    private OffsetDateTime nextReviewAt;
    private Boolean isNew;
}
