package com.collabspace.feature.workspace;

import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import com.collabspace.feature.workspace.dto.CreateWorkspaceRequest;
import com.collabspace.feature.workspace.member.WorkspaceMember;
import com.collabspace.feature.workspace.member.WorkspaceMemberRepository;
import com.collabspace.feature.workspace.member.WorkspaceRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkspaceService {

	private final WorkspaceRepository workspaceRepository;
	private final UserRepository userRepository;
	private final WorkspaceMemberRepository workspaceMemberRepository;

	public WorkspaceService(WorkspaceRepository workspaceRepository, UserRepository userRepository,
			WorkspaceMemberRepository workspaceMemberRepository) {
		this.workspaceRepository = workspaceRepository;
		this.userRepository = userRepository;
		this.workspaceMemberRepository = workspaceMemberRepository;
	}

	@Transactional
	public Workspace createWorkspace(String email, CreateWorkspaceRequest request) {
		User owner = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Workspace workspace = new Workspace();
		workspace.setName(request.getName());
		workspace.setDescription(request.getDescription());
		workspace.setOwner(owner);
		workspace.setCreatedAt(LocalDateTime.now());

		Workspace savedWorkspace = workspaceRepository.save(workspace);

		WorkspaceMember ownerMembership = new WorkspaceMember();
		ownerMembership.setWorkspace(savedWorkspace);
		ownerMembership.setUser(owner);
		ownerMembership.setRole(WorkspaceRole.OWNER);
		ownerMembership.setJoinedAt(LocalDateTime.now());
		workspaceMemberRepository.save(ownerMembership);

		return savedWorkspace;
	}

	public List<Workspace> getUserWorkspaces(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		return workspaceMemberRepository.findByUser(user).stream()
				.map(WorkspaceMember::getWorkspace)
				.toList();
	}
}
