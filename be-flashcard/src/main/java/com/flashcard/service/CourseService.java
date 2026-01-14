package com.flashcard.service;

import com.flashcard.dto.course.*;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    CourseResponse createCourse(CreateCourseRequest request);
    List<CourseResponse> getAllAccessibleCourses();
    List<CourseResponse> getMyCourses();
    List<CourseResponse> getPublicCourses();
    CourseResponse getCourseById(UUID id);
    CourseResponse updateCourse(UUID id, UpdateCourseRequest request);
    void deleteCourse(UUID id);
}
