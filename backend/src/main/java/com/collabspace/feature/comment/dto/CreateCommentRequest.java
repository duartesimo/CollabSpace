package com.collabspace.feature.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

	@NotBlank(message = "Content is required")
	@Size(max = 1000, message = "Content must be at most 1000 characters")
	private String content;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}
