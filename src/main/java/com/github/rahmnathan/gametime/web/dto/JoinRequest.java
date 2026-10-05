package com.github.rahmnathan.gametime.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record JoinRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must be 50 characters or less")
        String firstName,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[+]?[0-9\\-\\s()]{7,20}$", message = "Invalid phone number format")
        String phone
) {
}
