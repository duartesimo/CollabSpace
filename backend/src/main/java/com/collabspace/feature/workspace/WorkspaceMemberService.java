package com.collabspace.feature.workspace;

import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import com.collabspace.feature.workspace.dto.AddWorkspaceMemberRequest;
import com.collabspace.feature.workspace.dto.WorkspaceMemberResponse;
import com.collabspace.feature.workspace.member.WorkspaceMember;
import com.collabspace.feature.workspace.member.WorkspaceMemberRepository;
import com.collabspace.feature.workspace.member.WorkspaceRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkspaceMemberService {

	private final WorkspaceRepository workspaceRepository;
	private final UserRepository userRepository;
	private final WorkspaceMemberRepository workspaceMemberRepository;

	public WorkspaceMemberService(WorkspaceRepository workspaceRepository, UserRepository userRepository,
			WorkspaceMemberRepository workspaceMemberRepository) {
		this.workspaceRepository = workspaceRepository;
		this.userRepository = userRepository;
		this.workspaceMemberRepository = workspaceMemberRepository;
	}

	public Workspace getWorkspaceForMember(String email, Long workspaceId) {
		User currentUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Workspace workspace = workspaceRepository.findById(workspaceId)
				.orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

		workspaceMemberRepository.findByWorkspaceAndUser(workspace, currentUser)
				.orElseThrow(() -> new IllegalArgumentException("You are not a member of this workspace"));

		return workspace;
	}

	public Workspace getWorkspaceForOwner(String email, Long workspaceId) {
		User currentUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Workspace workspace = workspaceRepository.findById(workspaceId)
				.orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

		WorkspaceMember membership = workspaceMemberRepository.findByWorkspaceAndUser(workspace, currentUser)
				.orElseThrow(() -> new IllegalArgumentException("You are not a member of this workspace"));

		ensureOwner(membership, "Only the workspace owner can modify this workspace");
		return workspace;
	}

	public List<WorkspaceMemberResponse> getWorkspaceMembers(String email, Long workspaceId) {
		Workspace workspace = getWorkspaceForMember(email, workspaceId);

		return workspaceMemberRepository.findByWorkspace(workspace).stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Transactional
	public WorkspaceMemberResponse addMember(String email, Long workspaceId, AddWorkspaceMemberRequest request) {
		User currentUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Workspace workspace = workspaceRepository.findById(workspaceId)
				.orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

		WorkspaceMember currentMembership = workspaceMemberRepository.findByWorkspaceAndUser(workspace, currentUser)
				.orElseThrow(() -> new IllegalArgumentException("You are not a member of this workspace"));

		ensureOwner(currentMembership, "Only the workspace owner can add members");

		User userToAdd = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		if (workspaceMemberRepository.findByWorkspaceAndUser(workspace, userToAdd).isPresent()) {
			throw new IllegalArgumentException("User is already a member of this workspace");
		}

		WorkspaceMember member = new WorkspaceMember();
		member.setWorkspace(workspace);
		member.setUser(userToAdd);
		member.setRole(WorkspaceRole.MEMBER);
		member.setJoinedAt(LocalDateTime.now());

		WorkspaceMember savedMember = workspaceMemberRepository.save(member);
		return mapToResponse(savedMember);
	}

	@Transactional
	public void removeMember(String email, Long workspaceId, Long userId) {
		User currentUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Workspace workspace = workspaceRepository.findById(workspaceId)
				.orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

		WorkspaceMember currentMembership = workspaceMemberRepository.findByWorkspaceAndUser(workspace, currentUser)
				.orElseThrow(() -> new IllegalArgumentException("You are not a member of this workspace"));

		ensureOwner(currentMembership, "Only the workspace owner can remove members");

		User userToRemove = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		WorkspaceMember targetMembership = workspaceMemberRepository.findByWorkspaceAndUser(workspace, userToRemove)
				.orElseThrow(() -> new IllegalArgumentException("User is not a member of this workspace"));

		if (targetMembership.getRole() == WorkspaceRole.OWNER) {
			throw new IllegalArgumentException("The workspace owner cannot be removed");
		}

		workspaceMemberRepository.delete(targetMembership);
	}

	private void ensureOwner(WorkspaceMember membership, String message) {
		if (membership.getRole() != WorkspaceRole.OWNER) {
			throw new IllegalArgumentException(message);
		}
	}

	private WorkspaceMemberResponse mapToResponse(WorkspaceMember workspaceMember) {
		WorkspaceMemberResponse response = new WorkspaceMemberResponse();
		response.setUserId(workspaceMember.getUser().getId());
		response.setUsername(workspaceMember.getUser().getUsername());
		response.setEmail(workspaceMember.getUser().getEmail());
		response.setRole(workspaceMember.getRole());
		response.setJoinedAt(workspaceMember.getJoinedAt());
		return response;
	}
}
