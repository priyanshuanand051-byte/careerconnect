
package com.career.connect.dashboard;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.career.connect.user.AppUser;
import com.career.connect.user.service.UserService;

@RestController
@RequestMapping("/api/recruiter/dashboard")
public class RecruiterDashboardController {

    private final RecruiterDashboardService dashboardService;
    private final UserService userService;

    public RecruiterDashboardController(
            RecruiterDashboardService dashboardService,
            UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/summary")
    public Map<String, Long> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails) {

        AppUser recruiter =
                userService.getUserByEmail(userDetails.getUsername());

        Long recruiterId = recruiter.getId();

        return Map.of(
            "totalJobs",
            dashboardService.getTotalJobs(recruiterId),

            "totalApplications",
            dashboardService.getTotalApplications(recruiterId),

            "pendingApplications",
            dashboardService.getPendingApplications(recruiterId),

            "shortlistedApplications",
            dashboardService.getShortlistedApplications(recruiterId),

            "rejectedApplications",
            dashboardService.getRejectedApplications(recruiterId)
        );
    }
}
