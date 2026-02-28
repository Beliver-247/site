package com.fastFleet.bookingservice.entity;

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
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;

    private String userId;
    private String vehicleId;
    private long startDate;
    private long endDate;
    private double totalAmount;
    private String status; // PENDING, CONFIRMED, REJECTED, CANCELLED

    private long createdAt;
    private long updatedAt;
}
