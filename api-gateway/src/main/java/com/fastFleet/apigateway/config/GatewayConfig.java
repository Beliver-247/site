package com.fastFleet.apigateway.config;

import com.fastFleet.apigateway.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        @Value("${USER_SERVICE_URL:http://localhost:8181}")
        private String userServiceUrl;

        @Value("${VEHICLE_SERVICE_URL:http://localhost:8182}")
        private String vehicleServiceUrl;

        @Value("${BOOKING_SERVICE_URL:http://localhost:8183}")
        private String bookingServiceUrl;

        @Value("${NOTIFICATION_SERVICE_URL:http://localhost:8184}")
        private String notificationServiceUrl;

        @Bean
        public RouteLocator routes(RouteLocatorBuilder builder) {
                return builder.routes()
                                // User Service Routes
                                .route("user-service", r -> r
                                                .path("/api/users/**")
                                                .uri(userServiceUrl))

                                // Vehicle Service Routes
                                .route("vehicle-service", r -> r
                                                .path("/api/vehicles/**")
                                                .filters(f -> f.filter(jwtAuthenticationFilter
                                                                .apply(new JwtAuthenticationFilter.Config())))
                                                .uri(vehicleServiceUrl))

                                // Booking Service Routes
                                .route("booking-service", r -> r
                                                .path("/api/bookings/**")
                                                .filters(f -> f.filter(jwtAuthenticationFilter
                                                                .apply(new JwtAuthenticationFilter.Config())))
                                                .uri(bookingServiceUrl))

                                // Notification Service Routes
                                .route("notification-service", r -> r
                                                .path("/api/notifications/**")
                                                .filters(f -> f.filter(jwtAuthenticationFilter
                                                                .apply(new JwtAuthenticationFilter.Config())))
                                                .uri(notificationServiceUrl))

                                .build();
        }
}
