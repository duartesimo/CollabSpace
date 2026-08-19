package com.collabspace.feature.notification;

import com.collabspace.feature.notification.dto.NotificationResponse;
import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;

	public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
		this.notificationRepository = notificationRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public Notification createNotification(User recipient, NotificationType type, String title, String message) {
		Notification notification = new Notification();
		notification.setRecipient(recipient);
		notification.setType(type);
		notification.setTitle(title);
		notification.setMessage(message);
		notification.setRead(false);
		notification.setCreatedAt(LocalDateTime.now());

		return notificationRepository.save(notification);
	}

	@Transactional(readOnly = true)
	public List<NotificationResponse> getUserNotifications(String email) {
		User user = getUser(email);

		return notificationRepository.findByRecipientOrderByCreatedAtDesc(user).stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Transactional
	public NotificationResponse markAsRead(String email, Long notificationId) {
		User user = getUser(email);
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new IllegalArgumentException("Notification not found"));

		if (!notification.getRecipient().getId().equals(user.getId())) {
			throw new IllegalArgumentException("You can only update your own notifications");
		}

		notification.setRead(true);
		return mapToResponse(notificationRepository.save(notification));
	}

	private User getUser(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
	}

	private NotificationResponse mapToResponse(Notification notification) {
		NotificationResponse response = new NotificationResponse();
		response.setId(notification.getId());
		response.setType(notification.getType());
		response.setTitle(notification.getTitle());
		response.setMessage(notification.getMessage());
		response.setRead(notification.isRead());
		response.setCreatedAt(notification.getCreatedAt());
		return response;
	}
}
