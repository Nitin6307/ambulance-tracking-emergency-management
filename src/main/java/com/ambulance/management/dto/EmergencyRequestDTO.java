
package com.ambulance.management.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class EmergencyRequestDTO {

    @NotNull(message = "Pickup latitude is required")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private BigDecimal pickupLatitude;

    @NotNull(message = "Pickup longitude is required")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private BigDecimal pickupLongitude;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String emergencyDescription;

    @Size(max = 20, message = "Contact number cannot exceed 20 characters")
    private String contactNumber;
}
