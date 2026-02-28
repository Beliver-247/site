package com.fastFleet.notificationservice.service;

import com.fastFleet.notificationservice.dto.CreateNotificationRequest;
import com.fastFleet.notificationservice.dto.NotificationResponse;
import com.fastFleet.notificationservice.entity.Notification;
import com.fastFleet.notificationservice.exception.NotificationNotFoundException;
import com.fastFleet.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationResponse createNotification(CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .bookingId(request.getBookingId())
                .type(request.getType())
                .message(request.getMessage())
                .status("UNREAD")
                .createdAt(System.currentTimeMillis())
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        return mapToResponse(savedNotification);
    }

    public Page<NotificationResponse> getNotificationsByUser(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notifications = notificationRepository.findByUserId(userId, pageable);
        return notifications.map(this::mapToResponse);
    }

    public NotificationResponse getNotificationById(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
        return mapToResponse(notification);
    }

    public NotificationResponse markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));

        notification.setStatus("READ");
        Notification updatedNotification = notificationRepository.save(notification);
        return mapToResponse(updatedNotification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .bookingId(notification.getBookingId())
                .type(notification.getType())
                .message(notification.getMessage())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
