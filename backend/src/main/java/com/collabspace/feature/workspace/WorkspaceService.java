package com.collabspace.feature.workspace;

import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import com.collabspace.feature.workspace.dto.CreateWorkspaceRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkspaceService {

	private final WorkspaceRepository workspaceRepository;
	private final UserRepository userRepository;

	public WorkspaceService(WorkspaceRepository workspaceRepository, UserRepository userRepository) {
		this.workspaceRepository = workspaceRepository;
		this.userRepository = userRepository;
	}

	public Workspace createWorkspace(String email, CreateWorkspaceRequest request) {
		User owner = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Workspace workspace = new Workspace();
		workspace.setName(request.getName());
		workspace.setDescription(request.getDescription());
		workspace.setOwner(owner);
		workspace.setCreatedAt(LocalDateTime.now());

		return workspaceRepository.save(workspace);
	}

	public List<Workspace> getUserWorkspaces(String email) {
		User owner = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		return workspaceRepository.findByOwner(owner);
	}
}
