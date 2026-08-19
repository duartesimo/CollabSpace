package com.collabspace.feature.project;

import com.collabspace.feature.notification.NotificationService;
import com.collabspace.feature.notification.NotificationType;
import com.collabspace.feature.project.dto.AddProjectMemberRequest;
import com.collabspace.feature.project.dto.ProjectMemberResponse;
import com.collabspace.feature.project.member.ProjectMember;
import com.collabspace.feature.project.member.ProjectMemberRepository;
import com.collabspace.feature.project.member.ProjectRole;
import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import com.collabspace.feature.workspace.WorkspaceMemberService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectMemberService {

	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	private final ProjectMemberRepository projectMemberRepository;
	private final WorkspaceMemberService workspaceMemberService;
	private final NotificationService notificationService;

	public ProjectMemberService(ProjectRepository projectRepository, UserRepository userRepository,
			ProjectMemberRepository projectMemberRepository, WorkspaceMemberService workspaceMemberService,
			NotificationService notificationService) {
		this.projectRepository = projectRepository;
		this.userRepository = userRepository;
		this.projectMemberRepository = projectMemberRepository;
		this.workspaceMemberService = workspaceMemberService;
		this.notificationService = notificationService;
	}

	public List<ProjectMemberResponse> getProjectMembers(String email, Long projectId) {
		Project project = getProject(projectId);
		workspaceMemberService.getWorkspaceForMember(email, project.getWorkspace().getId());

		return projectMemberRepository.findByProject(project).stream()
				.map(this::mapToResponse)
				.toList();
	}

	public Project getProjectForMember(String email, Long projectId) {
		User currentUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Project project = getProject(projectId);
		projectMemberRepository.findByProjectAndUser(project, currentUser)
				.orElseThrow(() -> new IllegalArgumentException("You are not a member of this project"));

		return project;
	}

	public void verifyProjectMember(Project project, User user) {
		projectMemberRepository.findByProjectAndUser(project, user)
				.orElseThrow(() -> new IllegalArgumentException("User is not a member of this project"));
	}

	@Transactional
	public ProjectMemberResponse addMember(String email, Long projectId, AddProjectMemberRequest request) {
		Project project = getProject(projectId);
		workspaceMemberService.getWorkspaceForOwner(email, project.getWorkspace().getId());

		User userToAdd = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		workspaceMemberService.getWorkspaceForMember(userToAdd.getEmail(), project.getWorkspace().getId());

		if (projectMemberRepository.findByProjectAndUser(project, userToAdd).isPresent()) {
			throw new IllegalArgumentException("User is already a member of this project");
		}

		ProjectMember member = new ProjectMember();
		member.setProject(project);
		member.setUser(userToAdd);
		member.setRole(ProjectRole.MEMBER);
		member.setJoinedAt(LocalDateTime.now());

		ProjectMember savedMember = projectMemberRepository.save(member);
		notificationService.createNotification(userToAdd, NotificationType.PROJECT_MEMBER_ADDED,
				"Added to project",
				"You were added to project " + project.getName());

		return mapToResponse(savedMember);
	}

	@Transactional
	public void removeMember(String email, Long projectId, Long userId) {
		Project project = getProject(projectId);
		workspaceMemberService.getWorkspaceForOwner(email, project.getWorkspace().getId());

		User userToRemove = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		ProjectMember member = projectMemberRepository.findByProjectAndUser(project, userToRemove)
				.orElseThrow(() -> new IllegalArgumentException("User is not a member of this project"));

		if (member.getRole() == ProjectRole.OWNER) {
			throw new IllegalArgumentException("The project owner cannot be removed");
		}

		projectMemberRepository.delete(member);
		notificationService.createNotification(userToRemove, NotificationType.PROJECT_MEMBER_REMOVED,
				"Removed from project",
				"You were removed from project " + project.getName());
	}

	private Project getProject(Long projectId) {
		return projectRepository.findById(projectId)
				.orElseThrow(() -> new IllegalArgumentException("Project not found"));
	}

	private ProjectMemberResponse mapToResponse(ProjectMember member) {
		ProjectMemberResponse response = new ProjectMemberResponse();
		response.setUserId(member.getUser().getId());
		response.setUsername(member.getUser().getUsername());
		response.setEmail(member.getUser().getEmail());
		response.setRole(member.getRole());
		response.setJoinedAt(member.getJoinedAt());
		return response;
	}
}
