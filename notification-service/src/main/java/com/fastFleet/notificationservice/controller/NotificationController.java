package com.fastFleet.notificationservice.controller;

import com.fastFleet.notificationservice.dto.CreateNotificationRequest;
import com.fastFleet.notificationservice.dto.NotificationResponse;
import com.fastFleet.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody CreateNotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
