# Flashcard Learning System

## 1. Overview

This document describes the **database schema** and **authentication flow** for a flashcard learning system supporting:

* Google login + username/password
* Flashcard learning with **Spaced Repetition (SM-2)**
* Statistics, streaks, leaderboard, notifications

---

## 2. Authentication & User Design

### 2.1 Core Principles

* **One logical user = one `users.id`**
* A user can have **multiple login methods** (Google, Local)
* Adding a password after Google login **does NOT create a new user**

---

### 2.2 Table: `users`

Core user profile.

| Column     | Type             | Description      |
| ---------- | ---------------- | ---------------- |
| id         | UUID (PK)        | Internal user ID |
| email      | VARCHAR (UNIQUE) | Primary email    |
| username   | VARCHAR (UNIQUE) | Public username  |
| created_at | TIMESTAMPTZ      | Created time     |

---

### 2.3 Table: `auth_identities`

Stores login methods (multi-provider).

| Column           | Type                | Description                       |
| ---------------- | ------------------- | --------------------------------- |
| id               | UUID (PK)           | Identity ID                       |
| user_id          | UUID (FK)           | Reference to users                |
| provider         | ENUM(LOCAL, GOOGLE) | Auth type                         |
| provider_user_id | VARCHAR             | Google `sub` (nullable for LOCAL) |
| email            | VARCHAR             | Email from provider               |
| password_hash    | VARCHAR             | Only for LOCAL                    |
| created_at       | TIMESTAMPTZ         | Created time                      |

> One user → many auth_identities

---

## 3. Flashcard Domain Model

### 3.1 Relationship Overview

```
users
 └─ user_cards ─ cards ─ collections ─ courses
        └─ study_logs
```

---

### 3.2 Table: `courses`

High-level learning program.

| Column      | Type        | Description  |
| ----------- | ----------- | ------------ |
| id          | UUID (PK)   | Course ID    |
| title       | VARCHAR     | Course name  |
| description | TEXT        | Description  |
| created_by  | UUID        | Owner        |
| is_public   | BOOLEAN     | Visibility   |
| created_at  | TIMESTAMPTZ | Created time |

---

### 3.3 Table: `collections`

Flashcard sets inside a course.

| Column      | Type        | Description     |
| ----------- | ----------- | --------------- |
| id          | UUID (PK)   | Collection ID   |
| course_id   | UUID (FK)   | Parent course   |
| title       | VARCHAR     | Collection name |
| description | TEXT        | Description     |
| created_by  | UUID        | Owner           |
| created_at  | TIMESTAMPTZ | Created time    |

---

### 3.4 Table: `cards`

Individual flashcards.

| Column          | Type        | Description       |
| --------------- | ----------- | ----------------- |
| id              | UUID (PK)   | Card ID           |
| collection_id   | UUID (FK)   | Parent collection |
| front_text      | TEXT        | Front content     |
| front_audio_url | VARCHAR     | Front audio       |
| back_text       | TEXT        | Back content      |
| back_audio_url  | VARCHAR     | Back audio        |
| created_at      | TIMESTAMPTZ | Created time      |

---

## 4. Spaced Repetition (Learning State)

### 4.1 Table: `user_cards`

Tracks **learning progress per user per card**.

| Column           | Type        | Description            |
| ---------------- | ----------- | ---------------------- |
| user_id          | UUID (FK)   | Learner                |
| card_id          | UUID (FK)   | Flashcard              |
| repetition       | INT         | Correct streak         |
| interval_days    | INT         | Days until next review |
| ease_factor      | FLOAT       | Difficulty (min 1.3)   |
| last_reviewed_at | TIMESTAMPTZ | Last review            |
| next_review_at   | TIMESTAMPTZ | Next scheduled review  |

> UNIQUE(user_id, card_id)

---

### 4.2 Table: `study_logs`

Audit and analytics of every review.

| Column      | Type                       | Description |
| ----------- | -------------------------- | ----------- |
| id          | UUID (PK)                  | Log ID      |
| user_id     | UUID                       | Learner     |
| card_id     | UUID                       | Card        |
| rating      | ENUM(AGAIN,HARD,GOOD,EASY) | User answer |
| reviewed_at | TIMESTAMPTZ                | Time        |

---

## 5. Statistics & Gamification

### 5.1 Table: `user_daily_stats`

| Column             | Type | Description  |
| ------------------ | ---- | ------------ |
| user_id            | UUID | Learner      |
| date               | DATE | Study day    |
| cards_studied      | INT  | Total cards  |
| new_cards          | INT  | New cards    |
| review_cards       | INT  | Review cards |
| study_time_seconds | INT  | Time spent   |

---

### 5.2 Table: `user_streaks`

| Column          | Type      | Description     |
| --------------- | --------- | --------------- |
| user_id         | UUID (PK) | Learner         |
| current_streak  | INT       | Current streak  |
| longest_streak  | INT       | Best streak     |
| last_study_date | DATE      | Last active day |

---

### 5.3 Table: `leaderboard_daily`

| Column  | Type | Description      |
| ------- | ---- | ---------------- |
| date    | DATE | Day              |
| user_id | UUID | Learner          |
| score   | INT  | Calculated score |
| rank    | INT  | Rank             |

---

## 6. Notification System

### Table: `notifications`

| Column       | Type                              | Description     |
| ------------ | --------------------------------- | --------------- |
| id           | UUID (PK)                         | Notification ID |
| user_id      | UUID                              | Target user     |
| type         | ENUM(REMINDER,SYSTEM,ACHIEVEMENT) | Type            |
| title        | VARCHAR                           | Title           |
| content      | TEXT                              | Message         |
| scheduled_at | TIMESTAMPTZ                       | Send time       |
| is_sent      | BOOLEAN                           | Status          |

---

## 7. Study Session Flow (Summary)

1. Get due cards (`next_review_at <= now`)
2. Add new cards if needed
3. User answers card
4. Insert `study_logs`
5. Update `user_cards` using **SM-2**
6. Update stats, streaks, leaderboard (async)

---

## 8. One-Sentence Summary

> Each user-card pair has its own learning state, updated after every review using SM-2, while authentication supports multiple login methods without duplicating users.

export JAVA_HOME=$(/usr/libexec/java_home)
./mvnw spring-boot:run