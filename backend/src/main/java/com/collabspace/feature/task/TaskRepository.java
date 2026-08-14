package com.collabspace.feature.task;

import com.collabspace.feature.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
	List<Task> findByProjectOrderByCreatedAtDesc(Project project);
}
