package com.flashcard.service;

import com.flashcard.dto.study.*;

import java.util.UUID;

public interface StudyService {
    StudySessionResponse getStudySession(UUID collectionId, Integer limit);
    ReviewResponse submitReview(ReviewRequest request);
    StudyCardResponse startLearningCard(UUID cardId);
    CollectionProgressResponse getCollectionProgress(UUID collectionId);
}
