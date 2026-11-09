
package com.ambulance.management.dto;

import com.ambulance.management.entity.DriverStatus;
import jakarta.validation.constraints.NotNull;

public class DriverStatusUpdateRequest {

    @NotNull(message = "Driver status is required")
    private DriverStatus driverStatus;

    public DriverStatus getDriverStatus() {
        return driverStatus;
    }

    public void setDriverStatus(DriverStatus driverStatus) {
        this.driverStatus = driverStatus;
    }
}
