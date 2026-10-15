
package com.career.connect.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import com.career.connect.job.Job;
import com.career.connect.job.JobRepository;
import com.career.connect.job.exception.JobNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private Job job;

    @BeforeEach
    void setUp() {
        job = new Job();
        job.setTitle("Java Developer");
        job.setCompanyName("ABC Technologies");
        job.setLocation("Noida");
        job.setJobType("FULL_TIME");
        job.setDescription("Spring Boot development");
    }

    @Test
    void applyForJob_whenValid_savesPendingApplication() {
        when(jobRepository.findById(1L))
                .thenReturn(Optional.of(job));

        when(applicationRepository
                .existsByStudentIdAndJob_Id(101L, 1L))
                .thenReturn(false);

        when(applicationRepository.save(
                org.mockito.ArgumentMatchers.any(Application.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Application result =
                applicationService.applyForJob(101L, 1L);

        assertEquals(101L, result.getStudentId());
        assertEquals(job, result.getJob());
        assertEquals(ApplicationStatus.PENDING, result.getStatus());
        assertNotNull(result.getAppliedAt());

        verify(applicationRepository).save(
                org.mockito.ArgumentMatchers.any(Application.class));
    }

    @Test
    void applyForJob_whenJobDoesNotExist_throwsException() {
        when(jobRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                JobNotFoundException.class,
                () -> applicationService.applyForJob(101L, 99L)
        );

        verifyNoInteractions(applicationRepository);
    }

    @Test
    void applyForJob_whenAlreadyApplied_throwsException() {
        when(jobRepository.findById(1L))
                .thenReturn(Optional.of(job));

        when(applicationRepository
                .existsByStudentIdAndJob_Id(101L, 1L))
                .thenReturn(true);

        assertThrows(
                IllegalStateException.class,
                () -> applicationService.applyForJob(101L, 1L)
        );
    }

    @Test
    void getApplicationsByStudent_returnsStudentApplications() {
        Application application = new Application();
        application.setStudentId(101L);
        application.setJob(job);
        application.setStatus(ApplicationStatus.PENDING);

        when(applicationRepository.findByStudentId(101L))
                .thenReturn(List.of(application));

        List<Application> result =
                applicationService.getApplicationsByStudent(101L);

        assertEquals(1, result.size());
        assertEquals(101L, result.get(0).getStudentId());

        verify(applicationRepository).findByStudentId(101L);
    }

    @Test
    void updateApplicationStatus_whenApplicationExists_updatesStatus() {
        Application application = new Application();
        application.setStudentId(101L);
        application.setJob(job);
        application.setStatus(ApplicationStatus.PENDING);

        when(applicationRepository.findById(5L))
                .thenReturn(Optional.of(application));

        when(applicationRepository.save(application))
                .thenReturn(application);

        Application result =
                applicationService.updateApplicationStatus(
                        5L, ApplicationStatus.SHORTLISTED);

        assertEquals(
                ApplicationStatus.SHORTLISTED,
                result.getStatus());

        verify(applicationRepository).save(application);
    }

    @Test
    void updateApplicationStatus_whenApplicationMissing_throwsException() {
        when(applicationRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                ApplicationNotFoundException.class,
                () -> applicationService.updateApplicationStatus(
                        99L, ApplicationStatus.SHORTLISTED)
        );
    }
}
