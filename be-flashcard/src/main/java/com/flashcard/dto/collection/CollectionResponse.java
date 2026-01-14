package com.flashcard.dto.collection;

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
public class CollectionResponse {
    private UUID id;
    private UUID courseId;
    private String courseTitle;
    private String title;
    private String description;
    private UUID createdById;
    private String createdByUsername;
    private OffsetDateTime createdAt;
    private Integer cardCount;
}
