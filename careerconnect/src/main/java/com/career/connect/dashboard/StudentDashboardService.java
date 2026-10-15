
package com.career.connect.dashboard;

import org.springframework.stereotype.Service;

import com.career.connect.application.ApplicationRepository;
import com.career.connect.application.ApplicationStatus;

@Service
public class StudentDashboardService {

    private final ApplicationRepository applicationRepository;

    public StudentDashboardService(
            ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public long getTotalApplications(Long studentId) {
        return applicationRepository
                .findByStudentId(studentId)
                .size();
    }

    public long getPendingApplications(Long studentId) {
        return applicationRepository
                .countByStudentIdAndStatus(
                        studentId, ApplicationStatus.PENDING);
    }

    public long getShortlistedApplications(Long studentId) {
        return applicationRepository
                .countByStudentIdAndStatus(
                        studentId, ApplicationStatus.SHORTLISTED);
    }

    public long getRejectedApplications(Long studentId) {
        return applicationRepository
                .countByStudentIdAndStatus(
                        studentId, ApplicationStatus.REJECTED);
    }

    public long getAcceptedApplications(Long studentId) {
        return applicationRepository
                .countByStudentIdAndStatus(
                        studentId, ApplicationStatus.ACCEPTED);
    }
}
