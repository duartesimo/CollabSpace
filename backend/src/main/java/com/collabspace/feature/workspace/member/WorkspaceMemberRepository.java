package com.collabspace.feature.workspace.member;

import com.collabspace.feature.user.User;
import com.collabspace.feature.workspace.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {
	List<WorkspaceMember> findByWorkspace(Workspace workspace);

	Optional<WorkspaceMember> findByWorkspaceAndUser(Workspace workspace, User user);
}
