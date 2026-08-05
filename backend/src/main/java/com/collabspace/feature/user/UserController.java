package com.collabspace.feature.user;

import com.collabspace.feature.user.dto.CreateUserRequest;
import com.collabspace.feature.user.dto.UpdateUserRequest;
import com.collabspace.feature.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping
	public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody CreateUserRequest request) {
		User user = userService.registerUser(request);

		return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(user));
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
		User user = userService.getUserById(id);
		return ResponseEntity.ok(mapToResponse(user));
	}

	@PutMapping("/{id}")
	public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
			@Valid @RequestBody UpdateUserRequest request) {
		User user = userService.updateUser(id, request);
		return ResponseEntity.ok(mapToResponse(user));
	}

	private UserResponse mapToResponse(User user) {
		UserResponse response = new UserResponse();
		response.setId(user.getId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setCreatedAt(user.getCreatedAt());
		return response;
	}
}
