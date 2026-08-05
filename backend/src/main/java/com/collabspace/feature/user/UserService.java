package com.collabspace.feature.user;

import com.collabspace.feature.user.dto.CreateUserRequest;
import com.collabspace.feature.user.dto.UpdateUserRequest;
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

	public User getUserById(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
	}

	public User updateUser(Long id, UpdateUserRequest request) {
		User user = getUserById(id);

		if (!user.getUsername().equals(request.getUsername())
				&& userRepository.existsByUsername(request.getUsername())) {
			throw new IllegalArgumentException("Username already exists");
		}

		if (!user.getEmail().equals(request.getEmail())
				&& userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}

		user.setUsername(request.getUsername());
		user.setEmail(request.getEmail());
		user.setUpdatedAt(LocalDateTime.now());

		return userRepository.save(user);
	}
}
