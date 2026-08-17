package com.collabspace.feature.comment;

import com.collabspace.feature.comment.dto.CommentResponse;
import com.collabspace.feature.comment.dto.CreateCommentRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CommentController {

	private final CommentService commentService;

	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}

	@GetMapping("/api/tasks/{taskId}/comments")
	public ResponseEntity<List<CommentResponse>> getTaskComments(@PathVariable Long taskId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(commentService.getTaskComments(email, taskId));
	}

	@PostMapping("/api/tasks/{taskId}/comments")
	public ResponseEntity<CommentResponse> createComment(@PathVariable Long taskId,
			@Valid @RequestBody CreateCommentRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		CommentResponse response = commentService.createComment(email, taskId, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@DeleteMapping("/api/comments/{id}")
	public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		commentService.deleteComment(email, id);
		return ResponseEntity.noContent().build();
	}
}
