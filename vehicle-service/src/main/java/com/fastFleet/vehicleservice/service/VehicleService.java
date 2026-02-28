package com.fastFleet.vehicleservice.service;

import com.fastFleet.vehicleservice.dto.CreateVehicleRequest;
import com.fastFleet.vehicleservice.dto.UpdateVehicleRequest;
import com.fastFleet.vehicleservice.dto.VehicleResponse;
import com.fastFleet.vehicleservice.entity.Vehicle;
import com.fastFleet.vehicleservice.exception.VehicleNotFoundException;
import com.fastFleet.vehicleservice.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
                .model(request.getModel())
                .brand(request.getBrand())
                .pricePerDay(request.getPricePerDay())
                .available(true)
                .createdAt(System.currentTimeMillis())
                .updatedAt(System.currentTimeMillis())
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return mapToResponse(savedVehicle);
    }

    public VehicleResponse updateVehicle(String id, UpdateVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));

        if (request.getModel() != null) {
            vehicle.setModel(request.getModel());
        }
        if (request.getBrand() != null) {
            vehicle.setBrand(request.getBrand());
        }
        if (request.getPricePerDay() != null) {
            vehicle.setPricePerDay(request.getPricePerDay());
        }
        if (request.getAvailable() != null) {
            vehicle.setAvailable(request.getAvailable());
        }

        vehicle.setUpdatedAt(System.currentTimeMillis());
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return mapToResponse(updatedVehicle);
    }

    public VehicleResponse getVehicleById(String id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));
        return mapToResponse(vehicle);
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> getAvailableVehicles() {
        return vehicleRepository.findByAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .model(vehicle.getModel())
                .brand(vehicle.getBrand())
                .pricePerDay(vehicle.getPricePerDay())
                .available(vehicle.isAvailable())
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }
}
