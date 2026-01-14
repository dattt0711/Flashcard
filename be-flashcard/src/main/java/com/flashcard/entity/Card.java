package com.flashcard.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id", nullable = false)
    private Collection collection;

    @Column(name = "front_text", columnDefinition = "TEXT", nullable = false)
    private String frontText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "front_image_id")
    private MediaFile frontImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "front_audio_id")
    private MediaFile frontAudio;

    @Column(name = "back_text", columnDefinition = "TEXT", nullable = false)
    private String backText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "back_image_id")
    private MediaFile backImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "back_audio_id")
    private MediaFile backAudio;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
