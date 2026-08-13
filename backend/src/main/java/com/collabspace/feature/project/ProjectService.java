package com.collabspace.feature.project;

import com.collabspace.feature.project.dto.CreateProjectRequest;
import com.collabspace.feature.project.dto.ProjectResponse;
import com.collabspace.feature.workspace.Workspace;
import com.collabspace.feature.workspace.WorkspaceMemberService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

	private final ProjectRepository projectRepository;
	private final WorkspaceMemberService workspaceMemberService;

	public ProjectService(ProjectRepository projectRepository, WorkspaceMemberService workspaceMemberService) {
		this.projectRepository = projectRepository;
		this.workspaceMemberService = workspaceMemberService;
	}

	public List<ProjectResponse> getProjects(String email, Long workspaceId) {
		Workspace workspace = workspaceMemberService.getWorkspaceForMember(email, workspaceId);
		return projectRepository.findByWorkspaceOrderByCreatedAtDesc(workspace).stream()
				.map(this::mapToResponse)
				.toList();
	}

	public ProjectResponse getProject(String email, Long projectId) {
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new IllegalArgumentException("Project not found"));

		workspaceMemberService.getWorkspaceForMember(email, project.getWorkspace().getId());
		return mapToResponse(project);
	}

	@Transactional
	public ProjectResponse createProject(String email, Long workspaceId, CreateProjectRequest request) {
		Workspace workspace = workspaceMemberService.getWorkspaceForOwner(email, workspaceId);
		LocalDateTime now = LocalDateTime.now();

		Project project = new Project();
		project.setWorkspace(workspace);
		project.setName(request.getName());
		project.setDescription(request.getDescription());
		project.setCreatedAt(now);
		project.setUpdatedAt(now);

		return mapToResponse(projectRepository.save(project));
	}

	private ProjectResponse mapToResponse(Project project) {
		ProjectResponse response = new ProjectResponse();
		response.setId(project.getId());
		response.setWorkspaceId(project.getWorkspace().getId());
		response.setName(project.getName());
		response.setDescription(project.getDescription());
		response.setCreatedAt(project.getCreatedAt());
		response.setUpdatedAt(project.getUpdatedAt());
		return response;
	}
}
