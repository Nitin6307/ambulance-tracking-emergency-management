
package com.ambulance.management.service;

import com.ambulance.management.dto.LoginRequest;
import com.ambulance.management.dto.LoginResponse;
import com.ambulance.management.entity.User;
import com.ambulance.management.repository.UserRepository;
import com.ambulance.management.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        // Verify password using BCrypt
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        // Return login response with user information
        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
