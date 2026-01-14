package com.flashcard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "user_daily_stats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDailyStats {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "cards_studied", nullable = false)
    @Builder.Default
    private Integer cardsStudied = 0;

    @Column(name = "new_cards", nullable = false)
    @Builder.Default
    private Integer newCards = 0;

    @Column(name = "review_cards", nullable = false)
    @Builder.Default
    private Integer reviewCards = 0;

    @Column(name = "study_time_seconds", nullable = false)
    @Builder.Default
    private Integer studyTimeSeconds = 0;
}
