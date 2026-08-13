package com.collabspace.feature.project;

import com.collabspace.feature.project.dto.CreateProjectRequest;
import com.collabspace.feature.project.dto.AddProjectMemberRequest;
import com.collabspace.feature.project.dto.ProjectMemberResponse;
import com.collabspace.feature.project.dto.ProjectResponse;
import com.collabspace.feature.project.dto.UpdateProjectRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProjectController {

	private final ProjectService projectService;
	private final ProjectMemberService projectMemberService;

	public ProjectController(ProjectService projectService, ProjectMemberService projectMemberService) {
		this.projectService = projectService;
		this.projectMemberService = projectMemberService;
	}

	@GetMapping("/api/projects/{id}")
	public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(projectService.getProject(email, id));
	}

	@PatchMapping("/api/projects/{id}")
	public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id,
			@Valid @RequestBody UpdateProjectRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(projectService.updateProject(email, id, request));
	}

	@DeleteMapping("/api/projects/{id}")
	public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		projectService.deleteProject(email, id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/api/projects/{id}/members")
	public ResponseEntity<List<ProjectMemberResponse>> getProjectMembers(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(projectMemberService.getProjectMembers(email, id));
	}

	@PostMapping("/api/projects/{id}/members")
	public ResponseEntity<ProjectMemberResponse> addProjectMember(@PathVariable Long id,
			@Valid @RequestBody AddProjectMemberRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		ProjectMemberResponse response = projectMemberService.addMember(email, id, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@DeleteMapping("/api/projects/{id}/members/{userId}")
	public ResponseEntity<Void> removeProjectMember(@PathVariable Long id, @PathVariable Long userId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		projectMemberService.removeMember(email, id, userId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/api/workspaces/{workspaceId}/projects")
	public ResponseEntity<List<ProjectResponse>> getProjects(@PathVariable Long workspaceId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(projectService.getProjects(email, workspaceId));
	}

	@PostMapping("/api/workspaces/{workspaceId}/projects")
	public ResponseEntity<ProjectResponse> createProject(@PathVariable Long workspaceId,
			@Valid @RequestBody CreateProjectRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		ProjectResponse response = projectService.createProject(email, workspaceId, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
