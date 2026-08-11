package com.collabspace.feature.workspace.dto;

import com.collabspace.feature.workspace.member.WorkspaceRole;

import java.time.LocalDateTime;

public class WorkspaceMemberResponse {

	private Long userId;
	private String username;
	private String email;
	private WorkspaceRole role;
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

	public WorkspaceRole getRole() {
		return role;
	}

	public void setRole(WorkspaceRole role) {
		this.role = role;
	}

	public LocalDateTime getJoinedAt() {
		return joinedAt;
	}

	public void setJoinedAt(LocalDateTime joinedAt) {
		this.joinedAt = joinedAt;
	}
}
