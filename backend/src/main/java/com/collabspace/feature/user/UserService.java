package com.collabspace.feature.user;

import com.collabspace.feature.user.dto.CreateUserRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public User registerUser(CreateUserRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new IllegalArgumentException("Username already exists");
		}

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}

		User user = new User();
		user.setUsername(request.getUsername());
		user.setEmail(request.getEmail());
		user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
		user.setCreatedAt(LocalDateTime.now());

		return userRepository.save(user);
	}
}
