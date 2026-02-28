package com.fastFleet.vehicleservice.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateVehicleRequest {
    private String model;
    private String brand;

    @Positive(message = "Price per day must be positive")
    private Double pricePerDay;

    private Boolean available;
}
