package com.fastFleet.bookingservice.client;

import com.fastFleet.bookingservice.dto.NotificationDTO;
import com.fastFleet.bookingservice.exception.ServiceCommunicationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class NotificationServiceClient {

    private final RestTemplate restTemplate;

    @Value("${notification-service.url:http://localhost:8084}")
    private String notificationServiceUrl;

    public void createNotification(NotificationDTO notification) {
        try {
            String url = notificationServiceUrl + "/api/notifications";
            restTemplate.postForObject(url, notification, Object.class);
        } catch (Exception e) {
            throw new ServiceCommunicationException("Failed to create notification in Notification Service", e);
        }
    }
}
