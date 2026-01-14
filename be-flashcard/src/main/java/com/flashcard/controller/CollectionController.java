package com.flashcard.controller;

import com.flashcard.dto.collection.*;
import com.flashcard.dto.common.ApiResponse;
import com.flashcard.service.CollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
@Tag(name = "Collections", description = "Collection management endpoints")
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    @Operation(summary = "Create collection", description = "Create a new collection in a course")
    public ResponseEntity<ApiResponse<CollectionResponse>> createCollection(@Valid @RequestBody CreateCollectionRequest request) {
        CollectionResponse response = collectionService.createCollection(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Collection created", response));
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get collections by course", description = "Get all collections in a course")
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getCollectionsByCourse(@PathVariable UUID courseId) {
        List<CollectionResponse> collections = collectionService.getCollectionsByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success(collections));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get collection", description = "Get collection by ID")
    public ResponseEntity<ApiResponse<CollectionResponse>> getCollection(@PathVariable UUID id) {
        CollectionResponse response = collectionService.getCollectionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update collection", description = "Update collection by ID")
    public ResponseEntity<ApiResponse<CollectionResponse>> updateCollection(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCollectionRequest request) {
        CollectionResponse response = collectionService.updateCollection(id, request);
        return ResponseEntity.ok(ApiResponse.success("Collection updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete collection", description = "Delete collection by ID")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(@PathVariable UUID id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.ok(ApiResponse.success("Collection deleted", null));
    }
}
