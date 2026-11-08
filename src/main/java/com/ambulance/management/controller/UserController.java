package com.ambulance.management.controller;

import com.ambulance.management.dto.RegisterRequest;
import com.ambulance.management.entity.Role;
import com.ambulance.management.entity.User;
import com.ambulance.management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ambulance.management.dto.UserResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(
            @Valid @RequestBody RegisterRequest request) {

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                Role.PATIENT
        );

        User savedUser = userService.registerUser(user);

        UserResponse response = new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping("/patient-test")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<String> patientTest() {

        return ResponseEntity.ok(
                "PATIENT access granted"
        );
    }
    @GetMapping("/driver-test")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<String> driverTest() {

        return ResponseEntity.ok(
                "DRIVER access granted"
        );
    }
    @GetMapping("/admin-test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminTest() {

        return ResponseEntity.ok(
                "ADMIN access granted"
        );
    }
    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser(Authentication authentication) {

        return ResponseEntity.ok(
                "Authenticated user: " + authentication.getName()
        );
    }

    @GetMapping("/drivers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllDrivers() {

        List<UserResponse> drivers = userService.getAllDrivers()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();

        return ResponseEntity.ok(drivers);
    }
}