package com.flashcard.dto.media;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ConfirmUploadRequest {

    @NotNull(message = "Media ID is required")
    private UUID mediaId;

    private Long fileSize;

    private Integer durationMs;

    private String relatedType;

    private UUID relatedId;
}
