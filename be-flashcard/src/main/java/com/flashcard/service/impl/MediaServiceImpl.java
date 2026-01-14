package com.flashcard.service.impl;

import com.flashcard.dto.media.*;
import com.flashcard.entity.MediaFile;
import com.flashcard.entity.User;
import com.flashcard.exception.BadRequestException;
import com.flashcard.exception.ResourceNotFoundException;
import com.flashcard.repository.MediaFileRepository;
import com.flashcard.repository.UserRepository;
import com.flashcard.security.SecurityUtils;
import com.flashcard.service.MediaService;
import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaServiceImpl implements MediaService {

    private final MinioClient minioClient;
    private final MediaFileRepository mediaFileRepository;
    private final UserRepository userRepository;

    @Value("${minio.bucket}")
    private String bucket;

    @Value("${minio.presigned-url-expiry}")
    private int presignedUrlExpiry;

    private static final Set<String> ALLOWED_AUDIO_TYPES = Set.of(
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp3"
    );

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private static final long MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB

    @Override
    @Transactional
    public MediaFileResponse uploadFile(MultipartFile file, String relatedType, UUID relatedId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String mimeType = file.getContentType();
        if (mimeType == null) {
            throw new BadRequestException("Could not determine file type");
        }

        String fileType = determineFileType(mimeType);
        validateMimeType(fileType, mimeType);
        validateFileSize(fileType, file.getSize());

        String extension = getExtensionFromMimeType(mimeType);
        String objectKey = generateObjectKey(userId, fileType, extension);

        // Upload to MinIO
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(mimeType)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to upload file to MinIO: {}", e.getMessage());
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }

        // Save metadata to database
        MediaFile mediaFile = MediaFile.builder()
                .owner(user)
                .relatedType(relatedType)
                .relatedId(relatedId)
                .fileType(fileType)
                .mimeType(mimeType)
                .bucket(bucket)
                .objectKey(objectKey)
                .fileSize(file.getSize())
                .isActive(true)
                .build();

        mediaFile = mediaFileRepository.save(mediaFile);

        return mapToResponse(mediaFile, getPresignedGetUrl(mediaFile.getObjectKey()));
    }

    private String determineFileType(String mimeType) {
        if (mimeType.startsWith("audio/")) {
            return "audio";
        } else if (mimeType.startsWith("image/")) {
            return "image";
        }
        throw new BadRequestException("Unsupported file type: " + mimeType);
    }

    @Override
    @Transactional
    public UploadUrlResponse generateUploadUrl(UploadUrlRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        validateMimeType(request.getFileType(), request.getMimeType());
        validateFileSize(request.getFileType(), request.getFileSize());

        String extension = getExtensionFromMimeType(request.getMimeType());
        String objectKey = generateObjectKey(userId, request.getFileType(), extension);

        MediaFile mediaFile = MediaFile.builder()
                .owner(user)
                .relatedType(request.getRelatedType())
                .relatedId(request.getRelatedId())
                .fileType(request.getFileType())
                .mimeType(request.getMimeType())
                .bucket(bucket)
                .objectKey(objectKey)
                .fileSize(request.getFileSize())
                .isActive(false) // Will be activated after upload confirmation
                .build();

        mediaFile = mediaFileRepository.save(mediaFile);

        try {
            String uploadUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(bucket)
                            .object(objectKey)
                            .expiry(presignedUrlExpiry, TimeUnit.SECONDS)
                            .extraHeaders(Map.of("Content-Type", request.getMimeType()))
                            .build()
            );

            return UploadUrlResponse.builder()
                    .mediaId(mediaFile.getId())
                    .uploadUrl(uploadUrl)
                    .bucket(bucket)
                    .objectKey(objectKey)
                    .expiresIn(presignedUrlExpiry)
                    .build();

        } catch (Exception e) {
            log.error("Failed to generate presigned URL: {}", e.getMessage());
            throw new BadRequestException("Failed to generate upload URL");
        }
    }

    @Override
    @Transactional
    public MediaFileResponse confirmUpload(ConfirmUploadRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();

        MediaFile mediaFile = mediaFileRepository.findById(request.getMediaId())
                .orElseThrow(() -> new ResourceNotFoundException("MediaFile", "id", request.getMediaId()));

        if (!mediaFile.getOwner().getId().equals(userId)) {
            throw new BadRequestException("You can only confirm your own uploads");
        }

        // Verify object exists in MinIO
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(mediaFile.getObjectKey())
                            .build()
            );
        } catch (Exception e) {
            log.error("Object not found in MinIO: {}", e.getMessage());
            throw new BadRequestException("File not uploaded yet");
        }

        // Update media file
        mediaFile.setIsActive(true);
        if (request.getFileSize() != null) {
            mediaFile.setFileSize(request.getFileSize());
        }
        if (request.getDurationMs() != null) {
            mediaFile.setDurationMs(request.getDurationMs());
        }
        if (request.getRelatedType() != null) {
            mediaFile.setRelatedType(request.getRelatedType());
        }
        if (request.getRelatedId() != null) {
            mediaFile.setRelatedId(request.getRelatedId());
        }

        mediaFile = mediaFileRepository.save(mediaFile);

        return mapToResponse(mediaFile, getPresignedGetUrl(mediaFile.getObjectKey()));
    }

    @Override
    public MediaFileResponse getMediaFile(UUID mediaId) {
        MediaFile mediaFile = mediaFileRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("MediaFile", "id", mediaId));

        return mapToResponse(mediaFile, getPresignedGetUrl(mediaFile.getObjectKey()));
    }

    @Override
    public String getMediaUrl(UUID mediaId) {
        MediaFile mediaFile = mediaFileRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("MediaFile", "id", mediaId));

        return getPresignedGetUrl(mediaFile.getObjectKey());
    }

    @Override
    public List<MediaFileResponse> getMediaByRelated(String relatedType, UUID relatedId) {
        return mediaFileRepository.findByRelatedTypeAndRelatedId(relatedType, relatedId)
                .stream()
                .filter(MediaFile::getIsActive)
                .map(mf -> mapToResponse(mf, getPresignedGetUrl(mf.getObjectKey())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMedia(UUID mediaId) {
        UUID userId = SecurityUtils.getCurrentUserId();

        MediaFile mediaFile = mediaFileRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("MediaFile", "id", mediaId));

        if (!mediaFile.getOwner().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own media");
        }

        // Soft delete - mark as inactive
        mediaFile.setIsActive(false);
        mediaFileRepository.save(mediaFile);

        // Optionally delete from MinIO (or let a cleanup job handle it)
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(mediaFile.getObjectKey())
                            .build()
            );
        } catch (Exception e) {
            log.warn("Failed to delete object from MinIO: {}", e.getMessage());
        }
    }

    private void validateMimeType(String fileType, String mimeType) {
        Set<String> allowedTypes = "audio".equals(fileType) ? ALLOWED_AUDIO_TYPES : ALLOWED_IMAGE_TYPES;
        if (!allowedTypes.contains(mimeType.toLowerCase())) {
            throw new BadRequestException("Invalid MIME type: " + mimeType);
        }
    }

    private void validateFileSize(String fileType, Long fileSize) {
        if (fileSize == null) return;

        long maxSize = "audio".equals(fileType) ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE;
        if (fileSize > maxSize) {
            throw new BadRequestException("File too large. Maximum size: " + (maxSize / 1024 / 1024) + "MB");
        }
    }

    private String getExtensionFromMimeType(String mimeType) {
        return switch (mimeType.toLowerCase()) {
            case "audio/mpeg", "audio/mp3" -> "mp3";
            case "audio/wav" -> "wav";
            case "audio/ogg" -> "ogg";
            case "audio/webm" -> "webm";
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            case "image/gif" -> "gif";
            default -> "bin";
        };
    }

    private String generateObjectKey(UUID userId, String fileType, String extension) {
        String env = "dev"; // Could be from environment variable
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("%s/%s/%s/%s.%s", env, userId, fileType, uuid, extension);
    }

    private String getPresignedGetUrl(String objectKey) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucket)
                            .object(objectKey)
                            .expiry(presignedUrlExpiry, TimeUnit.SECONDS)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to generate presigned GET URL: {}", e.getMessage());
            return null;
        }
    }

    private MediaFileResponse mapToResponse(MediaFile mediaFile, String url) {
        return MediaFileResponse.builder()
                .id(mediaFile.getId())
                .ownerId(mediaFile.getOwner().getId())
                .relatedType(mediaFile.getRelatedType())
                .relatedId(mediaFile.getRelatedId())
                .fileType(mediaFile.getFileType())
                .mimeType(mediaFile.getMimeType())
                .fileSize(mediaFile.getFileSize())
                .durationMs(mediaFile.getDurationMs())
                .url(url)
                .createdAt(mediaFile.getCreatedAt())
                .build();
    }
}
