package com.flashcard.service.impl;

import com.flashcard.dto.study.*;
import com.flashcard.entity.*;
import com.flashcard.enums.Rating;
import com.flashcard.exception.BadRequestException;
import com.flashcard.exception.ResourceNotFoundException;
import com.flashcard.repository.*;
import com.flashcard.security.SecurityUtils;
import com.flashcard.service.MediaService;
import com.flashcard.service.StudyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final UserCardRepository userCardRepository;
    private final CardRepository cardRepository;
    private final CollectionRepository collectionRepository;
    private final StudyLogRepository studyLogRepository;
    private final UserRepository userRepository;
    private final UserDailyStatsRepository userDailyStatsRepository;
    private final UserStreakRepository userStreakRepository;
    private final LeaderboardDailyRepository leaderboardDailyRepository;
    private final MediaService mediaService;

    @Override
    public StudySessionResponse getStudySession(UUID collectionId, Integer limit) {
        log.info("getStudySession called with collectionId={}, limit={}", collectionId, limit);
        try {
            UUID userId = SecurityUtils.getCurrentUserId();
            log.debug("userId={}", userId);
            OffsetDateTime now = OffsetDateTime.now();

            List<UserCard> dueCards;
            List<Card> newCards = new ArrayList<>();

            if (collectionId != null) {
                log.debug("Fetching cards for collection: {}", collectionId);
                dueCards = userCardRepository.findByUserIdAndCollectionId(userId, collectionId).stream()
                    .filter(uc -> uc.getNextReviewAt() != null && uc.getNextReviewAt().isBefore(now))
                    .toList();
                log.debug("Found {} due cards", dueCards.size());

                List<UUID> learnedCardIds = userCardRepository.findByUserIdAndCollectionId(userId, collectionId)
                    .stream().map(uc -> uc.getCard().getId()).toList();
                log.debug("Learned card IDs count: {}", learnedCardIds.size());

                newCards = cardRepository.findByCollectionId(collectionId).stream()
                    .filter(card -> !learnedCardIds.contains(card.getId()))
                    .limit(limit - dueCards.size())
                    .toList();
                log.debug("Found {} new cards", newCards.size());
            } else {
                log.debug("No collectionId provided, fetching all due cards for user");
                dueCards = userCardRepository.findDueCards(userId, now);
                log.debug("Found {} due cards", dueCards.size());
            }

            List<StudyCardResponse> studyCards = new ArrayList<>();

            for (UserCard uc : dueCards.stream().limit(limit).toList()) {
                studyCards.add(mapToStudyCardResponse(uc, false));
            }

            for (Card card : newCards) {
                studyCards.add(mapNewCardToStudyCardResponse(card));
            }

            log.info("getStudySession completed successfully with {} study cards", studyCards.size());
            return StudySessionResponse.builder()
                .totalDueCards(dueCards.size())
                .totalNewCards(newCards.size())
                .totalReviewCards(dueCards.size())
                .cards(studyCards)
                .build();
        } catch (Exception e) {
            log.error("Error in getStudySession - collectionId={}, limit={}", collectionId, limit, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public ReviewResponse submitReview(ReviewRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Card card = cardRepository.findById(request.getCardId())
            .orElseThrow(() -> new ResourceNotFoundException("Card", "id", request.getCardId()));

        UserCard userCard = userCardRepository.findByUserIdAndCardId(userId, request.getCardId())
            .orElseGet(() -> createNewUserCard(user, card));

        // Apply SM-2 algorithm
        SM2Result sm2Result = applySM2(userCard, request.getRating());

        userCard.setRepetition(sm2Result.repetition);
        userCard.setEaseFactor(sm2Result.easeFactor);
        userCard.setIntervalDays(sm2Result.intervalDays);
        userCard.setLastReviewedAt(OffsetDateTime.now());
        userCard.setNextReviewAt(OffsetDateTime.now().plusDays(sm2Result.intervalDays));
        userCardRepository.save(userCard);

        // Log the study
        StudyLog log = StudyLog.builder()
            .user(user)
            .card(card)
            .rating(request.getRating())
            .build();
        studyLogRepository.save(log);

        // Update daily stats
        updateDailyStats(userId, request.getStudyTimeSeconds(), userCard.getRepetition() == 1);

        return ReviewResponse.builder()
            .cardId(card.getId())
            .newRepetition(sm2Result.repetition)
            .newIntervalDays(sm2Result.intervalDays)
            .newEaseFactor(sm2Result.easeFactor)
            .nextReviewAt(userCard.getNextReviewAt())
            .message(getReviewMessage(request.getRating()))
            .build();
    }

    @Override
    @Transactional
    public StudyCardResponse startLearningCard(UUID cardId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Card card = cardRepository.findById(cardId)
            .orElseThrow(() -> new ResourceNotFoundException("Card", "id", cardId));

        if (userCardRepository.findByUserIdAndCardId(userId, cardId).isPresent()) {
            throw new BadRequestException("Card already in learning");
        }

        UserCard userCard = createNewUserCard(user, card);
        userCard = userCardRepository.save(userCard);

        return mapToStudyCardResponse(userCard, true);
    }

    @Override
    public CollectionProgressResponse getCollectionProgress(UUID collectionId) {
        UUID userId = SecurityUtils.getCurrentUserId();

        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", collectionId));

        List<Card> allCards = cardRepository.findByCollectionId(collectionId);
        List<UserCard> userCards = userCardRepository.findByUserIdAndCollectionId(userId, collectionId);
        OffsetDateTime now = OffsetDateTime.now();

        int totalCards = allCards.size();
        int learnedCards = userCards.size();
        int dueCards = (int) userCards.stream()
            .filter(uc -> uc.getNextReviewAt() != null && uc.getNextReviewAt().isBefore(now))
            .count();
        int newCards = totalCards - learnedCards;

        double progressPercent = totalCards > 0 ? (double) learnedCards / totalCards * 100 : 0;

        return CollectionProgressResponse.builder()
            .collectionId(collectionId)
            .collectionTitle(collection.getTitle())
            .totalCards(totalCards)
            .learnedCards(learnedCards)
            .dueCards(dueCards)
            .newCards(newCards)
            .progressPercent(Math.round(progressPercent * 100.0) / 100.0)
            .build();
    }

    private UserCard createNewUserCard(User user, Card card) {
        return UserCard.builder()
            .user(user)
            .card(card)
            .repetition(0)
            .intervalDays(1)
            .easeFactor(2.5)
            .nextReviewAt(OffsetDateTime.now())
            .build();
    }

    private SM2Result applySM2(UserCard userCard, Rating rating) {
        int quality = switch (rating) {
            case AGAIN -> 0;
            case HARD -> 2;
            case GOOD -> 3;
            case EASY -> 5;
        };

        int repetition = userCard.getRepetition();
        double easeFactor = userCard.getEaseFactor();
        int interval;

        if (quality < 3) {
            repetition = 0;
            interval = 1;
        } else {
            if (repetition == 0) {
                interval = 1;
            } else if (repetition == 1) {
                interval = 6;
            } else {
                interval = (int) Math.round(userCard.getIntervalDays() * easeFactor);
            }
            repetition++;
        }

        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }

        return new SM2Result(repetition, interval, easeFactor);
    }

    private void updateDailyStats(UUID userId, Integer studyTimeSeconds, boolean isNewCard) {
        LocalDate today = LocalDate.now();
        UserDailyStats stats = userDailyStatsRepository.findByUserIdAndDate(userId, today)
            .orElseGet(() -> {
                User user = userRepository.findById(userId).orElseThrow();
                return UserDailyStats.builder()
                    .user(user)
                    .date(today)
                    .cardsStudied(0)
                    .newCards(0)
                    .reviewCards(0)
                    .studyTimeSeconds(0)
                    .build();
            });

        stats.setCardsStudied(stats.getCardsStudied() + 1);
        if (isNewCard) {
            stats.setNewCards(stats.getNewCards() + 1);
        } else {
            stats.setReviewCards(stats.getReviewCards() + 1);
        }
        if (studyTimeSeconds != null) {
            stats.setStudyTimeSeconds(stats.getStudyTimeSeconds() + studyTimeSeconds);
        }
        userDailyStatsRepository.save(stats);

        // Update streak
        updateStreak(userId, today);

        // Update leaderboard
        updateLeaderboard(userId, today, stats.getCardsStudied());
    }

    private void updateLeaderboard(UUID userId, LocalDate today, int cardsStudied) {
        LeaderboardDaily leaderboard = leaderboardDailyRepository.findByDateAndUserId(today, userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId).orElseThrow();
                return LeaderboardDaily.builder()
                    .user(user)
                    .date(today)
                    .score(0)
                    .rank(0)
                    .build();
            });

        // Score = cards studied * 10 points each
        leaderboard.setScore(cardsStudied * 10);
        leaderboardDailyRepository.save(leaderboard);
    }

    private void updateStreak(UUID userId, LocalDate today) {
        UserStreak streak = userStreakRepository.findById(userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId).orElseThrow();
                return UserStreak.builder()
                    .user(user)
                    .currentStreak(0)
                    .longestStreak(0)
                    .build();
            });

        LocalDate lastStudy = streak.getLastStudyDate();

        if (lastStudy == null || lastStudy.isBefore(today.minusDays(1))) {
            streak.setCurrentStreak(1);
        } else if (lastStudy.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        }

        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }

        streak.setLastStudyDate(today);
        userStreakRepository.save(streak);
    }

    private String getReviewMessage(Rating rating) {
        return switch (rating) {
            case AGAIN -> "Let's try again soon!";
            case HARD -> "Keep practicing!";
            case GOOD -> "Good job!";
            case EASY -> "Excellent!";
        };
    }

    private String getMediaUrl(MediaFile mediaFile) {
        if (mediaFile == null) {
            return null;
        }
        return mediaService.getMediaUrl(mediaFile.getId());
    }

    private StudyCardResponse mapToStudyCardResponse(UserCard userCard, boolean isNew) {
        Card card = userCard.getCard();
        return StudyCardResponse.builder()
            .cardId(card.getId())
            .frontText(card.getFrontText())
            .frontImageUrl(getMediaUrl(card.getFrontImage()))
            .frontAudioUrl(getMediaUrl(card.getFrontAudio()))
            .backText(card.getBackText())
            .backImageUrl(getMediaUrl(card.getBackImage()))
            .backAudioUrl(getMediaUrl(card.getBackAudio()))
            .collectionId(card.getCollection().getId())
            .collectionTitle(card.getCollection().getTitle())
            .repetition(userCard.getRepetition())
            .intervalDays(userCard.getIntervalDays())
            .easeFactor(userCard.getEaseFactor())
            .lastReviewedAt(userCard.getLastReviewedAt())
            .nextReviewAt(userCard.getNextReviewAt())
            .isNew(isNew)
            .build();
    }

    private StudyCardResponse mapNewCardToStudyCardResponse(Card card) {
        return StudyCardResponse.builder()
            .cardId(card.getId())
            .frontText(card.getFrontText())
            .frontImageUrl(getMediaUrl(card.getFrontImage()))
            .frontAudioUrl(getMediaUrl(card.getFrontAudio()))
            .backText(card.getBackText())
            .backImageUrl(getMediaUrl(card.getBackImage()))
            .backAudioUrl(getMediaUrl(card.getBackAudio()))
            .collectionId(card.getCollection().getId())
            .collectionTitle(card.getCollection().getTitle())
            .repetition(0)
            .intervalDays(1)
            .easeFactor(2.5)
            .isNew(true)
            .build();
    }

    private record SM2Result(int repetition, int intervalDays, double easeFactor) {}
}
