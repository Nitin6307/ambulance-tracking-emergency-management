
package com.ambulance.management.controller;

import com.ambulance.management.dto.EmergencyRequestDTO;
import com.ambulance.management.dto.EmergencyResponseDTO;
import com.ambulance.management.service.EmergencyRequestService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ambulance.management.dto.EmergencyStatusUpdateDTO;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-requests")
public class EmergencyRequestController {

    private final EmergencyRequestService emergencyRequestService;

    public EmergencyRequestController(
            EmergencyRequestService emergencyRequestService) {
        this.emergencyRequestService = emergencyRequestService;
    }

    // PATIENT: Create an emergency request
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<EmergencyResponseDTO> createEmergencyRequest(
            @Valid @RequestBody EmergencyRequestDTO requestDTO,
            Authentication authentication) {

        EmergencyResponseDTO response =
                emergencyRequestService.createEmergencyRequest(
                        requestDTO,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // PATIENT: View their own emergency requests
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<EmergencyResponseDTO>> getMyEmergencyRequests(
            Authentication authentication) {

        List<EmergencyResponseDTO> requests =
                emergencyRequestService.getMyEmergencyRequests(
                        authentication.getName()
                );

        return ResponseEntity.ok(requests);
    }
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmergencyResponseDTO>> getAllEmergencyRequests() {

        List<EmergencyResponseDTO> requests =
                emergencyRequestService.getAllEmergencyRequests();

        return ResponseEntity.ok(requests);
    }
    @PutMapping("/{requestId}/assign-nearest-ambulance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmergencyResponseDTO> assignNearestAmbulance(
            @PathVariable Long requestId) {

        EmergencyResponseDTO response =
                emergencyRequestService.assignNearestAmbulance(requestId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{requestId}/assign-driver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmergencyResponseDTO> assignDriver(
            @PathVariable Long requestId) {

        EmergencyResponseDTO response =
                emergencyRequestService.assignDriverToEmergencyRequest(requestId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/driver/my-requests")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<EmergencyResponseDTO>> getDriverEmergencyRequests(
            Authentication authentication) {

        List<EmergencyResponseDTO> requests =
                emergencyRequestService.getDriverEmergencyRequests(
                        authentication.getName());

        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<EmergencyResponseDTO> updateEmergencyStatus(
            @PathVariable Long requestId,
            @Valid @RequestBody EmergencyStatusUpdateDTO statusDTO,
            Authentication authentication) {

        EmergencyResponseDTO response =
                emergencyRequestService.updateEmergencyStatus(
                        requestId,
                        authentication.getName(),
                        statusDTO.getStatus()
                );

        return ResponseEntity.ok(response);
    }

    // PATIENT: Cancel their own pending emergency request
    @PutMapping("/{requestId}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<EmergencyResponseDTO> cancelEmergencyRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        EmergencyResponseDTO response =
                emergencyRequestService.cancelEmergencyRequest(
                        requestId,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

}
