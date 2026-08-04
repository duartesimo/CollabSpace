package com.collabspace.feature.user;

import com.collabspace.feature.user.dto.CreateUserRequest;
import com.collabspace.feature.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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

		UserResponse response = new UserResponse();
		response.setId(user.getId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setCreatedAt(user.getCreatedAt());

		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
