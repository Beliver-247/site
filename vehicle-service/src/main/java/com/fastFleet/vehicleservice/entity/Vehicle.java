package com.fastFleet.vehicleservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String id;

    private String model;
    private String brand;
    private double pricePerDay;

    @Builder.Default
    private boolean available = true;

    private long createdAt;
    private long updatedAt;
}
