package com.career.connect.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JobRequest {

	@NotBlank(message="Job Title is required")
	@Size(max=100,message="Job Title cannot exceed 100 characters")
	private String title;
	
	@NotBlank(message="Company Name is required")
	@Size(max=100,message="Comapny Name cannot exceeds 100 characters")
	private String companyName;
	
	@NotBlank(message="Location is mandatory")
	private String location;
	
	@NotBlank(message="Job Type is required")
	private String jobType;
	
	@NotBlank(message="description is required")
	@Size(max=2000,message="Description can not exceed 2000 characters")
	private String description;
	
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getJobType() {
		return jobType;
	}
	public void setJobType(String jobType) {
		this.jobType = jobType;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
}
