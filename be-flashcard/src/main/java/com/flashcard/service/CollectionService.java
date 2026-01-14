package com.flashcard.service;

import com.flashcard.dto.collection.*;

import java.util.List;
import java.util.UUID;

public interface CollectionService {
    CollectionResponse createCollection(CreateCollectionRequest request);
    List<CollectionResponse> getCollectionsByCourse(UUID courseId);
    CollectionResponse getCollectionById(UUID id);
    CollectionResponse updateCollection(UUID id, UpdateCollectionRequest request);
    void deleteCollection(UUID id);
}
