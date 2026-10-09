package com.portfoliopilot.dto;

/** Returned by register + login: token for the Authorization header, user for the UI. */
public record AuthResponse(String token, UserDto user) {
}
