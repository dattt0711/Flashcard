package com.flashcard.service.impl;

import com.flashcard.dto.card.*;
import com.flashcard.entity.Card;
import com.flashcard.entity.Collection;
import com.flashcard.entity.Course;
import com.flashcard.entity.MediaFile;
import com.flashcard.exception.BadRequestException;
import com.flashcard.exception.ResourceNotFoundException;
import com.flashcard.repository.CardRepository;
import com.flashcard.repository.CollectionRepository;
import com.flashcard.repository.MediaFileRepository;
import com.flashcard.security.SecurityUtils;
import com.flashcard.service.CardService;
import com.flashcard.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final CollectionRepository collectionRepository;
    private final MediaFileRepository mediaFileRepository;
    private final MediaService mediaService;

    @Override
    @Transactional
    public CardResponse createCard(CreateCardRequest request) {
        Collection collection = collectionRepository.findById(request.getCollectionId())
            .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", request.getCollectionId()));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!collection.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("You can only add cards to your own collections");
        }

        Card card = Card.builder()
            .collection(collection)
            .frontText(request.getFrontText())
            .frontImage(getMediaFile(request.getFrontImageId()))
            .frontAudio(getMediaFile(request.getFrontAudioId()))
            .backText(request.getBackText())
            .backImage(getMediaFile(request.getBackImageId()))
            .backAudio(getMediaFile(request.getBackAudioId()))
            .build();
        card = cardRepository.save(card);

        return mapToResponse(card);
    }

    @Override
    @Transactional
    public List<CardResponse> createCards(List<CreateCardRequest> requests) {
        if (requests.isEmpty()) {
            return new ArrayList<>();
        }

        UUID collectionId = requests.get(0).getCollectionId();
        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", collectionId));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!collection.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("You can only add cards to your own collections");
        }

        List<Card> cards = requests.stream()
            .map(request -> {
                if (!request.getCollectionId().equals(collectionId)) {
                    throw new BadRequestException("All cards must belong to the same collection");
                }
                return Card.builder()
                    .collection(collection)
                    .frontText(request.getFrontText())
                    .frontImage(getMediaFile(request.getFrontImageId()))
                    .frontAudio(getMediaFile(request.getFrontAudioId()))
                    .backText(request.getBackText())
                    .backImage(getMediaFile(request.getBackImageId()))
                    .backAudio(getMediaFile(request.getBackAudioId()))
                    .build();
            })
            .toList();

        cards = cardRepository.saveAll(cards);
        return cards.stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<CardResponse> getCardsByCollection(UUID collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", collectionId));

        UUID userId = SecurityUtils.getCurrentUserId();
        Course course = collection.getCourse();
        if (!course.getIsPublic() && !course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Access denied to this collection");
        }

        return cardRepository.findByCollectionId(collectionId).stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Override
    public CardResponse getCardById(UUID id) {
        Card card = cardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Card", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        Course course = card.getCollection().getCourse();
        if (!course.getIsPublic() && !course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Access denied to this card");
        }

        return mapToResponse(card);
    }

    @Override
    @Transactional
    public CardResponse updateCard(UUID id, UpdateCardRequest request) {
        Card card = cardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Card", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!card.getCollection().getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Only the owner can update this card");
        }

        if (request.getFrontText() != null) {
            card.setFrontText(request.getFrontText());
        }
        if (request.getFrontImageId() != null) {
            card.setFrontImage(getMediaFile(request.getFrontImageId()));
        }
        if (request.getFrontAudioId() != null) {
            card.setFrontAudio(getMediaFile(request.getFrontAudioId()));
        }
        if (request.getBackText() != null) {
            card.setBackText(request.getBackText());
        }
        if (request.getBackImageId() != null) {
            card.setBackImage(getMediaFile(request.getBackImageId()));
        }
        if (request.getBackAudioId() != null) {
            card.setBackAudio(getMediaFile(request.getBackAudioId()));
        }

        card = cardRepository.save(card);
        return mapToResponse(card);
    }

    @Override
    @Transactional
    public void deleteCard(UUID id) {
        Card card = cardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Card", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!card.getCollection().getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Only the owner can delete this card");
        }

        cardRepository.delete(card);
    }

    private MediaFile getMediaFile(UUID mediaId) {
        if (mediaId == null) {
            return null;
        }
        return mediaFileRepository.findById(mediaId)
            .orElseThrow(() -> new ResourceNotFoundException("MediaFile", "id", mediaId));
    }

    private String getMediaUrl(MediaFile mediaFile) {
        if (mediaFile == null) {
            return null;
        }
        return mediaService.getMediaUrl(mediaFile.getId());
    }

    private CardResponse mapToResponse(Card card) {
        return CardResponse.builder()
            .id(card.getId())
            .collectionId(card.getCollection().getId())
            .collectionTitle(card.getCollection().getTitle())
            .frontText(card.getFrontText())
            .frontImageId(card.getFrontImage() != null ? card.getFrontImage().getId() : null)
            .frontImageUrl(getMediaUrl(card.getFrontImage()))
            .frontAudioId(card.getFrontAudio() != null ? card.getFrontAudio().getId() : null)
            .frontAudioUrl(getMediaUrl(card.getFrontAudio()))
            .backText(card.getBackText())
            .backImageId(card.getBackImage() != null ? card.getBackImage().getId() : null)
            .backImageUrl(getMediaUrl(card.getBackImage()))
            .backAudioId(card.getBackAudio() != null ? card.getBackAudio().getId() : null)
            .backAudioUrl(getMediaUrl(card.getBackAudio()))
            .createdAt(card.getCreatedAt())
            .build();
    }
}
