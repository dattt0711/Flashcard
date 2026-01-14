package com.flashcard.dto.study;

import com.flashcard.enums.Rating;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ReviewRequest {

    @NotNull(message = "Card ID is required")
    private UUID cardId;

    @NotNull(message = "Rating is required")
    private Rating rating;

    private Integer studyTimeSeconds;
}
