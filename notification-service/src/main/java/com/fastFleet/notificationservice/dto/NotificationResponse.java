package com.fastFleet.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private String id;
    private String userId;
    private String bookingId;
    private String type;
    private String message;
    private String status;
    private long createdAt;
}
