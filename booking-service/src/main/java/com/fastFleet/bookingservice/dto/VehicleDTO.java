package com.fastFleet.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {
    private String id;
    private String model;
    private String brand;
    private double pricePerDay;
    private boolean available;
}
