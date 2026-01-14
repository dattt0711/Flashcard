package com.flashcard.config;

import com.flashcard.entity.Card;
import com.flashcard.entity.Collection;
import com.flashcard.entity.Course;
import com.flashcard.entity.LeaderboardDaily;
import com.flashcard.entity.User;
import com.flashcard.repository.CardRepository;
import com.flashcard.repository.CollectionRepository;
import com.flashcard.repository.CourseRepository;
import com.flashcard.repository.LeaderboardDailyRepository;
import com.flashcard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CollectionRepository collectionRepository;
    private final CardRepository cardRepository;
    private final LeaderboardDailyRepository leaderboardDailyRepository;

    private static final String SEED_USER_EMAIL = "seed@flashcard.com";
    private static final String SEED_USER_USERNAME = "seed_admin";
    private static final String COURSE_TITLE = "Japanese starter";
    private static final String HIRAGANA_COLLECTION_TITLE = "Hiragana alphabet";
    private static final String KATAKANA_COLLECTION_TITLE = "Katakana alphabet";

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting data seeding...");

        User seedUser = getOrCreateSeedUser();
        Course course = getOrCreateJapaneseCourse(seedUser);

        // Seed Hiragana collection
        Collection hiraganaCollection = getOrCreateCollection(course, seedUser, HIRAGANA_COLLECTION_TITLE,
                "Learn all 46 basic Hiragana characters - the foundation of Japanese writing.");
        if (cardRepository.findByCollectionId(hiraganaCollection.getId()).isEmpty()) {
            createHiraganaCards(hiraganaCollection);
        } else {
            log.info("Hiragana cards already exist, skipping...");
        }

        // Seed Katakana collection
        Collection katakanaCollection = getOrCreateCollection(course, seedUser, KATAKANA_COLLECTION_TITLE,
                "Learn all 46 basic Katakana characters - used for foreign words and emphasis.");
        if (cardRepository.findByCollectionId(katakanaCollection.getId()).isEmpty()) {
            createKatakanaCards(katakanaCollection);
        } else {
            log.info("Katakana cards already exist, skipping...");
        }

        // Create fake users with leaderboard scores to attract new users
        createLeaderboardUsersIfNotExist();

        log.info("Data seeding completed successfully!");
    }

    private User getOrCreateSeedUser() {
        return userRepository.findByEmail(SEED_USER_EMAIL)
                .orElseGet(() -> {
                    log.info("Creating seed user...");
                    User user = User.builder()
                            .email(SEED_USER_EMAIL)
                            .username(SEED_USER_USERNAME)
                            .build();
                    return userRepository.save(user);
                });
    }

    private Course getOrCreateJapaneseCourse(User user) {
        return courseRepository.findByIsPublicTrue().stream()
                .filter(c -> COURSE_TITLE.equals(c.getTitle()))
                .findFirst()
                .orElseGet(() -> {
                    log.info("Creating Japanese course...");
                    Course course = Course.builder()
                            .title(COURSE_TITLE)
                            .description("Learn Japanese from scratch! Start with the basics of the Japanese writing system.")
                            .createdBy(user)
                            .isPublic(true)
                            .build();
                    return courseRepository.save(course);
                });
    }

    private Collection getOrCreateCollection(Course course, User user, String title, String description) {
        return collectionRepository.findByCourseId(course.getId()).stream()
                .filter(c -> title.equals(c.getTitle()))
                .findFirst()
                .orElseGet(() -> {
                    log.info("Creating collection: {}...", title);
                    Collection collection = Collection.builder()
                            .course(course)
                            .title(title)
                            .description(description)
                            .createdBy(user)
                            .build();
                    return collectionRepository.save(collection);
                });
    }

    private void createHiraganaCards(Collection collection) {
        List<Card> cards = new ArrayList<>();

        // Vowels (あ行)
        cards.add(createCard(collection, "あ", "a"));
        cards.add(createCard(collection, "い", "i"));
        cards.add(createCard(collection, "う", "u"));
        cards.add(createCard(collection, "え", "e"));
        cards.add(createCard(collection, "お", "o"));

        // K row (か行)
        cards.add(createCard(collection, "か", "ka"));
        cards.add(createCard(collection, "き", "ki"));
        cards.add(createCard(collection, "く", "ku"));
        cards.add(createCard(collection, "け", "ke"));
        cards.add(createCard(collection, "こ", "ko"));

        // S row (さ行)
        cards.add(createCard(collection, "さ", "sa"));
        cards.add(createCard(collection, "し", "shi"));
        cards.add(createCard(collection, "す", "su"));
        cards.add(createCard(collection, "せ", "se"));
        cards.add(createCard(collection, "そ", "so"));

        // T row (た行)
        cards.add(createCard(collection, "た", "ta"));
        cards.add(createCard(collection, "ち", "chi"));
        cards.add(createCard(collection, "つ", "tsu"));
        cards.add(createCard(collection, "て", "te"));
        cards.add(createCard(collection, "と", "to"));

        // N row (な行)
        cards.add(createCard(collection, "な", "na"));
        cards.add(createCard(collection, "に", "ni"));
        cards.add(createCard(collection, "ぬ", "nu"));
        cards.add(createCard(collection, "ね", "ne"));
        cards.add(createCard(collection, "の", "no"));

        // H row (は行)
        cards.add(createCard(collection, "は", "ha"));
        cards.add(createCard(collection, "ひ", "hi"));
        cards.add(createCard(collection, "ふ", "fu"));
        cards.add(createCard(collection, "へ", "he"));
        cards.add(createCard(collection, "ほ", "ho"));

        // M row (ま行)
        cards.add(createCard(collection, "ま", "ma"));
        cards.add(createCard(collection, "み", "mi"));
        cards.add(createCard(collection, "む", "mu"));
        cards.add(createCard(collection, "め", "me"));
        cards.add(createCard(collection, "も", "mo"));

        // Y row (や行)
        cards.add(createCard(collection, "や", "ya"));
        cards.add(createCard(collection, "ゆ", "yu"));
        cards.add(createCard(collection, "よ", "yo"));

        // R row (ら行)
        cards.add(createCard(collection, "ら", "ra"));
        cards.add(createCard(collection, "り", "ri"));
        cards.add(createCard(collection, "る", "ru"));
        cards.add(createCard(collection, "れ", "re"));
        cards.add(createCard(collection, "ろ", "ro"));

        // W row (わ行)
        cards.add(createCard(collection, "わ", "wa"));
        cards.add(createCard(collection, "を", "wo"));

        // N (ん)
        cards.add(createCard(collection, "ん", "n"));

        cardRepository.saveAll(cards);
        log.info("Created {} Hiragana cards", cards.size());
    }

    private void createKatakanaCards(Collection collection) {
        List<Card> cards = new ArrayList<>();

        // Vowels (ア行)
        cards.add(createCard(collection, "ア", "a"));
        cards.add(createCard(collection, "イ", "i"));
        cards.add(createCard(collection, "ウ", "u"));
        cards.add(createCard(collection, "エ", "e"));
        cards.add(createCard(collection, "オ", "o"));

        // K row (カ行)
        cards.add(createCard(collection, "カ", "ka"));
        cards.add(createCard(collection, "キ", "ki"));
        cards.add(createCard(collection, "ク", "ku"));
        cards.add(createCard(collection, "ケ", "ke"));
        cards.add(createCard(collection, "コ", "ko"));

        // S row (サ行)
        cards.add(createCard(collection, "サ", "sa"));
        cards.add(createCard(collection, "シ", "shi"));
        cards.add(createCard(collection, "ス", "su"));
        cards.add(createCard(collection, "セ", "se"));
        cards.add(createCard(collection, "ソ", "so"));

        // T row (タ行)
        cards.add(createCard(collection, "タ", "ta"));
        cards.add(createCard(collection, "チ", "chi"));
        cards.add(createCard(collection, "ツ", "tsu"));
        cards.add(createCard(collection, "テ", "te"));
        cards.add(createCard(collection, "ト", "to"));

        // N row (ナ行)
        cards.add(createCard(collection, "ナ", "na"));
        cards.add(createCard(collection, "ニ", "ni"));
        cards.add(createCard(collection, "ヌ", "nu"));
        cards.add(createCard(collection, "ネ", "ne"));
        cards.add(createCard(collection, "ノ", "no"));

        // H row (ハ行)
        cards.add(createCard(collection, "ハ", "ha"));
        cards.add(createCard(collection, "ヒ", "hi"));
        cards.add(createCard(collection, "フ", "fu"));
        cards.add(createCard(collection, "ヘ", "he"));
        cards.add(createCard(collection, "ホ", "ho"));

        // M row (マ行)
        cards.add(createCard(collection, "マ", "ma"));
        cards.add(createCard(collection, "ミ", "mi"));
        cards.add(createCard(collection, "ム", "mu"));
        cards.add(createCard(collection, "メ", "me"));
        cards.add(createCard(collection, "モ", "mo"));

        // Y row (ヤ行)
        cards.add(createCard(collection, "ヤ", "ya"));
        cards.add(createCard(collection, "ユ", "yu"));
        cards.add(createCard(collection, "ヨ", "yo"));

        // R row (ラ行)
        cards.add(createCard(collection, "ラ", "ra"));
        cards.add(createCard(collection, "リ", "ri"));
        cards.add(createCard(collection, "ル", "ru"));
        cards.add(createCard(collection, "レ", "re"));
        cards.add(createCard(collection, "ロ", "ro"));

        // W row (ワ行)
        cards.add(createCard(collection, "ワ", "wa"));
        cards.add(createCard(collection, "ヲ", "wo"));

        // N (ン)
        cards.add(createCard(collection, "ン", "n"));

        cardRepository.saveAll(cards);
        log.info("Created {} Katakana cards", cards.size());
    }

    private Card createCard(Collection collection, String character, String romaji) {
        return Card.builder()
                .collection(collection)
                .frontText(character)
                .backText(romaji)
                .build();
    }

    private void createLeaderboardUsersIfNotExist() {
        LocalDate today = LocalDate.now();

        // User data: username, email, score (200-1000 range)
        String[][] userData = {
            {"sakura_master", "sakura@example.com", "1000"},
            {"nihongo_ninja", "ninja@example.com", "850"},
            {"kanji_king", "kanji@example.com", "720"},
            {"tokyo_learner", "tokyo@example.com", "650"},
            {"samurai_study", "samurai@example.com", "580"},
            {"anime_fan", "anime@example.com", "490"},
            {"sushi_lover", "sushi@example.com", "420"},
            {"fuji_climber", "fuji@example.com", "350"},
            {"ramen_rider", "ramen@example.com", "280"},
            {"zen_student", "zen@example.com", "200"}
        };

        List<LeaderboardDaily> leaderboardEntries = new ArrayList<>();
        int createdCount = 0;

        for (int i = 0; i < userData.length; i++) {
            String username = userData[i][0];
            String email = userData[i][1];
            int score = Integer.parseInt(userData[i][2]);

            // Check if user already exists
            if (userRepository.findByEmail(email).isPresent()) {
                continue;
            }

            User user = User.builder()
                    .email(email)
                    .username(username)
                    .build();
            user = userRepository.save(user);

            LeaderboardDaily entry = LeaderboardDaily.builder()
                    .user(user)
                    .date(today)
                    .score(score)
                    .rank(i + 1)
                    .build();
            leaderboardEntries.add(entry);
            createdCount++;
        }

        if (!leaderboardEntries.isEmpty()) {
            leaderboardDailyRepository.saveAll(leaderboardEntries);
            log.info("Created {} leaderboard users with scores", createdCount);
        } else {
            log.info("Leaderboard users already exist, skipping...");
        }
    }
}
