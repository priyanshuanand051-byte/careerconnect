
package com.career.connect.application;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    boolean existsByStudentIdAndJob_Id(
            Long studentId, Long jobId);

    List<Application> findByStudentId(Long studentId);

    List<Application> findByJob_Id(Long jobId);

    // Count applications received by a recruiter's jobs
    long countByJob_Recruiter_Id(Long recruiterId);

    // Count applications by status across a recruiter's jobs
    long countByJob_Recruiter_IdAndStatus(
            Long recruiterId, ApplicationStatus status);
    
    long countByStudentIdAndStatus(
            Long studentId, ApplicationStatus status);

    long countByStudentId(Long studentId);
}
