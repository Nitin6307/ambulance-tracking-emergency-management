
package com.ambulance.management.dto;

import com.ambulance.management.entity.AmbulanceStatus;
import jakarta.validation.constraints.NotNull;

public class AmbulanceStatusRequest {

    @NotNull(message = "Ambulance status is required")
    private AmbulanceStatus status;

    public AmbulanceStatusRequest() {
    }

    public AmbulanceStatus getStatus() {
        return status;
    }

    public void setStatus(AmbulanceStatus status) {
        this.status = status;
    }
}
