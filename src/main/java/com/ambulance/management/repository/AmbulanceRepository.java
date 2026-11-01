
package com.ambulance.management.repository;

import com.ambulance.management.entity.Ambulance;
import com.ambulance.management.entity.AmbulanceStatus;
import com.ambulance.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmbulanceRepository
        extends JpaRepository<Ambulance, Long> {

    boolean existsByAmbulanceNumber(String ambulanceNumber);

    boolean existsByVehicleNumber(String vehicleNumber);

    List<Ambulance> findByStatus(AmbulanceStatus status);

    List<Ambulance> findByDriver(User driver);

    boolean existsByDriverId(Long driverId);

    List<Ambulance> findByStatusAndLatitudeIsNotNullAndLongitudeIsNotNull(
            AmbulanceStatus status
    );
}
