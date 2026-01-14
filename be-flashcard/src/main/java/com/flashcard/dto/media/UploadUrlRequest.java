package com.flashcard.dto.media;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.UUID;

@Data
public class UploadUrlRequest {

    @Pattern(regexp = "^(card|user)$", message = "Related type must be 'card' or 'user'")
    private String relatedType;

    private UUID relatedId;

    @NotBlank(message = "File type is required")
    @Pattern(regexp = "^(audio|image)$", message = "File type must be 'audio' or 'image'")
    private String fileType;

    @NotBlank(message = "MIME type is required")
    private String mimeType;

    private Long fileSize;
}
