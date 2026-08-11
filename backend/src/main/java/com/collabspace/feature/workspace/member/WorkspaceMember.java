package com.collabspace.feature.workspace.member;

import com.collabspace.feature.user.User;
import com.collabspace.feature.workspace.Workspace;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(name = "workspace_members", uniqueConstraints = @UniqueConstraint(name = "uk_workspace_members_workspace_user", columnNames = {
		"workspace_id", "user_id" }))
public class WorkspaceMember {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "workspace_id", nullable = false)
	private Workspace workspace;

	@ManyToOne(optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false, length = 20)
	private WorkspaceRole role;

	@Column(name = "joined_at", nullable = false)
	private LocalDateTime joinedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Workspace getWorkspace() {
		return workspace;
	}

	public void setWorkspace(Workspace workspace) {
		this.workspace = workspace;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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
