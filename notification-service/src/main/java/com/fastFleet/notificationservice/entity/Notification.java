package com.fastFleet.notificationservice.entity;

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
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    private String userId;
    private String bookingId;
    private String type; // BOOKING_CREATED, BOOKING_CANCELLED
    private String message;
    private String status; // READ, UNREAD

    @Builder.Default
    private long createdAt = System.currentTimeMillis();
}
