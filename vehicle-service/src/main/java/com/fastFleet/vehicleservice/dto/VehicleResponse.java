package com.fastFleet.vehicleservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {
    private String id;
    private String model;
    private String brand;
    private double pricePerDay;
    private boolean available;
    private long createdAt;
    private long updatedAt;
}
