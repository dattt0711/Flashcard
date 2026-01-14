package com.flashcard.repository;

import com.flashcard.entity.UserCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserCardRepository extends JpaRepository<UserCard, UUID> {

    Optional<UserCard> findByUserIdAndCardId(UUID userId, UUID cardId);

    List<UserCard> findByUserId(UUID userId);

    @Query("SELECT uc FROM UserCard uc WHERE uc.user.id = :userId AND uc.nextReviewAt <= :now")
    List<UserCard> findDueCards(@Param("userId") UUID userId, @Param("now") OffsetDateTime now);

    @Query("SELECT uc FROM UserCard uc WHERE uc.user.id = :userId AND uc.card.collection.id = :collectionId")
    List<UserCard> findByUserIdAndCollectionId(@Param("userId") UUID userId, @Param("collectionId") UUID collectionId);

    long countByUserId(UUID userId);
}
