
package com.ambulance.management.service;

import com.ambulance.management.entity.Role;
import com.ambulance.management.entity.User;
import com.ambulance.management.entity.DriverStatus;
import com.ambulance.management.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ambulance.management.entity.Ambulance;
import com.ambulance.management.entity.AmbulanceStatus;
import com.ambulance.management.entity.EmergencyRequest;
import com.ambulance.management.entity.EmergencyStatus;

import com.ambulance.management.repository.AmbulanceRepository;
import com.ambulance.management.repository.EmergencyRequestRepository;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AmbulanceRepository ambulanceRepository,
            EmergencyRequestRepository emergencyRequestRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.ambulanceRepository = ambulanceRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
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

    // Admin creates a new driver account
    public User createDriver(String name, String email, String password, String contactNumber) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User driver = new User(name, email, password, Role.DRIVER);

        driver.setPassword(passwordEncoder.encode(password));
        driver.setContactNumber(contactNumber);
        driver.setDriverStatus(DriverStatus.OFF_DUTY);

        return userRepository.save(driver);
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

    @Transactional
    public void deleteDriver(Long driverId) {

        User driver = getUserById(driverId);

        // Verify that the user is a driver
        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException(
                    "User is not a driver");
        }

        // Prevent deletion during an active emergency
        List<EmergencyStatus> activeStatuses = List.of(
                EmergencyStatus.PENDING,
                EmergencyStatus.ACCEPTED,
                EmergencyStatus.AMBULANCE_ASSIGNED,
                EmergencyStatus.DRIVER_ASSIGNED,
                EmergencyStatus.ON_THE_WAY,
                EmergencyStatus.PATIENT_PICKED_UP,
                EmergencyStatus.AT_HOSPITAL,
                EmergencyStatus.AT_PATIENT_LOCATION
        );

        List<EmergencyRequest> activeRequests =
                emergencyRequestRepository
                        .findByAssignedDriverAndStatusIn(
                                driver, activeStatuses);

        if (!activeRequests.isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete driver. Driver has an active emergency.");
        }

        // Find ambulances assigned to this driver
        List<Ambulance> ambulances =
                ambulanceRepository.findByDriver(driver);

        for (Ambulance ambulance : ambulances) {

            AmbulanceStatus status = ambulance.getStatus();

            if (status == AmbulanceStatus.ASSIGNED
                    || status == AmbulanceStatus.ON_THE_WAY
                    || status == AmbulanceStatus.AT_PATIENT_LOCATION
                    || status == AmbulanceStatus.TRANSPORTING_PATIENT) {

                throw new IllegalStateException(
                        "Cannot delete driver. Assigned ambulance is currently active.");
            }
        }

        // Preserve driver details in historical emergency records
        List<EmergencyRequest> historicalRequests =
                emergencyRequestRepository.findByAssignedDriver(driver);

        for (EmergencyRequest request : historicalRequests) {

            request.setAssignedDriverName(driver.getName());
            request.setAssignedDriverEmail(driver.getEmail());
            request.setAssignedDriverContact(driver.getContactNumber());

            // Clear the foreign-key relationship.
            // Snapshot fields remain unchanged.
            request.setAssignedDriver(null);
        }

        emergencyRequestRepository.saveAll(historicalRequests);

        // Unassign driver from ambulances
        for (Ambulance ambulance : ambulances) {
            ambulance.setDriver(null);
        }

        ambulanceRepository.saveAll(ambulances);

        // Permanently delete driver account
        userRepository.delete(driver);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


}
