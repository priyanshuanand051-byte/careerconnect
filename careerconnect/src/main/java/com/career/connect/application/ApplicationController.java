
package com.career.connect.application;

import java.util.List;

import com.career.connect.user.AppUser;
import com.career.connect.user.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserService userService;

    public ApplicationController(
            ApplicationService applicationService,
            UserService userService) {
        this.applicationService = applicationService;
        this.userService = userService;
    }

    // Apply for a job as the currently logged-in user
    @PostMapping("/jobs/{jobId}/applications")
    public ResponseEntity<Application> applyForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {

        AppUser user =
                userService.getUserByEmail(userDetails.getUsername());

        Application application =
                applicationService.applyForJob(user.getId(), jobId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(application);
    }

    // View applications belonging to the currently logged-in user
    @GetMapping("/students/me/applications")
    public List<Application> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {

        AppUser user =
                userService.getUserByEmail(userDetails.getUsername());

        return applicationService
                .getApplicationsByStudent(user.getId());
    }
    
    
	 // View applicants for a job owned by the logged-in recruiter
	 @GetMapping("/jobs/{jobId}/applications")
	 public List<Application> getApplicantsForJob(
	         @PathVariable Long jobId,
	         @AuthenticationPrincipal UserDetails userDetails) {
	
	     AppUser recruiter =
	             userService.getUserByEmail(userDetails.getUsername());
	
	     return applicationService.getApplicationsByJobForRecruiter(
	             jobId, recruiter.getId());
	 }
 

    // Update an application status

	@PatchMapping("/applications/{applicationId}/status")
	public ResponseEntity<Application> updateApplicationStatus(
	        @PathVariable Long applicationId,
	        @RequestParam ApplicationStatus status,
	        @AuthenticationPrincipal UserDetails userDetails) {
	
	    AppUser recruiter =
	            userService.getUserByEmail(userDetails.getUsername());
	
	    Application updatedApplication =
	            applicationService.updateApplicationStatus(
	                    applicationId, status, recruiter.getId());
	
	    return ResponseEntity.ok(updatedApplication);
	}
	
}

