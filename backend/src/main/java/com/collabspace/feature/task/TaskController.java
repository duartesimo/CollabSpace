package com.collabspace.feature.task;

import com.collabspace.feature.task.dto.CreateTaskRequest;
import com.collabspace.feature.task.dto.TaskResponse;
import com.collabspace.feature.task.dto.UpdateTaskRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TaskController {

	private final TaskService taskService;

	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@GetMapping("/api/tasks/{id}")
	public ResponseEntity<TaskResponse> getTask(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(taskService.getTask(email, id));
	}

	@PatchMapping("/api/tasks/{id}")
	public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
			@Valid @RequestBody UpdateTaskRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(taskService.updateTask(email, id, request));
	}

	@DeleteMapping("/api/tasks/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		taskService.deleteTask(email, id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/api/tasks/{id}/assignee/{userId}")
	public ResponseEntity<TaskResponse> assignTask(@PathVariable Long id, @PathVariable Long userId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(taskService.assignTask(email, id, userId));
	}

	@DeleteMapping("/api/tasks/{id}/assignee")
	public ResponseEntity<TaskResponse> unassignTask(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(taskService.unassignTask(email, id));
	}

	@GetMapping("/api/projects/{projectId}/tasks")
	public ResponseEntity<List<TaskResponse>> getProjectTasks(@PathVariable Long projectId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(taskService.getProjectTasks(email, projectId));
	}

	@PostMapping("/api/projects/{projectId}/tasks")
	public ResponseEntity<TaskResponse> createTask(@PathVariable Long projectId,
			@Valid @RequestBody CreateTaskRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		TaskResponse response = taskService.createTask(email, projectId, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
