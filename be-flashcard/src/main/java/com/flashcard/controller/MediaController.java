package com.flashcard.controller;

import com.flashcard.dto.common.ApiResponse;
import com.flashcard.dto.media.*;
import com.flashcard.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "Media file upload and management")
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Direct file upload", description = "Upload file directly to MinIO")
    public ResponseEntity<ApiResponse<MediaFileResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "relatedType", required = false) String relatedType,
            @RequestParam(value = "relatedId", required = false) UUID relatedId) {
        MediaFileResponse response = mediaService.uploadFile(file, relatedType, relatedId);
        return ResponseEntity.ok(ApiResponse.success("File uploaded", response));
    }

    @PostMapping("/upload-url")
    @Operation(summary = "Generate presigned upload URL", description = "For client-side direct upload to MinIO")
    public ResponseEntity<ApiResponse<UploadUrlResponse>> generateUploadUrl(
            @Valid @RequestBody UploadUrlRequest request) {
        UploadUrlResponse response = mediaService.generateUploadUrl(request);
        return ResponseEntity.ok(ApiResponse.success("Upload URL generated", response));
    }

    @PostMapping("/confirm")
    @Operation(summary = "Confirm upload completion")
    public ResponseEntity<ApiResponse<MediaFileResponse>> confirmUpload(
            @Valid @RequestBody ConfirmUploadRequest request) {
        MediaFileResponse response = mediaService.confirmUpload(request);
        return ResponseEntity.ok(ApiResponse.success("Upload confirmed", response));
    }

    @GetMapping("/{mediaId}")
    @Operation(summary = "Get media file details with presigned URL")
    public ResponseEntity<ApiResponse<MediaFileResponse>> getMedia(@PathVariable UUID mediaId) {
        MediaFileResponse response = mediaService.getMediaFile(mediaId);
        return ResponseEntity.ok(ApiResponse.success("Media retrieved", response));
    }

    @GetMapping("/{mediaId}/url")
    @Operation(summary = "Get presigned URL for media")
    public ResponseEntity<ApiResponse<String>> getMediaUrl(@PathVariable UUID mediaId) {
        String url = mediaService.getMediaUrl(mediaId);
        return ResponseEntity.ok(ApiResponse.success("URL generated", url));
    }

    @GetMapping("/related/{relatedType}/{relatedId}")
    @Operation(summary = "Get all media for a related entity")
    public ResponseEntity<ApiResponse<List<MediaFileResponse>>> getMediaByRelated(
            @PathVariable String relatedType,
            @PathVariable UUID relatedId) {
        List<MediaFileResponse> response = mediaService.getMediaByRelated(relatedType, relatedId);
        return ResponseEntity.ok(ApiResponse.success("Media retrieved", response));
    }

    @DeleteMapping("/{mediaId}")
    @Operation(summary = "Delete media file")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(@PathVariable UUID mediaId) {
        mediaService.deleteMedia(mediaId);
        return ResponseEntity.ok(ApiResponse.success("Media deleted", null));
    }
}
