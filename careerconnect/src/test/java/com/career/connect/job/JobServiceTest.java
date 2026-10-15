
package com.career.connect.job;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.career.connect.job.exception.JobNotFoundException;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobService jobService;

    private Job job;

    @BeforeEach
    void setUp() {
        job = new Job();
        job.setTitle("Java Developer");
        job.setCompanyName("ABC Technologies");
        job.setLocation("Noida");
        job.setJobType("FULL_TIME");
        job.setDescription("Java backend development");
    }

    @Test
    void getJobById_whenJobExists_returnsJob() {
        when(jobRepository.findById(1L))
                .thenReturn(Optional.of(job));

        Job result = jobService.getJobById(1L);

        assertEquals("Java Developer", result.getTitle());
        assertEquals("ABC Technologies", result.getCompanyName());

        verify(jobRepository).findById(1L);
    }

    @Test
    void getJobById_whenJobDoesNotExist_throwsException() {
        when(jobRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                JobNotFoundException.class,
                () -> jobService.getJobById(99L)
        );

        verify(jobRepository).findById(99L);
    }

    @Test
    void searchJobs_whenPageIsNegative_throwsException() {
        assertThrows(
                IllegalArgumentException.class,
                () -> jobService.searchJobs(
                        "", "", "", -1, 10
                )
        );

        verifyNoInteractions(jobRepository);
    }
    

	@Test
	void createJob_savesJob() {
	    JobRequest request = new JobRequest();
	    request.setTitle("Java Developer");
	    request.setCompanyName("ABC Technologies");
	    request.setLocation("Noida");
	    request.setJobType("FULL_TIME");
	    request.setDescription("Java backend development");
	
	    when(jobRepository.save(
	            org.mockito.ArgumentMatchers.any(Job.class)))
	            .thenAnswer(invocation -> invocation.getArgument(0));
	
	    Job result = jobService.createJob(request);
	
	    assertEquals("Java Developer", result.getTitle());
	    assertEquals("ABC Technologies", result.getCompanyName());
	
	    verify(jobRepository).save(
	            org.mockito.ArgumentMatchers.any(Job.class));
	}
	
	@Test
	void updateJob_whenJobExists_updatesAndSavesJob() {
	    when(jobRepository.findById(1L))
	            .thenReturn(Optional.of(job));
	
	    JobRequest request = new JobRequest();
	    request.setTitle("Senior Java Developer");
	    request.setCompanyName("XYZ Technologies");
	    request.setLocation("Greater Noida");
	    request.setJobType("FULL_TIME");
	    request.setDescription("Spring Boot development");
	
	    when(jobRepository.save(job)).thenReturn(job);
	
	    Job result = jobService.updateJob(1L, request);
	
	    assertEquals("Senior Java Developer", result.getTitle());
	    assertEquals("XYZ Technologies", result.getCompanyName());
	
	    verify(jobRepository).save(job);
	}
	
	@Test
	void deleteJob_whenJobExists_deletesJob() {
	    when(jobRepository.findById(1L))
	            .thenReturn(Optional.of(job));
	
	    jobService.deleteJob(1L);
	
	    verify(jobRepository).delete(job);
	}

}
