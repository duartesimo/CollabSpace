package com.collabspace.feature.workspace;

import com.collabspace.feature.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
	List<Workspace> findByOwner(User owner);
}
