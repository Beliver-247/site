package com.fastFleet.bookingservice.client;

import com.fastFleet.bookingservice.dto.UserDTO;
import com.fastFleet.bookingservice.exception.ServiceCommunicationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    @Value("${user-service.url:http://localhost:8081}")
    private String userServiceUrl;

    public UserDTO getUserById(String userId) {
        try {
            String url = userServiceUrl + "/api/users/" + userId;
            return restTemplate.getForObject(url, UserDTO.class);
        } catch (Exception e) {
            throw new ServiceCommunicationException("Failed to get user from User Service", e);
        }
    }
}
