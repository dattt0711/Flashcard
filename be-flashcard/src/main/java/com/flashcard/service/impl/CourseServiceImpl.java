package com.flashcard.service.impl;

import com.flashcard.dto.course.*;
import com.flashcard.entity.Course;
import com.flashcard.entity.User;
import com.flashcard.exception.BadRequestException;
import com.flashcard.exception.ResourceNotFoundException;
import com.flashcard.repository.CollectionRepository;
import com.flashcard.repository.CourseRepository;
import com.flashcard.repository.UserRepository;
import com.flashcard.security.SecurityUtils;
import com.flashcard.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CollectionRepository collectionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CourseResponse createCourse(CreateCourseRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Course course = Course.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .createdBy(user)
            .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
            .build();
        course = courseRepository.save(course);

        return mapToResponse(course);
    }

    @Override
    public List<CourseResponse> getAllAccessibleCourses() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return courseRepository.findAccessibleCourses(userId).stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Override
    public List<CourseResponse> getMyCourses() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return courseRepository.findByCreatedById(userId).stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Override
    public List<CourseResponse> getPublicCourses() {
        return courseRepository.findByIsPublicTrue().stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Override
    public CourseResponse getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!course.getIsPublic() && !course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Access denied to this course");
        }

        return mapToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(UUID id, UpdateCourseRequest request) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Only the owner can update this course");
        }

        if (request.getTitle() != null) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getIsPublic() != null) {
            course.setIsPublic(request.getIsPublic());
        }

        course = courseRepository.save(course);
        return mapToResponse(course);
    }

    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        UUID userId = SecurityUtils.getCurrentUserId();
        if (!course.getCreatedBy().getId().equals(userId)) {
            throw new BadRequestException("Only the owner can delete this course");
        }

        courseRepository.delete(course);
    }

    private CourseResponse mapToResponse(Course course) {
        int collectionCount = collectionRepository.findByCourseId(course.getId()).size();

        return CourseResponse.builder()
            .id(course.getId())
            .title(course.getTitle())
            .description(course.getDescription())
            .createdById(course.getCreatedBy().getId())
            .createdByUsername(course.getCreatedBy().getUsername())
            .isPublic(course.getIsPublic())
            .createdAt(course.getCreatedAt())
            .collectionCount(collectionCount)
            .build();
    }
}
