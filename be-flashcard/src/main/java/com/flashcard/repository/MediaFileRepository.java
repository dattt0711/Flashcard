package com.flashcard.repository;

import com.flashcard.entity.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {

    List<MediaFile> findByOwnerId(UUID ownerId);

    List<MediaFile> findByRelatedTypeAndRelatedId(String relatedType, UUID relatedId);

    Optional<MediaFile> findByObjectKey(String objectKey);

    List<MediaFile> findByRelatedIdIsNullAndIsActiveTrue();
}
