package com.collabspace.feature.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTaskRequest {

	@NotBlank(message = "Title is required")
	@Size(max = 100, message = "Title must be at most 100 characters")
	private String title;

	@Size(max = 500, message = "Description must be at most 500 characters")
	private String description;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
