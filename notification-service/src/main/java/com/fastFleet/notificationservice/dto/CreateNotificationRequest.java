package com.fastFleet.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Booking ID is required")
    private String bookingId;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Message is required")
    private String message;
}
