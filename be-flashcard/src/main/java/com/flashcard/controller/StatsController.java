package com.flashcard.controller;

import com.flashcard.dto.common.ApiResponse;
import com.flashcard.dto.stats.*;
import com.flashcard.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "User statistics and leaderboard endpoints")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(summary = "Get user stats", description = "Get current user's learning statistics")
    public ResponseEntity<ApiResponse<UserStatsResponse>> getUserStats() {
        UserStatsResponse response = statsService.getUserStats();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/daily")
    @Operation(summary = "Get daily stats", description = "Get daily stats for a date range")
    public ResponseEntity<ApiResponse<List<DailyStatsResponse>>> getDailyStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DailyStatsResponse> response = statsService.getDailyStats(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/streak")
    @Operation(summary = "Get streak info", description = "Get current and longest streak")
    public ResponseEntity<ApiResponse<StreakResponse>> getStreak() {
        StreakResponse response = statsService.getStreak();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/leaderboard")
    @Operation(summary = "Get leaderboard", description = "Get daily leaderboard")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryResponse>>> getLeaderboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LeaderboardEntryResponse> response = statsService.getLeaderboard(date != null ? date : LocalDate.now());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
