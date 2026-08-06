package com.collabspace.feature.auth;

import com.collabspace.core.security.JwtService;
import com.collabspace.feature.auth.dto.LoginRequest;
import com.collabspace.feature.user.User;
import com.collabspace.feature.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	public String login(LoginRequest request) {
		Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

		if (userOptional.isEmpty()) {
			throw new IllegalArgumentException("Invalid credentials");
		}

		User user = userOptional.get();
		if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
			throw new IllegalArgumentException("Invalid credentials");
		}

		return jwtService.generateToken(user.getEmail());
	}
}
