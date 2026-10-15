
package com.career.connect.dashboard;

import org.springframework.stereotype.Service;

import com.career.connect.application.ApplicationRepository;
import com.career.connect.application.ApplicationStatus;
import com.career.connect.job.JobRepository;

@Service
public class RecruiterDashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public RecruiterDashboardService(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public long getTotalJobs(Long recruiterId) {
        return jobRepository
                .findByRecruiter_Id(recruiterId)
                .size();
    }

    public long getTotalApplications(Long recruiterId) {
        return applicationRepository
                .countByJob_Recruiter_Id(recruiterId);
    }

    public long getPendingApplications(Long recruiterId) {
        return applicationRepository
                .countByJob_Recruiter_IdAndStatus(
                        recruiterId, ApplicationStatus.PENDING);
    }

    public long getShortlistedApplications(Long recruiterId) {
        return applicationRepository
                .countByJob_Recruiter_IdAndStatus(
                        recruiterId, ApplicationStatus.SHORTLISTED);
    }

    public long getRejectedApplications(Long recruiterId) {
        return applicationRepository
                .countByJob_Recruiter_IdAndStatus(
                        recruiterId, ApplicationStatus.REJECTED);
    }
}
