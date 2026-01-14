package com.flashcard.service.impl;

import com.flashcard.dto.collection.*;
import com.flashcard.entity.Collection;
import com.flashcard.entity.Course;
import com.flashcard.entity.User;
import com.flashcard.exception.BadRequestException;
import com.flashcard.exception.ResourceNotFoundException;
import com.flashcard.repository.CardRepository;
import com.flashcard.repository.CollectionRepository;
import com.flashcard.repository.CourseRepository;
import com.flashcard.repository.UserRepository;
import com.flashcard.security.SecurityUtils;
import com.flashcard.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;
    private final CourseRepository courseRepository;
    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CollectionResponse createCollection(CreateCollectionRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Course course = courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        if (!course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("You can only add collections to your own courses");
        }

        Collection collection = Collection.builder()
            .course(course)
            .title(request.getTitle())
            .description(request.getDescription())
            .createdBy(user)
            .build();
        collection = collectionRepository.save(collection);

        return mapToResponse(collection);
    }

    @Override
    public List<CollectionResponse> getCollectionsByCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!course.getIsPublic() && !course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Access denied to this course");
        }

        return collectionRepository.findByCourseId(courseId).stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Override
    public CollectionResponse getCollectionById(UUID id) {
        Collection collection = collectionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        Course course = collection.getCourse();
        if (!course.getIsPublic() && !course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Access denied to this collection");
        }

        return mapToResponse(collection);
    }

    @Override
    @Transactional
    public CollectionResponse updateCollection(UUID id, UpdateCollectionRequest request) {
        Collection collection = collectionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!collection.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Only the owner can update this collection");
        }

        if (request.getTitle() != null) {
            collection.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            collection.setDescription(request.getDescription());
        }

        collection = collectionRepository.save(collection);
        return mapToResponse(collection);
    }

    @Override
    @Transactional
    public void deleteCollection(UUID id) {
        Collection collection = collectionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!collection.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Only the owner can delete this collection");
        }

        collectionRepository.delete(collection);
    }

    private CollectionResponse mapToResponse(Collection collection) {
        long cardCount = cardRepository.countByCollectionId(collection.getId());

        return CollectionResponse.builder()
            .id(collection.getId())
            .courseId(collection.getCourse().getId())
            .courseTitle(collection.getCourse().getTitle())
            .title(collection.getTitle())
            .description(collection.getDescription())
            .createdById(collection.getCreatedBy().getId())
            .createdByUsername(collection.getCreatedBy().getUsername())
            .createdAt(collection.getCreatedAt())
            .cardCount((int) cardCount)
            .build();
    }
}
