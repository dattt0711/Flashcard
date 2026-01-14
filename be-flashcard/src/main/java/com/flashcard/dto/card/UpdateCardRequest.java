package com.flashcard.dto.card;

import lombok.Data;

import java.util.UUID;

@Data
public class UpdateCardRequest {
    private String frontText;
    private UUID frontImageId;
    private UUID frontAudioId;
    private String backText;
    private UUID backImageId;
    private UUID backAudioId;
}
