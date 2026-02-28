package com.fastFleet.bookingservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Vehicle ID is required")
    private String vehicleId;

    @Positive(message = "Start date must be positive")
    private long startDate;

    @Positive(message = "End date must be positive")
    private long endDate;
}
