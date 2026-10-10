package com.portfoliopilot.service;

import com.portfoliopilot.dto.LoginRequest;
import com.portfoliopilot.dto.RegisterRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Bean-validation contracts, no Spring context needed. */
class DtoValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void validRegistrationPasses() {
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(
                new RegisterRequest("asha-01", "Asha", "asha@test.com", "password1234"));
        assertTrue(violations.isEmpty());
    }

    @Test
    void invalidRegistrationFailsEveryField() {
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(
                new RegisterRequest("BAD NAME!", "", "notanemail", "short"));
        assertEquals(4, violations.size());
    }

    @Test
    void blankLoginIdentifierRejected() {
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(
                new LoginRequest("  ", "password1234"));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("identifier")));
    }
}
