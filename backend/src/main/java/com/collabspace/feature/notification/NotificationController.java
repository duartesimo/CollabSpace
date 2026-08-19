package com.collabspace.feature.notification;

import com.collabspace.feature.notification.dto.NotificationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@GetMapping
	public ResponseEntity<List<NotificationResponse>> getNotifications() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(notificationService.getUserNotifications(email));
	}

	@PatchMapping("/{id}/read")
	public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(notificationService.markAsRead(email, id));
	}
}
