
package com.ambulance.management.repository;

import com.ambulance.management.entity.User;
import com.ambulance.management.entity.Role;
import com.ambulance.management.entity.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndDriverStatus(
            Role role,
            DriverStatus driverStatus
    );
}
