package com.flashcard.dto.course;

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
public class CourseResponse {
    private UUID id;
    private String title;
    private String description;
    private UUID createdById;
    private String createdByUsername;
    private Boolean isPublic;
    private OffsetDateTime createdAt;
    private Integer collectionCount;
}
