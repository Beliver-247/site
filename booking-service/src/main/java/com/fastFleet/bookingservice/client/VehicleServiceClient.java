package com.fastFleet.bookingservice.client;

import com.fastFleet.bookingservice.dto.VehicleDTO;
import com.fastFleet.bookingservice.exception.ServiceCommunicationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class VehicleServiceClient {

    private final RestTemplate restTemplate;

    @Value("${vehicle-service.url:http://localhost:8182}")
    private String vehicleServiceUrl;

    public VehicleDTO getVehicleById(String vehicleId) {
        try {
            String url = vehicleServiceUrl + "/api/vehicles/" + vehicleId;
            return restTemplate.getForObject(url, VehicleDTO.class);
        } catch (Exception e) {
            throw new ServiceCommunicationException("Failed to get vehicle from Vehicle Service", e);
        }
    }
}
