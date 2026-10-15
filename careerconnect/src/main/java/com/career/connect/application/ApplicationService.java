
package com.career.connect.application;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.career.connect.job.Job;
import com.career.connect.job.JobRepository;
import com.career.connect.job.exception.JobNotFoundException;
import com.career.connect.job.exception.JobNotFoundException;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    public Application applyForJob(Long studentId, Long jobId) {

        // 1. Check whether the job exists
        Job job = jobRepository.findById(jobId)
        		.orElseThrow(() ->
        	    new JobNotFoundException(
        	        "Job not found with ID: " + jobId));

        // 2. Prevent duplicate applications
        boolean alreadyApplied =
                applicationRepository
                        .existsByStudentIdAndJob_Id(studentId, jobId);

        if (alreadyApplied) {
            throw new IllegalStateException(
                    "You have already applied for this job.");
        }

        // 3. Create the application
        Application application = new Application();
        application.setStudentId(studentId);
        application.setJob(job);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);

        // 4. Save it to MySQL
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }
    

	public List<Application> getApplicationsByJobForRecruiter(
	        Long jobId, Long recruiterId) {
	
	    Job job = jobRepository.findById(jobId)
	            .orElseThrow(() ->
	                    new JobNotFoundException(
	                            "Job not found with ID: " + jobId));
	
	    if (job.getRecruiter() == null
	            || !job.getRecruiter().getId().equals(recruiterId)) {
	        throw new org.springframework.security.access.AccessDeniedException(
	                "You are not authorized to view applicants for this job.");
	    }
	
	    return applicationRepository.findByJob_Id(jobId);
	}

    


	public Application updateApplicationStatus(
	        Long applicationId,
	        ApplicationStatus newStatus,
	        Long recruiterId) {
	
	    Application application = applicationRepository
	            .findById(applicationId)
	            .orElseThrow(() ->
	                    new ApplicationNotFoundException(
	                            "Application not found with ID: " + applicationId));
	
	    Job job = application.getJob();
	
	    if (job.getRecruiter() == null
	            || !job.getRecruiter().getId().equals(recruiterId)) {
	        throw new org.springframework.security.access.AccessDeniedException(
	                "You are not authorized to update this application.");
	    }
	
	    application.setStatus(newStatus);
	
	    return applicationRepository.save(application);
	}


}
