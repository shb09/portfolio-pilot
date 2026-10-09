package com.portfoliopilot.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** API contract for registration. @Valid in the controller enforces these. */
public record RegisterRequest(
        @NotBlank(message = "name is required") @Size(max = 100) String name,
        @NotBlank(message = "email is required") @Email(message = "must be a valid email") @Size(max = 180) String email,
        @NotBlank(message = "password is required") @Size(min = 8, max = 100, message = "password must be 8-100 characters") String password) {
}
