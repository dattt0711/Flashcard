package com.flashcard.controller;

import com.flashcard.dto.common.ApiResponse;
import com.flashcard.dto.course.*;
import com.flashcard.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Course management endpoints")
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @Operation(summary = "Create course", description = "Create a new course")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        CourseResponse response = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Course created", response));
    }

    @GetMapping
    @Operation(summary = "Get all courses", description = "Get all accessible courses (own + public)")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllAccessibleCourses();
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my courses", description = "Get courses created by current user")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyCourses() {
        List<CourseResponse> courses = courseService.getMyCourses();
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/public")
    @Operation(summary = "Get public courses", description = "Get all public courses")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPublicCourses() {
        List<CourseResponse> courses = courseService.getPublicCourses();
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course", description = "Get course by ID")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourse(@PathVariable UUID id) {
        CourseResponse response = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update course", description = "Update course by ID")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCourseRequest request) {
        CourseResponse response = courseService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.success("Course updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete course", description = "Delete course by ID")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted", null));
    }
}
