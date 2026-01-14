package com.flashcard.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionResponse {
    private Integer totalDueCards;
    private Integer totalNewCards;
    private Integer totalReviewCards;
    private List<StudyCardResponse> cards;
}
