# Flashcard Media Storage (MinIO)

Tài liệu này mô tả **kiến trúc lưu trữ audio / image cho flashcard**, bao gồm:

* Upload flow (presigned URL)
* Get / play media flow
* DB schema update
* Best practices production

---

## 1. Overall Architecture

```
Client (Web / Mobile)
   │
   │ ① Request upload (metadata)
   ▼
Backend API (NestJS / Spring Boot)
   │
   │ ② Generate presigned URL (PUT)
   ▼
MinIO (S3-compatible)
   │
   │ ③ Direct upload
   ▼
Object Storage
```

📌 Backend **KHÔNG nhận file binary**, chỉ quản lý metadata & permission.

---

## 2. Bucket & Object Key Design

### Bucket

```
flashcard-media
```

### Object key convention

```
{env}/{userId}/{type}/{uuid}.{ext}
```

### Example

```
prod/42/audio/8f92a3.wav
prod/42/image/3fa2cd.webp
```

Benefits:

* Tránh conflict
* Dễ phân quyền
* Dễ cleanup theo user

---

## 3. Upload Flow (Presigned URL)

### Step 1 – Client request upload

```json
{
  "relatedType": "card",
  "relatedId": 123,
  "fileType": "audio",
  "mimeType": "audio/wav"
}
```

---

### Step 2 – Backend generate presigned PUT URL

* Validate mime type, size
* Generate `object_key`
* TTL: 3–5 minutes

Backend response:

```json
{
  "uploadUrl": "https://minio/...",
  "bucket": "flashcard-media",
  "objectKey": "prod/42/audio/8f92a3.wav"
}
```

---

### Step 3 – Client upload directly to MinIO

```http
PUT https://minio/flashcard-media/prod/42/audio/8f92a3.wav
Content-Type: audio/wav
```

---

### Step 4 – Confirm upload & save metadata

* Backend inserts record into `media_files`
* Update related entity (card)

---

## 4. Get / Play Media Flow

```
Client request play audio
   ↓
Backend validate permission
   ↓
Generate presigned GET URL
   ↓
Client plays media directly from MinIO
```

### Response example

```json
{
  "playUrl": "https://minio/...",
  "expiresIn": 300
}
```

📌 Bucket **KHÔNG public**.

---

## 5. Database Schema

### 5.1 media_files

```sql
CREATE TABLE media_files (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT NOT NULL,

  related_type VARCHAR(50), -- card, dictation, user
  related_id BIGINT,

  file_type VARCHAR(20),    -- audio, image
  mime_type VARCHAR(50),

  bucket VARCHAR(100) NOT NULL,
  object_key TEXT NOT NULL,

  file_size BIGINT,
  duration_ms INT,

  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT now()
);
```

---

### 5.2 cards (update)

```sql
ALTER TABLE cards
ADD front_audio_id BIGINT,
ADD back_audio_id BIGINT,
ADD front_image_id BIGINT,
ADD back_image_id BIGINT;
```

Foreign key:

```
cards.front_audio_id → media_files.id
```

---

## 6. Cleanup & Orphan Strategy

* File uploaded nhưng không gắn entity → mark orphan
* Job định kỳ:

  * Orphan > X ngày → delete from MinIO
  * Card deleted → mark media inactive

📌 Không delete hard ngay.

---

## 7. Security Best Practices

| Risk                  | Solution               |
| --------------------- | ---------------------- |
| User access file khác | object_key theo userId |
| Link leak             | Presigned URL TTL ngắn |
| Upload file độc       | Validate mime + size   |
| Bucket public         | ❌ Không                |

---

## 8. Performance Notes

* Audio: mp3 / ogg
* Image: webp
* CDN trước MinIO
* Cache presigned GET ngắn hạn

---

## 9. End-to-End Card Media Flow

```
Create card
→ Request upload audio/image
→ Upload to MinIO
→ Save media_files
→ Update card
→ Generate GET URL for study
```

---

## 10. Future Extensions

* Audio waveform preview
* Auto re-encode pipeline
* TTS generation
* Media deduplication

---

✅ Document này có thể dùng làm:

* Design doc
* Team onboarding
* Phỏng vấn backend
* Triển khai production
