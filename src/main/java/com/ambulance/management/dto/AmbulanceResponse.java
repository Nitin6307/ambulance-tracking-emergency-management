
package com.ambulance.management.dto;

import com.ambulance.management.entity.Ambulance;
import com.ambulance.management.entity.AmbulanceStatus;

import java.math.BigDecimal;

public class AmbulanceResponse {

    private Long id;
    private String ambulanceNumber;
    private String vehicleNumber;
    private String driverName;
    private String driverEmail;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private AmbulanceStatus status;

    public AmbulanceResponse(Ambulance ambulance) {
        this.id = ambulance.getId();
        this.ambulanceNumber = ambulance.getAmbulanceNumber();
        this.vehicleNumber = ambulance.getVehicleNumber();
        this.latitude = ambulance.getLatitude();
        this.longitude = ambulance.getLongitude();
        this.status = ambulance.getStatus();

        if (ambulance.getDriver() != null) {
            this.driverName = ambulance.getDriver().getName();
            this.driverEmail = ambulance.getDriver().getEmail();
        }
    }

    public Long getId() {
        return id;
    }

    public String getAmbulanceNumber() {
        return ambulanceNumber;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getDriverEmail() {
        return driverEmail;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public AmbulanceStatus getStatus() {
        return status;
    }
}
