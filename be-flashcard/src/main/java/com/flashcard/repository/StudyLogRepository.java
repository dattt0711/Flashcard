package com.flashcard.repository;

import com.flashcard.entity.StudyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface StudyLogRepository extends JpaRepository<StudyLog, UUID> {

    List<StudyLog> findByUserId(UUID userId);

    List<StudyLog> findByUserIdAndCardId(UUID userId, UUID cardId);

    @Query("SELECT sl FROM StudyLog sl WHERE sl.user.id = :userId AND sl.reviewedAt >= :startDate AND sl.reviewedAt < :endDate")
    List<StudyLog> findByUserIdAndDateRange(
        @Param("userId") UUID userId,
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate
    );

    long countByUserId(UUID userId);
}
