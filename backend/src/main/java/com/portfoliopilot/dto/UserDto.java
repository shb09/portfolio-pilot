package com.portfoliopilot.dto;

import com.portfoliopilot.entity.User;

/** Safe user shape for responses. Note: no password hash leaves the server. */
public record UserDto(Long id, String name, String email) {

    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail());
    }
}
