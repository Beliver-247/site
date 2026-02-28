package com.fastFleet.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private String id;
    private String userId;
    private String vehicleId;
    private long startDate;
    private long endDate;
    private double totalAmount;
    private String status;
    private long createdAt;
    private long updatedAt;
}
