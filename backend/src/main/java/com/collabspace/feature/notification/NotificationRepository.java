package com.collabspace.feature.notification;

import com.collabspace.feature.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
}
