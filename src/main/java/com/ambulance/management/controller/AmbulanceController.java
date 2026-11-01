
package com.ambulance.management.controller;

import com.ambulance.management.dto.AmbulanceResponse;
import com.ambulance.management.dto.LocationUpdateRequest;
import com.ambulance.management.entity.Ambulance;
import com.ambulance.management.service.AmbulanceService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ambulance.management.dto.AmbulanceCreateRequest;
import com.ambulance.management.dto.AmbulanceStatusRequest;
import com.ambulance.management.service.LocationBroadcastService;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;
    private final LocationBroadcastService locationBroadcastService;

    public AmbulanceController(
            AmbulanceService ambulanceService,
            LocationBroadcastService locationBroadcastService) {

        this.ambulanceService = ambulanceService;
        this.locationBroadcastService = locationBroadcastService;
    }
    // ADMIN: Register a new ambulance

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AmbulanceResponse> createAmbulance(
            @Valid @RequestBody AmbulanceCreateRequest request) {

        Ambulance ambulance = new Ambulance();
        ambulance.setAmbulanceNumber(request.getAmbulanceNumber());
        ambulance.setVehicleNumber(request.getVehicleNumber());

        Ambulance saved = ambulanceService.createAmbulance(ambulance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AmbulanceResponse(saved));
    }


    // Authenticated users: List all ambulances
    @GetMapping
    public ResponseEntity<List<AmbulanceResponse>> getAllAmbulances() {

        List<AmbulanceResponse> responses =
                ambulanceService.getAllAmbulances()
                        .stream()
                        .map(AmbulanceResponse::new)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    // Authenticated users: List available ambulances
    @GetMapping("/available")
    public ResponseEntity<List<AmbulanceResponse>> getAvailableAmbulances() {

        List<AmbulanceResponse> responses =
                ambulanceService.getAvailableAmbulances()
                        .stream()
                        .map(AmbulanceResponse::new)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    // Authenticated users: View one ambulance
    @GetMapping("/{id}")
    public ResponseEntity<AmbulanceResponse> getAmbulanceById(
            @PathVariable Long id) {

        Ambulance ambulance =
                ambulanceService.getAmbulanceById(id);

        return ResponseEntity.ok(new AmbulanceResponse(ambulance));
    }

    // ADMIN: Assign a driver
    @PutMapping("/{ambulanceId}/assign-driver/{driverId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AmbulanceResponse> assignDriver(
            @PathVariable Long ambulanceId,
            @PathVariable Long driverId) {

        Ambulance ambulance =
                ambulanceService.assignDriver(ambulanceId, driverId);

        return ResponseEntity.ok(new AmbulanceResponse(ambulance));
    }

    // DRIVER: Update assigned ambulance location
    // DRIVER: Update assigned ambulance location and broadcast via WebSocket
    @PutMapping("/{ambulanceId}/location")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<AmbulanceResponse> updateLocation(
            @PathVariable Long ambulanceId,
            @Valid @RequestBody LocationUpdateRequest request,
            Authentication authentication) {

        // Update GPS location in database
        Ambulance updated = ambulanceService.updateLocation(
                ambulanceId,
                authentication.getName(),
                request.getLatitude(),
                request.getLongitude()
        );

        // Convert updated ambulance to response DTO
        AmbulanceResponse response = new AmbulanceResponse(updated);

        // Broadcast location to connected dashboards
        locationBroadcastService.broadcastLocation(response);

        return ResponseEntity.ok(response);
    }


    // ADMIN: Update GPS location of any ambulance
    @PutMapping("/{ambulanceId}/admin-location")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AmbulanceResponse> updateAdminLocation(
            @PathVariable Long ambulanceId,
            @Valid @RequestBody LocationUpdateRequest request) {

        Ambulance updated = ambulanceService.updateAdminLocation(
                ambulanceId,
                request.getLatitude(),
                request.getLongitude()
        );

        return ResponseEntity.ok(new AmbulanceResponse(updated));
    }


    @PutMapping("/{ambulanceId}/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<AmbulanceResponse> updateStatus(
            @PathVariable Long ambulanceId,
            @Valid @RequestBody AmbulanceStatusRequest request,
            Authentication authentication) {

        Ambulance updated = ambulanceService.updateStatus(
                ambulanceId,
                authentication.getName(),
                request.getStatus()
        );

        return ResponseEntity.ok(new AmbulanceResponse(updated));
    }


    @PutMapping("/{ambulanceId}/maintenance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AmbulanceResponse> updateMaintenanceStatus(
            @PathVariable Long ambulanceId,
            @RequestBody AmbulanceStatusRequest request) {

        Ambulance updated = ambulanceService.updateMaintenanceStatus(
                ambulanceId,
                request.getStatus()
        );

        return ResponseEntity.ok(new AmbulanceResponse(updated));
    }


}
