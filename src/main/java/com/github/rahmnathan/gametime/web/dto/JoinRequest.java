package com.github.rahmnathan.gametime.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JoinRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must be 50 characters or less")
        String firstName,

        @Size(max = 100, message = "Preferred game must be 100 characters or less")
        String preferredGame
) {
}
