
package com.ambulance.management.service;

import com.ambulance.management.dto.EmergencyRequestDTO;
import com.ambulance.management.dto.EmergencyResponseDTO;

import com.ambulance.management.entity.Ambulance;
import com.ambulance.management.entity.AmbulanceStatus;
import com.ambulance.management.entity.DriverStatus;
import com.ambulance.management.entity.EmergencyRequest;
import com.ambulance.management.entity.EmergencyStatus;
import com.ambulance.management.entity.Role;
import com.ambulance.management.entity.User;

import com.ambulance.management.repository.AmbulanceRepository;
import com.ambulance.management.repository.EmergencyRequestRepository;
import com.ambulance.management.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class EmergencyRequestService {

    private final EmergencyRequestRepository emergencyRequestRepository;
    private final UserRepository userRepository;
    private final AmbulanceRepository ambulanceRepository;

    public EmergencyRequestService(
            EmergencyRequestRepository emergencyRequestRepository,
            UserRepository userRepository,
            AmbulanceRepository ambulanceRepository) {

        this.emergencyRequestRepository = emergencyRequestRepository;
        this.userRepository = userRepository;
        this.ambulanceRepository = ambulanceRepository;
    }

    // 1. Patient creates an emergency request
    @Transactional
    public EmergencyResponseDTO createEmergencyRequest(
            EmergencyRequestDTO requestDTO,
            String patientEmail) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Patient not found"));

        if (patient.getRole() != Role.PATIENT) {
            throw new AccessDeniedException(
                    "Only patients can create emergency requests");
        }

        EmergencyRequest request = new EmergencyRequest();

        request.setPatient(patient);
        request.setPickupLatitude(requestDTO.getPickupLatitude());
        request.setPickupLongitude(requestDTO.getPickupLongitude());
        request.setEmergencyDescription(
                requestDTO.getEmergencyDescription());
        request.setContactNumber(requestDTO.getContactNumber());

        request.setStatus(EmergencyStatus.PENDING);

        EmergencyRequest saved =
                emergencyRequestRepository.save(request);

        return new EmergencyResponseDTO(saved);
    }

    // 2. Patient views their own emergency requests
    @Transactional(readOnly = true)
    public List<EmergencyResponseDTO> getMyEmergencyRequests(
            String patientEmail) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Patient not found"));

        if (patient.getRole() != Role.PATIENT) {
            throw new AccessDeniedException(
                    "Only patients can view their emergency requests");
        }

        return emergencyRequestRepository.findByPatient(patient)
                .stream()
                .map(EmergencyResponseDTO::new)
                .toList();
    }

    // 3. Admin views all emergency requests
    @Transactional(readOnly = true)
    public List<EmergencyResponseDTO> getAllEmergencyRequests() {

        return emergencyRequestRepository.findAll()
                .stream()
                .map(EmergencyResponseDTO::new)
                .toList();
    }

    // 4. Calculate distance between two GPS coordinates
    private double calculateDistance(
            BigDecimal lat1, BigDecimal lon1,
            BigDecimal lat2, BigDecimal lon2) {

        final int EARTH_RADIUS = 6371;

        double latitude1 = Math.toRadians(lat1.doubleValue());
        double latitude2 = Math.toRadians(lat2.doubleValue());

        double latitudeDifference =
                Math.toRadians(lat2.doubleValue() - lat1.doubleValue());

        double longitudeDifference =
                Math.toRadians(lon2.doubleValue() - lon1.doubleValue());

        double a = Math.sin(latitudeDifference / 2)
                * Math.sin(latitudeDifference / 2)
                + Math.cos(latitude1) * Math.cos(latitude2)
                * Math.sin(longitudeDifference / 2)
                * Math.sin(longitudeDifference / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    // 5. Assign nearest available ambulance
    @Transactional
    public EmergencyResponseDTO assignNearestAmbulance(Long requestId) {

        EmergencyRequest request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Emergency request not found"));

        if (request.getStatus() != EmergencyStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending emergency requests can be assigned");
        }

        List<Ambulance> availableAmbulances =
                ambulanceRepository
                        .findByStatusAndLatitudeIsNotNullAndLongitudeIsNotNull(
                                AmbulanceStatus.AVAILABLE);

        if (availableAmbulances.isEmpty()) {
            throw new IllegalStateException(
                    "No available ambulance with GPS location found");
        }

        Ambulance nearestAmbulance = availableAmbulances.stream()
                .min(Comparator.comparingDouble(ambulance ->
                        calculateDistance(
                                request.getPickupLatitude(),
                                request.getPickupLongitude(),
                                ambulance.getLatitude(),
                                ambulance.getLongitude()
                        )))
                .orElseThrow();

        nearestAmbulance.setStatus(AmbulanceStatus.ASSIGNED);

        request.setAmbulance(nearestAmbulance);
        request.setStatus(EmergencyStatus.AMBULANCE_ASSIGNED);

        ambulanceRepository.save(nearestAmbulance);

        EmergencyRequest savedRequest =
                emergencyRequestRepository.save(request);

        return new EmergencyResponseDTO(savedRequest);
    }

    // 6. Assign an available driver to an emergency
    @Transactional
    public EmergencyResponseDTO assignDriverToEmergencyRequest(Long requestId) {

        EmergencyRequest request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Emergency request not found"));

        if (request.getStatus() != EmergencyStatus.AMBULANCE_ASSIGNED) {
            throw new IllegalStateException(
                    "An ambulance must be assigned before assigning a driver");
        }

        Ambulance ambulance = request.getAmbulance();

        if (ambulance == null) {
            throw new IllegalStateException(
                    "No ambulance assigned to this request");
        }

        User availableDriver;

        // Case 1: Ambulance already has a driver
        if (ambulance.getDriver() != null) {

            availableDriver = ambulance.getDriver();

            if (availableDriver.getRole() != Role.DRIVER) {
                throw new IllegalStateException(
                        "Assigned user is not a driver");
            }

            if (availableDriver.getDriverStatus() != DriverStatus.ASSIGNED) {
                throw new IllegalStateException(
                        "The ambulance's driver is not in ASSIGNED status");
            }

        } else {

            // Case 2: Find a driver whose status is AVAILABLE
            List<User> availableDrivers =
                    userRepository.findByRoleAndDriverStatus(
                            Role.DRIVER,
                            DriverStatus.AVAILABLE
                    );

            availableDriver = availableDrivers.stream()
                    .filter(driver ->
                            !ambulanceRepository.existsByDriverId(driver.getId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException(
                            "No available driver found. Please check driver availability."));

            // Assign driver to ambulance
            ambulance.setDriver(availableDriver);

            availableDriver.setDriverStatus(DriverStatus.ASSIGNED);

            userRepository.save(availableDriver);
            ambulanceRepository.save(ambulance);
        }

        // Link driver to emergency request
        request.setAssignedDriver(availableDriver);
        request.setStatus(EmergencyStatus.DRIVER_ASSIGNED);

        EmergencyRequest savedRequest =
                emergencyRequestRepository.save(request);

        return new EmergencyResponseDTO(savedRequest);
    }

    // 7. Driver views their assigned emergency requests
    @Transactional(readOnly = true)
    public List<EmergencyResponseDTO> getDriverEmergencyRequests(
            String driverEmail) {

        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Driver not found"));

        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalStateException(
                    "Only drivers can view assigned emergency requests");
        }

        return emergencyRequestRepository
                .findByAssignedDriverEmail(driverEmail)
                .stream()
                .map(EmergencyResponseDTO::new)
                .toList();
    }

    // 8. Driver updates emergency status
    @Transactional
    public EmergencyResponseDTO updateEmergencyStatus(
            Long requestId,
            String driverEmail,
            EmergencyStatus newStatus) {

        EmergencyRequest request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Emergency request not found"));

        Ambulance ambulance = request.getAmbulance();

        if (ambulance == null || ambulance.getDriver() == null
                || !ambulance.getDriver().getEmail().equals(driverEmail)) {
            throw new AccessDeniedException(
                    "You are not assigned to this emergency");
        }

        User driver = ambulance.getDriver();

        EmergencyStatus currentStatus = request.getStatus();

        boolean validTransition =
                (currentStatus == EmergencyStatus.DRIVER_ASSIGNED
                        && newStatus == EmergencyStatus.ON_THE_WAY)
                        || (currentStatus == EmergencyStatus.ON_THE_WAY
                        && newStatus == EmergencyStatus.AT_PATIENT_LOCATION)
                        || (currentStatus == EmergencyStatus.AT_PATIENT_LOCATION
                        && newStatus == EmergencyStatus.PATIENT_PICKED_UP)
                        || (currentStatus == EmergencyStatus.PATIENT_PICKED_UP
                        && newStatus == EmergencyStatus.AT_HOSPITAL)
                        || (currentStatus == EmergencyStatus.AT_HOSPITAL
                        && newStatus == EmergencyStatus.COMPLETED);

        if (!validTransition) {
            throw new IllegalStateException(
                    "Invalid emergency status transition");
        }

        // Preserve assigned driver in emergency record
        request.setAssignedDriver(driver);

        // Update emergency status
        request.setStatus(newStatus);

        // Synchronize ambulance and driver statuses
        switch (newStatus) {

            case ON_THE_WAY -> {
                ambulance.setStatus(AmbulanceStatus.ON_THE_WAY);
                driver.setDriverStatus(DriverStatus.ON_DUTY);
            }

            case AT_PATIENT_LOCATION ->
                    ambulance.setStatus(AmbulanceStatus.AT_PATIENT_LOCATION);

            case PATIENT_PICKED_UP ->
                    ambulance.setStatus(AmbulanceStatus.TRANSPORTING_PATIENT);

            case AT_HOSPITAL ->
                    ambulance.setStatus(AmbulanceStatus.TRANSPORTING_PATIENT);

            case COMPLETED -> {
                ambulance.setStatus(AmbulanceStatus.AVAILABLE);

                // Release driver after completing emergency
                driver.setDriverStatus(DriverStatus.AVAILABLE);
                ambulance.setDriver(null);
            }
        }

        // Save driver and ambulance changes
        userRepository.save(driver);
        ambulanceRepository.save(ambulance);

        EmergencyRequest savedRequest =
                emergencyRequestRepository.save(request);

        return new EmergencyResponseDTO(savedRequest);
    }
}
