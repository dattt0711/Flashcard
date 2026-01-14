package com.flashcard.repository;

import com.flashcard.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    List<Course> findByCreatedById(UUID userId);

    List<Course> findByIsPublicTrue();

    @Query("SELECT c FROM Course c WHERE c.isPublic = true OR c.createdBy.id = :userId")
    List<Course> findAccessibleCourses(@Param("userId") UUID userId);
}
