package com.collabspace.feature.workspace;

import com.collabspace.feature.workspace.dto.AddWorkspaceMemberRequest;
import com.collabspace.feature.workspace.dto.CreateWorkspaceRequest;
import com.collabspace.feature.workspace.dto.UpdateWorkspaceRequest;
import com.collabspace.feature.workspace.dto.WorkspaceMemberResponse;
import com.collabspace.feature.workspace.dto.WorkspaceResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
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
	private final WorkspaceMemberService workspaceMemberService;

	public WorkspaceController(WorkspaceService workspaceService, WorkspaceMemberService workspaceMemberService) {
		this.workspaceService = workspaceService;
		this.workspaceMemberService = workspaceMemberService;
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

	@GetMapping("/{id}")
	public ResponseEntity<WorkspaceResponse> getWorkspace(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		Workspace workspace = workspaceMemberService.getWorkspaceForMember(email, id);
		return ResponseEntity.ok(mapToResponse(workspace));
	}

	@PatchMapping("/{id}")
	public ResponseEntity<WorkspaceResponse> updateWorkspace(@PathVariable Long id,
			@Valid @RequestBody UpdateWorkspaceRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		Workspace workspace = workspaceService.updateWorkspace(email, id, request);
		return ResponseEntity.ok(mapToResponse(workspace));
	}

	@GetMapping("/{id}/members")
	public ResponseEntity<List<WorkspaceMemberResponse>> getWorkspaceMembers(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		List<WorkspaceMemberResponse> members = workspaceMemberService.getWorkspaceMembers(email, id);
		return ResponseEntity.ok(members);
	}

	@PostMapping("/{id}/members")
	public ResponseEntity<WorkspaceMemberResponse> addWorkspaceMember(@PathVariable Long id,
			@Valid @RequestBody AddWorkspaceMemberRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		WorkspaceMemberResponse response = workspaceMemberService.addMember(email, id, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@DeleteMapping("/{workspaceId}/members/{userId}")
	public ResponseEntity<Void> removeWorkspaceMember(@PathVariable Long workspaceId, @PathVariable Long userId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		workspaceMemberService.removeMember(email, workspaceId, userId);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteWorkspace(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		workspaceService.deleteWorkspace(email, id);
		return ResponseEntity.noContent().build();
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
