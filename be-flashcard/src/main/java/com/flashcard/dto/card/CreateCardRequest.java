package com.flashcard.dto.card;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateCardRequest {

    @NotNull(message = "Collection ID is required")
    private UUID collectionId;

    @NotBlank(message = "Front text is required")
    private String frontText;

    private UUID frontImageId;

    private UUID frontAudioId;

    @NotBlank(message = "Back text is required")
    private String backText;

    private UUID backImageId;

    private UUID backAudioId;
}
