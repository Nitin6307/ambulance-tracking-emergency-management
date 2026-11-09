
package com.ambulance.management.service;

import com.ambulance.management.entity.Ambulance;
import com.ambulance.management.entity.AmbulanceStatus;
import com.ambulance.management.entity.DriverStatus;
import com.ambulance.management.entity.Role;
import com.ambulance.management.entity.User;
import com.ambulance.management.repository.AmbulanceRepository;
import com.ambulance.management.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AmbulanceService {

    private final AmbulanceRepository ambulanceRepository;
    private final UserRepository userRepository;

    public AmbulanceService(
            AmbulanceRepository ambulanceRepository,
            UserRepository userRepository) {
        this.ambulanceRepository = ambulanceRepository;
        this.userRepository = userRepository;
    }

    // 1. Create a new ambulance
    @Transactional
    public Ambulance createAmbulance(Ambulance ambulance) {

        if (ambulanceRepository.existsByAmbulanceNumber(
                ambulance.getAmbulanceNumber())) {
            throw new IllegalArgumentException(
                    "Ambulance number already exists");
        }

        if (ambulanceRepository.existsByVehicleNumber(
                ambulance.getVehicleNumber())) {
            throw new IllegalArgumentException(
                    "Vehicle registration number already exists");
        }

        ambulance.setStatus(AmbulanceStatus.AVAILABLE);
        ambulance.setDriver(null);

        return ambulanceRepository.save(ambulance);
    }

    // 2. Get all ambulances
    @Transactional(readOnly = true)
    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }

    // 3. Get an ambulance by ID
    @Transactional(readOnly = true)
    public Ambulance getAmbulanceById(Long id) {
        return ambulanceRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Ambulance not found with ID: " + id));
    }

    // 4. Get available ambulances
    @Transactional(readOnly = true)
    public List<Ambulance> getAvailableAmbulances() {
        return ambulanceRepository.findByStatus(
                AmbulanceStatus.AVAILABLE);
    }

    // 5. Assign a driver to an ambulance
    @Transactional
    public Ambulance assignDriver(Long ambulanceId, Long driverId) {

        Ambulance ambulance = getAmbulanceById(ambulanceId);

        User driver = userRepository.findById(driverId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Driver not found"));

        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException(
                    "The selected user is not a DRIVER");
        }

        if (ambulance.getStatus() != AmbulanceStatus.AVAILABLE) {
            throw new IllegalArgumentException(
                    "Only available ambulances can be assigned");
        }

        if (driver.getDriverStatus() != DriverStatus.AVAILABLE) {
            throw new IllegalArgumentException(
                    "Driver is not available for assignment");
        }

        // Extra protection against duplicate ambulance assignments
        if (ambulanceRepository.existsByDriverId(driverId)) {
            throw new IllegalArgumentException(
                    "Driver is already assigned to another ambulance");
        }

        ambulance.setDriver(driver);
        ambulance.setStatus(AmbulanceStatus.ASSIGNED);

        // Update driver availability
        driver.setDriverStatus(DriverStatus.ASSIGNED);

        userRepository.save(driver);

        return ambulanceRepository.save(ambulance);
    }

    // 6. Update ambulance location (assigned driver only)
    @Transactional
    public Ambulance updateLocation(
            Long ambulanceId,
            String driverEmail,
            BigDecimal latitude,
            BigDecimal longitude) {

        Ambulance ambulance = getAmbulanceById(ambulanceId);

        if (ambulance.getDriver() == null
                || !ambulance.getDriver().getEmail().equals(driverEmail)) {
            throw new AccessDeniedException(
                    "You are not assigned to this ambulance");
        }

        ambulance.setLatitude(latitude);
        ambulance.setLongitude(longitude);

        return ambulanceRepository.save(ambulance);
    }

    // 7. ADMIN: Update GPS location of any ambulance
    @Transactional
    public Ambulance updateAdminLocation(
            Long ambulanceId,
            BigDecimal latitude,
            BigDecimal longitude) {

        Ambulance ambulance = getAmbulanceById(ambulanceId);

        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException(
                    "Latitude and longitude are required");
        }

        if (latitude.compareTo(BigDecimal.valueOf(-90)) < 0
                || latitude.compareTo(BigDecimal.valueOf(90)) > 0) {
            throw new IllegalArgumentException(
                    "Latitude must be between -90 and 90");
        }

        if (longitude.compareTo(BigDecimal.valueOf(-180)) < 0
                || longitude.compareTo(BigDecimal.valueOf(180)) > 0) {
            throw new IllegalArgumentException(
                    "Longitude must be between -180 and 180");
        }

        ambulance.setLatitude(latitude);
        ambulance.setLongitude(longitude);

        return ambulanceRepository.save(ambulance);
    }

    // 8. Update ambulance status
    @Transactional
    public Ambulance updateStatus(
            Long ambulanceId,
            String driverEmail,
            AmbulanceStatus newStatus) {

        Ambulance ambulance = getAmbulanceById(ambulanceId);

        if (ambulance.getDriver() == null
                || !ambulance.getDriver().getEmail().equals(driverEmail)) {
            throw new AccessDeniedException(
                    "You are not assigned to this ambulance");
        }

        boolean validTransition =
                (ambulance.getStatus() == AmbulanceStatus.ASSIGNED
                        && newStatus == AmbulanceStatus.ON_THE_WAY)
                        ||
                        (ambulance.getStatus() == AmbulanceStatus.ON_THE_WAY
                                && newStatus == AmbulanceStatus.AT_PATIENT_LOCATION)
                        ||
                        (ambulance.getStatus() == AmbulanceStatus.AT_PATIENT_LOCATION
                                && newStatus == AmbulanceStatus.TRANSPORTING_PATIENT)
                        ||
                        (ambulance.getStatus() == AmbulanceStatus.TRANSPORTING_PATIENT
                                && newStatus == AmbulanceStatus.AVAILABLE);

        if (!validTransition) {
            throw new IllegalArgumentException(
                    "Invalid ambulance status transition");
        }

        ambulance.setStatus(newStatus);

        User driver = ambulance.getDriver();

        // Driver starts handling an emergency
        if (newStatus == AmbulanceStatus.ON_THE_WAY) {
            driver.setDriverStatus(DriverStatus.ON_DUTY);
            userRepository.save(driver);
        }

        // Release driver after completing the trip
        if (newStatus == AmbulanceStatus.AVAILABLE) {
            driver.setDriverStatus(DriverStatus.AVAILABLE);
            userRepository.save(driver);

            ambulance.setDriver(null);
        }

        return ambulanceRepository.save(ambulance);
    }

    // 9. Update ambulance maintenance status
    @Transactional
    public Ambulance updateMaintenanceStatus(
            Long ambulanceId,
            AmbulanceStatus newStatus) {

        Ambulance ambulance = getAmbulanceById(ambulanceId);

        if (newStatus == AmbulanceStatus.OUT_OF_SERVICE) {

            if (ambulance.getStatus() != AmbulanceStatus.AVAILABLE) {
                throw new IllegalArgumentException(
                        "Only available ambulances can be sent for maintenance");
            }

            ambulance.setStatus(AmbulanceStatus.OUT_OF_SERVICE);

        } else if (newStatus == AmbulanceStatus.AVAILABLE) {

            if (ambulance.getStatus() != AmbulanceStatus.OUT_OF_SERVICE) {
                throw new IllegalArgumentException(
                        "Only ambulances under maintenance can be restored");
            }

            ambulance.setStatus(AmbulanceStatus.AVAILABLE);

        } else {
            throw new IllegalArgumentException(
                    "Admin can only set OUT_OF_SERVICE or AVAILABLE");
        }

        return ambulanceRepository.save(ambulance);
    }
}
