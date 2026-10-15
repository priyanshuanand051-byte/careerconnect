
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
@RequestMapping("/api/student/dashboard")
public class StudentDashboardController {

    private final StudentDashboardService dashboardService;
    private final UserService userService;

    public StudentDashboardController(
            StudentDashboardService dashboardService,
            UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/summary")
    public Map<String, Long> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails) {

        AppUser student =
                userService.getUserByEmail(userDetails.getUsername());

        Long studentId = student.getId();

        return Map.of(
            "totalApplications",
            dashboardService.getTotalApplications(studentId),

            "pendingApplications",
            dashboardService.getPendingApplications(studentId),

            "shortlistedApplications",
            dashboardService.getShortlistedApplications(studentId),

            "rejectedApplications",
            dashboardService.getRejectedApplications(studentId),

            "acceptedApplications",
            dashboardService.getAcceptedApplications(studentId)
        );
    }
}
