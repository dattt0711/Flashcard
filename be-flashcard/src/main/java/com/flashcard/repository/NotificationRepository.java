package com.flashcard.repository;

import com.flashcard.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserIdOrderByScheduledAtDesc(UUID userId);

    List<Notification> findByUserIdAndIsSentFalse(UUID userId);

    @Query("SELECT n FROM Notification n WHERE n.isSent = false AND n.scheduledAt <= :now")
    List<Notification> findPendingNotifications(@Param("now") OffsetDateTime now);
}
