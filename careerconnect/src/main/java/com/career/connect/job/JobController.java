
package com.career.connect.job;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.career.connect.user.AppUser;
import com.career.connect.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final UserService userService;

    public JobController(
            JobService jobService,
            UserService userService) {
        this.jobService = jobService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Job> createJob(
            @Valid @RequestBody JobRequest jobRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        AppUser recruiter =
                userService.getUserByEmail(userDetails.getUsername());

        Job savedJob = jobService.createJob(jobRequest, recruiter);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    @GetMapping
    public List<Job> getAllJob() {
        return jobService.getAllJob();
    }
    
    @GetMapping("/my-jobs")
    public List<Job> getMyJobs(
            @AuthenticationPrincipal UserDetails userDetails) {

        AppUser recruiter =
                userService.getUserByEmail(userDetails.getUsername());

        return jobService.getJobsByRecruiter(recruiter.getId());
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest jobRequest) {

        Job updatedJob = jobService.updateJob(id, jobRequest);
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public Page<Job> searchJobs(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(defaultValue = "") String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return jobService.searchJobs(
                keyword, location, jobType, page, size);
    }
}
