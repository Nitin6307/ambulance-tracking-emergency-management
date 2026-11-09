
package com.ambulance.management.service;

import com.ambulance.management.entity.Role;
import com.ambulance.management.entity.User;
import com.ambulance.management.entity.DriverStatus;
import com.ambulance.management.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        if (user.getRole() == null) {
            user.setRole(Role.PATIENT);
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllDrivers() {
        return userRepository.findByRole(Role.DRIVER);
    }

    public User updateDriverStatus(Long driverId, DriverStatus newStatus) {

        User driver = getUserById(driverId);

        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException("User is not a driver");
        }

        if (newStatus != DriverStatus.AVAILABLE
                && newStatus != DriverStatus.OFF_DUTY) {
            throw new IllegalArgumentException(
                    "Admin can only set AVAILABLE or OFF_DUTY status"
            );
        }

        DriverStatus currentStatus = driver.getDriverStatus();

        if (currentStatus == DriverStatus.ASSIGNED
                || currentStatus == DriverStatus.ON_DUTY) {
            throw new IllegalStateException(
                    "Driver cannot change availability while assigned or on duty"
            );
        }

        if (currentStatus == null) {
            throw new IllegalStateException(
                    "Driver status is not initialized"
            );
        }

        driver.setDriverStatus(newStatus);

        return userRepository.save(driver);
    }
}
