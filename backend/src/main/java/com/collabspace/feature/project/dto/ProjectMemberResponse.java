package com.collabspace.feature.project.dto;

import com.collabspace.feature.project.member.ProjectRole;

import java.time.LocalDateTime;

public class ProjectMemberResponse {

	private Long userId;
	private String username;
	private String email;
	private ProjectRole role;
	private LocalDateTime joinedAt;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public ProjectRole getRole() {
		return role;
	}

	public void setRole(ProjectRole role) {
		this.role = role;
	}

	public LocalDateTime getJoinedAt() {
		return joinedAt;
	}

	public void setJoinedAt(LocalDateTime joinedAt) {
		this.joinedAt = joinedAt;
	}
}
