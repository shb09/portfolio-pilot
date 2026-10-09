package com.portfoliopilot.repository;

import com.portfoliopilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * No implementation needed: Spring Data generates it.
 * findByEmail -> SELECT * FROM users WHERE email = ?
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
