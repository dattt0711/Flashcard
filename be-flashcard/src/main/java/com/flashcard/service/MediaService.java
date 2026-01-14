package com.flashcard.service;

import com.flashcard.dto.media.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface MediaService {

    MediaFileResponse uploadFile(MultipartFile file, String relatedType, UUID relatedId);

    UploadUrlResponse generateUploadUrl(UploadUrlRequest request);

    MediaFileResponse confirmUpload(ConfirmUploadRequest request);

    MediaFileResponse getMediaFile(UUID mediaId);

    String getMediaUrl(UUID mediaId);

    List<MediaFileResponse> getMediaByRelated(String relatedType, UUID relatedId);

    void deleteMedia(UUID mediaId);
}
