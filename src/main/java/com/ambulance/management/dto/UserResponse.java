package com.ambulance.management.dto;

import com.ambulance.management.entity.Role;
import com.ambulance.management.entity.DriverStatus;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private DriverStatus driverStatus;

    public UserResponse() {
    }

    public UserResponse(Long id, String name, String email,
                        Role role, DriverStatus driverStatus) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.driverStatus = driverStatus;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public DriverStatus getDriverStatus() {
        return driverStatus;
    }
}