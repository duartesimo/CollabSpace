package com.collabspace.feature.activity;

import com.collabspace.feature.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<ActivityEvent, Long> {
	List<ActivityEvent> findByTaskOrderByCreatedAtAsc(Task task);
}
