package com.career.connect.job;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.career.connect.job.exception.JobNotFoundException;
import com.career.connect.user.AppUser;

@Service
public class JobService {
	
	private final JobRepository jobRepository;
	
	public JobService(JobRepository jobRepository) {
		this.jobRepository=jobRepository;
	}
	
	
	
	public List<Job> getAllJob(){
		List<Job> job=jobRepository.findAll();
		return job;
	}
	
	public Job getJobById(Long id){
		Optional<Job> job=jobRepository.findById(id);
		if(job.isPresent()) {
			return job.get();
		}else 
			throw new JobNotFoundException("Job not found with id="+id); 
		
	}
	
	

	public Job updateJob(Long id, JobRequest request) {
	
	    Job existingJob = jobRepository.findById(id)
	            .orElseThrow(() -> new JobNotFoundException(
	                    "Job not found with ID: " + id
	            ));
	
	    existingJob.setTitle(request.getTitle());
	    existingJob.setCompanyName(request.getCompanyName());
	    existingJob.setLocation(request.getLocation());
	    existingJob.setJobType(request.getJobType());
	    existingJob.setDescription(request.getDescription());
	
	    return jobRepository.save(existingJob);
	}
	

	public void deleteJob(Long id) {
	
	    Job existingJob = jobRepository.findById(id)
	            .orElseThrow(() -> new JobNotFoundException(
	                    "Job not found with ID: " + id
	            ));
	
	    jobRepository.delete(existingJob);
	}
	
	
	public Page<Job> searchJobs(
	        String keyword,
	        String location,
	        String jobType,
	        int page,
	        int size) {

	    if (page < 0) {
	        throw new IllegalArgumentException(
	                "Page number cannot be negative.");
	    }

	    if (size < 1 || size > 50) {
	        throw new IllegalArgumentException(
	                "Page size must be between 1 and 50.");
	    }

	    Pageable pageable = PageRequest.of(page, size);

	    return jobRepository.searchJobs(
	            keyword == null ? "" : keyword.trim(),
	            location == null ? "" : location.trim(),
	            jobType == null ? "" : jobType.trim(),
	            pageable);
	}
	

	public Job createJob(JobRequest jobRequest, AppUser recruiter) {
	    Job job = new Job();

	    job.setTitle(jobRequest.getTitle());
	    job.setCompanyName(jobRequest.getCompanyName());
	    job.setLocation(jobRequest.getLocation());
	    job.setJobType(jobRequest.getJobType());
	    job.setDescription(jobRequest.getDescription());

	    job.setRecruiter(recruiter);

	    System.out.println("Recruiter email: " + recruiter.getEmail());
	    System.out.println("Recruiter ID: " + recruiter.getId());

	    return jobRepository.save(job);
	}

	
	public List<Job> getJobsByRecruiter(Long recruiterId) {
	    return jobRepository.findByRecruiter_Id(recruiterId);
	}



}
