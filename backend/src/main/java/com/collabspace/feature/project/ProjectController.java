package com.collabspace.feature.project;

import com.collabspace.feature.project.dto.CreateProjectRequest;
import com.collabspace.feature.project.dto.ProjectResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProjectController {

	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@GetMapping("/api/projects/{id}")
	public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(projectService.getProject(email, id));
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
