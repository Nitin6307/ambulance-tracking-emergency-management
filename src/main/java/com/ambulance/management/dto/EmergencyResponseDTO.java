
package com.ambulance.management.dto;

import com.ambulance.management.entity.EmergencyRequest;
import com.ambulance.management.entity.EmergencyStatus;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class EmergencyResponseDTO {

    private Long id;
    private Long patientId;

    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;

    private String emergencyDescription;
    private String contactNumber;

    private EmergencyStatus status;

    private Long ambulanceId;

    private String assignedDriverName;
    private String assignedDriverEmail;
    private String assignedDriverContact;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmergencyResponseDTO(EmergencyRequest request) {

        this.id = request.getId();

        if (request.getPatient() != null) {
            this.patientId = request.getPatient().getId();
        }

        this.pickupLatitude = request.getPickupLatitude();
        this.pickupLongitude = request.getPickupLongitude();

        this.emergencyDescription =
                request.getEmergencyDescription();

        this.contactNumber = request.getContactNumber();

        this.status = request.getStatus();

        if (request.getAmbulance() != null) {
            this.ambulanceId = request.getAmbulance().getId();
        }

        // Preserve historical driver information
        this.assignedDriverName = request.getAssignedDriverName();
        this.assignedDriverEmail = request.getAssignedDriverEmail();
        this.assignedDriverContact = request.getAssignedDriverContact();

        // Fallback for older records that don't have snapshot data
        if (request.getAssignedDriver() != null) {

            if (this.assignedDriverName == null) {
                this.assignedDriverName =
                        request.getAssignedDriver().getName();
            }

            if (this.assignedDriverEmail == null) {
                this.assignedDriverEmail =
                        request.getAssignedDriver().getEmail();
            }

            if (this.assignedDriverContact == null) {
                this.assignedDriverContact =
                        request.getAssignedDriver().getContactNumber();
            }
        }

        this.createdAt = request.getCreatedAt();
        this.updatedAt = request.getUpdatedAt();
    }
}
