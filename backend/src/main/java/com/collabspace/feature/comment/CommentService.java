package com.collabspace.feature.comment;

import com.collabspace.feature.activity.ActivityService;
import com.collabspace.feature.activity.ActivityType;
import com.collabspace.feature.comment.dto.CommentResponse;
import com.collabspace.feature.comment.dto.CreateCommentRequest;
import com.collabspace.feature.notification.NotificationService;
import com.collabspace.feature.notification.NotificationType;
import com.collabspace.feature.project.ProjectMemberService;
import com.collabspace.feature.task.Task;
import com.collabspace.feature.task.TaskRepository;
import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

	private final CommentRepository commentRepository;
	private final TaskRepository taskRepository;
	private final UserRepository userRepository;
	private final ProjectMemberService projectMemberService;
	private final ActivityService activityService;
	private final NotificationService notificationService;

	public CommentService(CommentRepository commentRepository, TaskRepository taskRepository, UserRepository userRepository,
			ProjectMemberService projectMemberService, ActivityService activityService,
			NotificationService notificationService) {
		this.commentRepository = commentRepository;
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
		this.projectMemberService = projectMemberService;
		this.activityService = activityService;
		this.notificationService = notificationService;
	}

	public List<CommentResponse> getTaskComments(String email, Long taskId) {
		Task task = getTask(taskId);
		projectMemberService.getProjectForMember(email, task.getProject().getId());

		return commentRepository.findByTaskOrderByCreatedAtAsc(task).stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Transactional
	public CommentResponse createComment(String email, Long taskId, CreateCommentRequest request) {
		Task task = getTask(taskId);
		projectMemberService.getProjectForMember(email, task.getProject().getId());

		User author = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		LocalDateTime now = LocalDateTime.now();

		Comment comment = new Comment();
		comment.setTask(task);
		comment.setAuthor(author);
		comment.setContent(request.getContent());
		comment.setCreatedAt(now);
		comment.setUpdatedAt(now);

		Comment savedComment = commentRepository.save(comment);
		activityService.createActivity(task, author, ActivityType.COMMENT_CREATED,
				author.getUsername() + " added a comment");
		if (task.getAssignee() != null && !task.getAssignee().getId().equals(author.getId())) {
			notificationService.createNotification(task.getAssignee(), NotificationType.COMMENT_CREATED,
					"New comment",
					author.getUsername() + " commented on " + task.getTitle());
		}

		return mapToResponse(savedComment);
	}

	@Transactional
	public void deleteComment(String email, Long commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new IllegalArgumentException("Comment not found"));

		projectMemberService.getProjectForMember(email, comment.getTask().getProject().getId());

		User currentUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		if (!comment.getAuthor().getId().equals(currentUser.getId())) {
			throw new IllegalArgumentException("You can only delete your own comments");
		}

		commentRepository.delete(comment);
	}

	private Task getTask(Long taskId) {
		return taskRepository.findById(taskId)
				.orElseThrow(() -> new IllegalArgumentException("Task not found"));
	}

	private CommentResponse mapToResponse(Comment comment) {
		CommentResponse response = new CommentResponse();
		response.setId(comment.getId());
		response.setContent(comment.getContent());

		CommentResponse.AuthorResponse author = new CommentResponse.AuthorResponse();
		author.setId(comment.getAuthor().getId());
		author.setUsername(comment.getAuthor().getUsername());
		author.setEmail(comment.getAuthor().getEmail());
		response.setAuthor(author);

		response.setCreatedAt(comment.getCreatedAt());
		response.setUpdatedAt(comment.getUpdatedAt());
		return response;
	}
}
