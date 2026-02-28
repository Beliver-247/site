package com.fastFleet.bookingservice.service;

import com.fastFleet.bookingservice.client.NotificationServiceClient;
import com.fastFleet.bookingservice.client.UserServiceClient;
import com.fastFleet.bookingservice.client.VehicleServiceClient;
import com.fastFleet.bookingservice.dto.*;
import com.fastFleet.bookingservice.entity.Booking;
import com.fastFleet.bookingservice.exception.BookingNotFoundException;
import com.fastFleet.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserServiceClient userServiceClient;
    private final VehicleServiceClient vehicleServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    public BookingResponse createBooking(CreateBookingRequest request) {
        // Verify user exists
        UserDTO user = userServiceClient.getUserById(request.getUserId());

        // Get vehicle details
        VehicleDTO vehicle = vehicleServiceClient.getVehicleById(request.getVehicleId());

        // Calculate total amount (price per day * number of days)
        long days = (request.getEndDate() - request.getStartDate()) / (1000 * 60 * 60 * 24);
        double totalAmount = vehicle.getPricePerDay() * (days > 0 ? days : 1);

        // Create booking
        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .vehicleId(request.getVehicleId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalAmount(totalAmount)
                .status("PENDING")
                .createdAt(System.currentTimeMillis())
                .updatedAt(System.currentTimeMillis())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Create notification
        NotificationDTO notification = NotificationDTO.builder()
                .userId(request.getUserId())
                .bookingId(savedBooking.getId())
                .type("BOOKING_CREATED")
                .message("Your booking for " + vehicle.getBrand() + " " + vehicle.getModel() + " has been created")
                .build();

        try {
            notificationServiceClient.createNotification(notification);
        } catch (Exception e) {
            // Log error but don't fail the booking creation
            System.err.println("Failed to create notification: " + e.getMessage());
        }

        return mapToResponse(savedBooking);
    }

    public BookingResponse confirmBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus("CONFIRMED");
        booking.setUpdatedAt(System.currentTimeMillis());
        Booking updatedBooking = bookingRepository.save(booking);

        VehicleDTO vehicle = vehicleServiceClient.getVehicleById(booking.getVehicleId());

        NotificationDTO notification = NotificationDTO.builder()
                .userId(booking.getUserId())
                .bookingId(bookingId)
                .type("BOOKING_CONFIRMED")
                .message("Your booking for " + vehicle.getBrand() + " " + vehicle.getModel() + " has been confirmed")
                .build();

        try {
            notificationServiceClient.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create confirmation notification: " + e.getMessage());
        }

        return mapToResponse(updatedBooking);
    }

    public BookingResponse rejectBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus("REJECTED");
        booking.setUpdatedAt(System.currentTimeMillis());
        Booking updatedBooking = bookingRepository.save(booking);

        VehicleDTO vehicle = vehicleServiceClient.getVehicleById(booking.getVehicleId());

        NotificationDTO notification = NotificationDTO.builder()
                .userId(booking.getUserId())
                .bookingId(bookingId)
                .type("BOOKING_REJECTED")
                .message("Your booking for " + vehicle.getBrand() + " " + vehicle.getModel() + " has been rejected")
                .build();

        try {
            notificationServiceClient.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create rejection notification: " + e.getMessage());
        }

        return mapToResponse(updatedBooking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(System.currentTimeMillis());
        Booking updatedBooking = bookingRepository.save(booking);

        // Get vehicle details for notification
        VehicleDTO vehicle = vehicleServiceClient.getVehicleById(booking.getVehicleId());

        // Create cancellation notification
        NotificationDTO notification = NotificationDTO.builder()
                .userId(booking.getUserId())
                .bookingId(bookingId)
                .type("BOOKING_CANCELLED")
                .message("Your booking for " + vehicle.getBrand() + " " + vehicle.getModel() + " has been cancelled")
                .build();

        try {
            notificationServiceClient.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create cancellation notification: " + e.getMessage());
        }

        return mapToResponse(updatedBooking);
    }

    public BookingResponse getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        return mapToResponse(booking);
    }

    public List<BookingResponse> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .vehicleId(booking.getVehicleId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
