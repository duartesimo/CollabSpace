package com.collabspace.feature.activity;

import com.collabspace.feature.activity.dto.ActivityResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ActivityController {

	private final ActivityService activityService;

	public ActivityController(ActivityService activityService) {
		this.activityService = activityService;
	}

	@GetMapping("/api/tasks/{taskId}/activity")
	public ResponseEntity<List<ActivityResponse>> getTaskActivity(@PathVariable Long taskId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(activityService.getTaskActivity(email, taskId));
	}
}
