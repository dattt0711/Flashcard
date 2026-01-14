package com.flashcard.service;

import com.flashcard.dto.card.*;

import java.util.List;
import java.util.UUID;

public interface CardService {
    CardResponse createCard(CreateCardRequest request);
    List<CardResponse> createCards(List<CreateCardRequest> requests);
    List<CardResponse> getCardsByCollection(UUID collectionId);
    CardResponse getCardById(UUID id);
    CardResponse updateCard(UUID id, UpdateCardRequest request);
    void deleteCard(UUID id);
}
