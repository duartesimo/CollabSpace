package com.collabspace.feature.task;

import com.collabspace.feature.project.Project;
import com.collabspace.feature.project.ProjectMemberService;
import com.collabspace.feature.task.dto.CreateTaskRequest;
import com.collabspace.feature.task.dto.TaskResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

	private final TaskRepository taskRepository;
	private final ProjectMemberService projectMemberService;

	public TaskService(TaskRepository taskRepository, ProjectMemberService projectMemberService) {
		this.taskRepository = taskRepository;
		this.projectMemberService = projectMemberService;
	}

	public List<TaskResponse> getProjectTasks(String email, Long projectId) {
		Project project = projectMemberService.getProjectForMember(email, projectId);
		return taskRepository.findByProjectOrderByCreatedAtDesc(project).stream()
				.map(this::mapToResponse)
				.toList();
	}

	public TaskResponse getTask(String email, Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new IllegalArgumentException("Task not found"));

		projectMemberService.getProjectForMember(email, task.getProject().getId());
		return mapToResponse(task);
	}

	@Transactional
	public TaskResponse createTask(String email, Long projectId, CreateTaskRequest request) {
		Project project = projectMemberService.getProjectForMember(email, projectId);
		LocalDateTime now = LocalDateTime.now();

		Task task = new Task();
		task.setProject(project);
		task.setTitle(request.getTitle());
		task.setDescription(request.getDescription());
		task.setStatus(TaskStatus.TODO);
		task.setCreatedAt(now);
		task.setUpdatedAt(now);

		return mapToResponse(taskRepository.save(task));
	}

	private TaskResponse mapToResponse(Task task) {
		TaskResponse response = new TaskResponse();
		response.setId(task.getId());
		response.setProjectId(task.getProject().getId());
		response.setTitle(task.getTitle());
		response.setDescription(task.getDescription());
		response.setStatus(task.getStatus());
		response.setCreatedAt(task.getCreatedAt());
		response.setUpdatedAt(task.getUpdatedAt());
		return response;
	}
}
