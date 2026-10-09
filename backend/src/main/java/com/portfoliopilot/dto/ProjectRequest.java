package com.portfoliopilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectRequest(
        @NotBlank(message = "title is required") @Size(max = 150) String title,
        String description,
        @Size(max = 500) String techStack,
        @Size(max = 300) String githubUrl,
        @Size(max = 300) String liveUrl,
        Boolean featured) {
}
