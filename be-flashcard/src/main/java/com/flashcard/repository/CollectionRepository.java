package com.flashcard.repository;

import com.flashcard.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, UUID> {

    List<Collection> findByCourseId(UUID courseId);

    List<Collection> findByCreatedById(UUID userId);
}
