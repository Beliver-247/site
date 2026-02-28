package com.fastFleet.vehicleservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVehicleRequest {
    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Brand is required")
    private String brand;

    @Positive(message = "Price per day must be positive")
    private double pricePerDay;
}
