
package com.ambulance.management.repository;

import com.ambulance.management.entity.EmergencyRequest;
import com.ambulance.management.entity.EmergencyStatus;
import com.ambulance.management.entity.User;
import com.ambulance.management.entity.Ambulance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EmergencyRequestRepository
        extends JpaRepository<EmergencyRequest, Long> {

    // Find all emergency requests submitted by a patient
    List<EmergencyRequest> findByPatient(User patient);

    // Find requests by their current status
    List<EmergencyRequest> findByStatus(EmergencyStatus status);

    List<EmergencyRequest> findByAssignedDriverEmail(String email);

    // Find a patient's requests by status
    List<EmergencyRequest> findByPatientAndStatus(
            User patient,
            EmergencyStatus status);

    List<EmergencyRequest> findByAssignedDriver(User assignedDriver);

    // Find all emergency records associated with an ambulance
    List<EmergencyRequest> findByAmbulance(Ambulance ambulance);

    List<EmergencyRequest> findByAssignedDriverAndStatusIn(
            User assignedDriver,
            Collection<EmergencyStatus> statuses
    );


}
