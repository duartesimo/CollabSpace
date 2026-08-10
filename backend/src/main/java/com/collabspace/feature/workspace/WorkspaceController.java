package com.collabspace.feature.workspace;

import com.collabspace.feature.workspace.dto.CreateWorkspaceRequest;
import com.collabspace.feature.workspace.dto.WorkspaceResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

	private final WorkspaceService workspaceService;

	public WorkspaceController(WorkspaceService workspaceService) {
		this.workspaceService = workspaceService;
	}

	@PostMapping
	public ResponseEntity<WorkspaceResponse> createWorkspace(@Valid @RequestBody CreateWorkspaceRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		Workspace workspace = workspaceService.createWorkspace(email, request);

		return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(workspace));
	}

	@GetMapping
	public ResponseEntity<List<WorkspaceResponse>> getUserWorkspaces() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		List<Workspace> workspaces = workspaceService.getUserWorkspaces(email);

		return ResponseEntity.ok(workspaces.stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList()));
	}

	private WorkspaceResponse mapToResponse(Workspace workspace) {
		WorkspaceResponse response = new WorkspaceResponse();
		response.setId(workspace.getId());
		response.setName(workspace.getName());
		response.setDescription(workspace.getDescription());
		response.setOwnerUsername(workspace.getOwner().getUsername());
		response.setCreatedAt(workspace.getCreatedAt());
		return response;
	}
}
