package com.flashcard.dto.media;

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
public class MediaFileResponse {

    private UUID id;
    private UUID ownerId;
    private String relatedType;
    private UUID relatedId;
    private String fileType;
    private String mimeType;
    private Long fileSize;
    private Integer durationMs;
    private String url;
    private OffsetDateTime createdAt;
}
