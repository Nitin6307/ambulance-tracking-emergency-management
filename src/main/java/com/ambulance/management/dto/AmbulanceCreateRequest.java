
package com.ambulance.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AmbulanceCreateRequest {

    @NotBlank(message = "Ambulance number is required")
    @Size(max = 30)
    private String ambulanceNumber;

    @NotBlank(message = "Vehicle number is required")
    @Size(max = 20)
    private String vehicleNumber;

    public AmbulanceCreateRequest() {
    }

    public String getAmbulanceNumber() {
        return ambulanceNumber;
    }

    public void setAmbulanceNumber(String ambulanceNumber) {
        this.ambulanceNumber = ambulanceNumber;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
}
