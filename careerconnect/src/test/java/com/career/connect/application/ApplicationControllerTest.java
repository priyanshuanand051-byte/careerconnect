
package com.career.connect.application;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.career.connect.config.SecurityConfig;
import com.career.connect.user.AppUser;
import com.career.connect.user.UserRole;
import com.career.connect.user.service.CustomUserDetailsService;
import com.career.connect.user.service.UserService;

@WebMvcTest(ApplicationController.class)
@Import(SecurityConfig.class)
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ApplicationService applicationService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    private AppUser createStudent() {
        AppUser user = new AppUser();
        user.setName("Test Student");
        user.setEmail("student@example.com");
        user.setRole(UserRole.STUDENT);

        // Simulate a user already saved in the database.
        setFieldValue(user, "id", 101L);

        return user;
    }

    private void setFieldValue(Object object, String fieldName, Object value) {
        try {
            var field = object.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(object, value);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void applyForJob_returnsCreated() throws Exception {

        AppUser user = createStudent();

        Application application = new Application();
        setFieldValue(application, "id", 1L);
        application.setStudentId(101L);
        application.setStatus(ApplicationStatus.PENDING);

        when(userService.getUserByEmail("student@example.com"))
                .thenReturn(user);

        when(applicationService.applyForJob(101L, 5L))
                .thenReturn(application);

        mockMvc.perform(post("/api/jobs/5/applications")
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.studentId").value(101))
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(userService).getUserByEmail("student@example.com");
        verify(applicationService).applyForJob(101L, 5L);
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void getMyApplications_returnsApplications() throws Exception {

        AppUser user = createStudent();

        Application application = new Application();
        setFieldValue(application, "id", 1L);
        application.setStudentId(101L);
        application.setStatus(ApplicationStatus.PENDING);

        when(userService.getUserByEmail("student@example.com"))
                .thenReturn(user);

        when(applicationService.getApplicationsByStudent(101L))
                .thenReturn(List.of(application));

        mockMvc.perform(get("/api/students/me/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].studentId").value(101))
                .andExpect(jsonPath("$[0].status").value("PENDING"));

        verify(userService).getUserByEmail("student@example.com");
        verify(applicationService).getApplicationsByStudent(101L);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void updateApplicationStatus_whenStudent_returnsForbidden()
            throws Exception {

        mockMvc.perform(patch("/api/applications/1/status")
                        .with(csrf())
                        .param("status", "SHORTLISTED"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "RECRUITER")
    void updateApplicationStatus_whenRecruiter_returnsUpdatedApplication()
            throws Exception {

        Application application = new Application();
        setFieldValue(application, "id", 1L);
        application.setStudentId(101L);
        application.setStatus(ApplicationStatus.SHORTLISTED);

        when(applicationService.updateApplicationStatus(
                1L, ApplicationStatus.SHORTLISTED))
                .thenReturn(application);

        mockMvc.perform(patch("/api/applications/1/status")
                        .with(csrf())
                        .param("status", "SHORTLISTED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("SHORTLISTED"));

        verify(applicationService).updateApplicationStatus(
                1L, ApplicationStatus.SHORTLISTED);
    }

    @Test
    void getMyApplications_whenUnauthenticated_returnsUnauthorized()
            throws Exception {

        mockMvc.perform(get("/api/students/me/applications"))
                .andExpect(status().isUnauthorized());
    }
}
