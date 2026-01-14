package com.flashcard.controller;

import com.flashcard.dto.common.ApiResponse;
import com.flashcard.dto.study.*;
import com.flashcard.service.StudyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/study")
@RequiredArgsConstructor
@Tag(name = "Study", description = "Study session and spaced repetition endpoints")
public class StudyController {

    private final StudyService studyService;

    @GetMapping("/session")
    @Operation(summary = "Get study session", description = "Get cards due for review and new cards")
    public ResponseEntity<ApiResponse<StudySessionResponse>> getStudySession(
            @RequestParam(required = false) UUID collectionId,
            @RequestParam(defaultValue = "20") Integer limit) {
        StudySessionResponse response = studyService.getStudySession(collectionId, limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/session/collection/{collectionId}")
    @Operation(summary = "Get study session by collection", description = "Get cards due for review in a specific collection")
    public ResponseEntity<ApiResponse<StudySessionResponse>> getStudySessionByCollection(
            @PathVariable UUID collectionId,
            @RequestParam(defaultValue = "20") Integer limit) {
        StudySessionResponse response = studyService.getStudySession(collectionId, limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/review")
    @Operation(summary = "Submit review", description = "Submit a card review with rating (SM-2 algorithm)")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = studyService.submitReview(request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted", response));
    }

    @PostMapping("/start/{cardId}")
    @Operation(summary = "Start learning card", description = "Start learning a new card (initialize user_card)")
    public ResponseEntity<ApiResponse<StudyCardResponse>> startLearningCard(@PathVariable UUID cardId) {
        StudyCardResponse response = studyService.startLearningCard(cardId);
        return ResponseEntity.ok(ApiResponse.success("Card added to learning", response));
    }

    @GetMapping("/progress/collection/{collectionId}")
    @Operation(summary = "Get collection progress", description = "Get learning progress for a collection")
    public ResponseEntity<ApiResponse<CollectionProgressResponse>> getCollectionProgress(@PathVariable UUID collectionId) {
        CollectionProgressResponse response = studyService.getCollectionProgress(collectionId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
