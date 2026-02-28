package com.fastFleet.vehicleservice.repository;

import com.fastFleet.vehicleservice.entity.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findByAvailableTrue();
}
