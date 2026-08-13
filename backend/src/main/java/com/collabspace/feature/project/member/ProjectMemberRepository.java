package com.collabspace.feature.project.member;

import com.collabspace.feature.project.Project;
import com.collabspace.feature.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
	List<ProjectMember> findByProject(Project project);

	Optional<ProjectMember> findByProjectAndUser(Project project, User user);
}
