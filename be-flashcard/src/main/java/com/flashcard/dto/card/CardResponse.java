package com.flashcard.dto.card;

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
public class CardResponse {
    private UUID id;
    private UUID collectionId;
    private String collectionTitle;
    private String frontText;
    private UUID frontImageId;
    private String frontImageUrl;
    private UUID frontAudioId;
    private String frontAudioUrl;
    private String backText;
    private UUID backImageId;
    private String backImageUrl;
    private UUID backAudioId;
    private String backAudioUrl;
    private OffsetDateTime createdAt;
}
