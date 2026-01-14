package com.flashcard.repository;

import com.flashcard.entity.LeaderboardDaily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaderboardDailyRepository extends JpaRepository<LeaderboardDaily, UUID> {

    List<LeaderboardDaily> findByDateOrderByRankAsc(LocalDate date);

    Optional<LeaderboardDaily> findByDateAndUserId(LocalDate date, UUID userId);

    List<LeaderboardDaily> findTop10ByDateOrderByScoreDesc(LocalDate date);
}
