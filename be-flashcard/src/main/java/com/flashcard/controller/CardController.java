package com.flashcard.controller;

import com.flashcard.dto.card.*;
import com.flashcard.dto.common.ApiResponse;
import com.flashcard.service.CardService;
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
@RequestMapping("/api/cards")
@RequiredArgsConstructor
@Tag(name = "Cards", description = "Flashcard management endpoints")
public class CardController {

    private final CardService cardService;

    @PostMapping
    @Operation(summary = "Create card", description = "Create a new flashcard in a collection")
    public ResponseEntity<ApiResponse<CardResponse>> createCard(@Valid @RequestBody CreateCardRequest request) {
        CardResponse response = cardService.createCard(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Card created", response));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create cards in bulk", description = "Create multiple flashcards at once")
    public ResponseEntity<ApiResponse<List<CardResponse>>> createCards(@Valid @RequestBody List<CreateCardRequest> requests) {
        List<CardResponse> responses = cardService.createCards(requests);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Cards created", responses));
    }

    @GetMapping("/collection/{collectionId}")
    @Operation(summary = "Get cards by collection", description = "Get all cards in a collection")
    public ResponseEntity<ApiResponse<List<CardResponse>>> getCardsByCollection(@PathVariable UUID collectionId) {
        List<CardResponse> cards = cardService.getCardsByCollection(collectionId);
        return ResponseEntity.ok(ApiResponse.success(cards));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get card", description = "Get card by ID")
    public ResponseEntity<ApiResponse<CardResponse>> getCard(@PathVariable UUID id) {
        CardResponse response = cardService.getCardById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update card", description = "Update card by ID")
    public ResponseEntity<ApiResponse<CardResponse>> updateCard(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCardRequest request) {
        CardResponse response = cardService.updateCard(id, request);
        return ResponseEntity.ok(ApiResponse.success("Card updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete card", description = "Delete card by ID")
    public ResponseEntity<ApiResponse<Void>> deleteCard(@PathVariable UUID id) {
        cardService.deleteCard(id);
        return ResponseEntity.ok(ApiResponse.success("Card deleted", null));
    }
}
