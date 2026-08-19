package com.collabspace.feature.task;

import com.collabspace.feature.activity.ActivityService;
import com.collabspace.feature.activity.ActivityType;
import com.collabspace.feature.notification.NotificationService;
import com.collabspace.feature.notification.NotificationType;
import com.collabspace.feature.project.Project;
import com.collabspace.feature.project.ProjectMemberService;
import com.collabspace.feature.task.dto.TaskAssigneeResponse;
import com.collabspace.feature.task.dto.CreateTaskRequest;
import com.collabspace.feature.task.dto.TaskResponse;
import com.collabspace.feature.task.dto.UpdateTaskRequest;
import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

	private final TaskRepository taskRepository;
	private final UserRepository userRepository;
	private final ProjectMemberService projectMemberService;
	private final ActivityService activityService;
	private final NotificationService notificationService;

	public TaskService(TaskRepository taskRepository, UserRepository userRepository,
			ProjectMemberService projectMemberService, ActivityService activityService,
			NotificationService notificationService) {
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
		this.projectMemberService = projectMemberService;
		this.activityService = activityService;
		this.notificationService = notificationService;
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
	public TaskResponse updateTask(String email, Long taskId, UpdateTaskRequest request) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new IllegalArgumentException("Task not found"));

		projectMemberService.getProjectForMember(email, task.getProject().getId());
		User currentUser = getUser(email);
		TaskStatus previousStatus = task.getStatus();
		task.setTitle(request.getTitle());
		task.setDescription(request.getDescription());
		task.setStatus(request.getStatus());
		task.setUpdatedAt(LocalDateTime.now());

		Task updatedTask = taskRepository.save(task);
		if (previousStatus != request.getStatus()) {
			activityService.createActivity(updatedTask, currentUser, ActivityType.TASK_STATUS_CHANGED,
					currentUser.getUsername() + " changed status from " + previousStatus + " to " + request.getStatus());
			if (updatedTask.getAssignee() != null
					&& !updatedTask.getAssignee().getId().equals(currentUser.getId())) {
				notificationService.createNotification(updatedTask.getAssignee(), NotificationType.TASK_STATUS_CHANGED,
						"Task status changed",
						currentUser.getUsername() + " changed task status to " + request.getStatus());
			}
		} else {
			activityService.createActivity(updatedTask, currentUser, ActivityType.TASK_UPDATED,
					currentUser.getUsername() + " updated this task");
		}

		return mapToResponse(updatedTask);
	}

	@Transactional
	public void deleteTask(String email, Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new IllegalArgumentException("Task not found"));

		projectMemberService.getProjectForMember(email, task.getProject().getId());
		taskRepository.delete(task);
	}

	@Transactional
	public TaskResponse assignTask(String email, Long taskId, Long userId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new IllegalArgumentException("Task not found"));

		projectMemberService.getProjectForMember(email, task.getProject().getId());

		User assignee = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		projectMemberService.verifyProjectMember(task.getProject(), assignee);
		User currentUser = getUser(email);
		task.setAssignee(assignee);
		task.setUpdatedAt(LocalDateTime.now());

		Task updatedTask = taskRepository.save(task);
		activityService.createActivity(updatedTask, currentUser, ActivityType.TASK_ASSIGNED,
				currentUser.getUsername() + " assigned this task to " + assignee.getUsername());
		if (!assignee.getId().equals(currentUser.getId())) {
			notificationService.createNotification(assignee, NotificationType.TASK_ASSIGNED,
					"Task assigned",
					currentUser.getUsername() + " assigned you to task " + updatedTask.getTitle());
		}

		return mapToResponse(updatedTask);
	}

	@Transactional
	public TaskResponse unassignTask(String email, Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new IllegalArgumentException("Task not found"));

		projectMemberService.getProjectForMember(email, task.getProject().getId());
		User previousAssignee = task.getAssignee();
		if (previousAssignee == null) {
			return mapToResponse(task);
		}

		User currentUser = getUser(email);
		task.setAssignee(null);
		task.setUpdatedAt(LocalDateTime.now());

		Task updatedTask = taskRepository.save(task);
		activityService.createActivity(updatedTask, currentUser, ActivityType.TASK_UNASSIGNED,
				currentUser.getUsername() + " removed " + previousAssignee.getUsername() + " from this task");

		return mapToResponse(updatedTask);
	}

	@Transactional
	public TaskResponse createTask(String email, Long projectId, CreateTaskRequest request) {
		Project project = projectMemberService.getProjectForMember(email, projectId);
		User currentUser = getUser(email);
		LocalDateTime now = LocalDateTime.now();

		Task task = new Task();
		task.setProject(project);
		task.setTitle(request.getTitle());
		task.setDescription(request.getDescription());
		task.setStatus(TaskStatus.TODO);
		task.setCreatedAt(now);
		task.setUpdatedAt(now);

		Task savedTask = taskRepository.save(task);
		activityService.createActivity(savedTask, currentUser, ActivityType.TASK_CREATED,
				currentUser.getUsername() + " created this task");

		return mapToResponse(savedTask);
	}

	private User getUser(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
	}

	private TaskResponse mapToResponse(Task task) {
		TaskResponse response = new TaskResponse();
		response.setId(task.getId());
		response.setProjectId(task.getProject().getId());
		if (task.getAssignee() != null) {
			TaskAssigneeResponse assignee = new TaskAssigneeResponse();
			assignee.setId(task.getAssignee().getId());
			assignee.setUsername(task.getAssignee().getUsername());
			assignee.setEmail(task.getAssignee().getEmail());
			response.setAssignee(assignee);
		}
		response.setTitle(task.getTitle());
		response.setDescription(task.getDescription());
		response.setStatus(task.getStatus());
		response.setCreatedAt(task.getCreatedAt());
		response.setUpdatedAt(task.getUpdatedAt());
		return response;
	}
}
