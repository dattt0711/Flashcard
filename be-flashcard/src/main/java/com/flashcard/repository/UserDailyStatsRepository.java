package com.flashcard.repository;

import com.flashcard.entity.UserDailyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserDailyStatsRepository extends JpaRepository<UserDailyStats, UUID> {

    Optional<UserDailyStats> findByUserIdAndDate(UUID userId, LocalDate date);

    List<UserDailyStats> findByUserIdOrderByDateDesc(UUID userId);

    @Query("SELECT uds FROM UserDailyStats uds WHERE uds.user.id = :userId AND uds.date >= :startDate AND uds.date <= :endDate ORDER BY uds.date")
    List<UserDailyStats> findByUserIdAndDateRange(
        @Param("userId") UUID userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
