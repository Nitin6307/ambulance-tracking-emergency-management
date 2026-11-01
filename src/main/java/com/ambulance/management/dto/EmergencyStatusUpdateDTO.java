package com.ambulance.management.dto;

import com.ambulance.management.entity.EmergencyStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class EmergencyStatusUpdateDTO {

    @NotNull(message = "Emergency status is required")
    private EmergencyStatus status;
}