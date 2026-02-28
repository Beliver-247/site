package com.fastFleet.bookingservice.controller;

import com.fastFleet.bookingservice.dto.BookingResponse;
import com.fastFleet.bookingservice.dto.CreateBookingRequest;
import com.fastFleet.bookingservice.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }
}
