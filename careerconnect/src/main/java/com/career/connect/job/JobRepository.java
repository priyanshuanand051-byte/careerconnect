package com.career.connect.job;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

	public interface JobRepository extends JpaRepository<Job, Long> {

	    @Query("""
	        SELECT j FROM Job j
	        WHERE (
	            :keyword = ''
	            OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
	            OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
	        )
	        AND (
	            :location = ''
	            OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))
	        )
	        AND (
	            :jobType = ''
	            OR LOWER(j.jobType) = LOWER(:jobType)
	        )
	        """)
	    Page<Job> searchJobs(
	            @Param("keyword") String keyword,
	            @Param("location") String location,
	            @Param("jobType") String jobType,
	            Pageable pageable);

          List<Job> findByRecruiter_Id(Long recruiterId);

	}



