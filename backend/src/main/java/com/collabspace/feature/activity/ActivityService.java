package com.collabspace.feature.activity;

import com.collabspace.feature.activity.dto.ActivityResponse;
import com.collabspace.feature.project.ProjectMemberService;
import com.collabspace.feature.task.Task;
import com.collabspace.feature.task.TaskRepository;
import com.collabspace.feature.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityService {

	private final ActivityRepository activityRepository;
	private final TaskRepository taskRepository;
	private final ProjectMemberService projectMemberService;

	public ActivityService(ActivityRepository activityRepository, TaskRepository taskRepository,
			ProjectMemberService projectMemberService) {
		this.activityRepository = activityRepository;
		this.taskRepository = taskRepository;
		this.projectMemberService = projectMemberService;
	}

	@Transactional
	public ActivityEvent createActivity(Task task, User user, ActivityType type, String description) {
		ActivityEvent activity = new ActivityEvent();
		activity.setTask(task);
		activity.setUser(user);
		activity.setType(type);
		activity.setDescription(description);
		activity.setCreatedAt(LocalDateTime.now());

		return activityRepository.save(activity);
	}

	public List<ActivityResponse> getTaskActivity(String email, Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new IllegalArgumentException("Task not found"));

		projectMemberService.getProjectForMember(email, task.getProject().getId());

		return activityRepository.findByTaskOrderByCreatedAtAsc(task).stream()
				.map(this::mapToResponse)
				.toList();
	}

	private ActivityResponse mapToResponse(ActivityEvent activity) {
		ActivityResponse response = new ActivityResponse();
		response.setId(activity.getId());
		response.setType(activity.getType());
		response.setDescription(activity.getDescription());

		ActivityResponse.UserResponse user = new ActivityResponse.UserResponse();
		user.setId(activity.getUser().getId());
		user.setUsername(activity.getUser().getUsername());
		user.setEmail(activity.getUser().getEmail());
		response.setUser(user);

		response.setCreatedAt(activity.getCreatedAt());
		return response;
	}
}
