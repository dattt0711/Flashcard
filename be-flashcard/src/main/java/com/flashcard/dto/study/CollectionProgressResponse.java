package com.flashcard.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionProgressResponse {
    private UUID collectionId;
    private String collectionTitle;
    private Integer totalCards;
    private Integer learnedCards;
    private Integer dueCards;
    private Integer newCards;
    private Double progressPercent;
}
