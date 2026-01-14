package com.flashcard.dto.collection;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCollectionRequest {

    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    private String description;
}
