# Booking Service

Booking orchestration service with inter-service communication.

## Endpoints

### Create Booking
```
POST /api/bookings
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "507f1f77bcf86cd799439011",
  "vehicleId": "507f1f77bcf86cd799439012",
  "startDate": 1645000000000,
  "endDate": 1645086400000
}

Response: 201 Created
{
  "id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "vehicleId": "507f1f77bcf86cd799439012",
  "startDate": 1645000000000,
  "endDate": 1645086400000,
  "totalAmount": 50.0,
  "status": "CREATED",
  "createdAt": 1645086400000,
  "updatedAt": 1645086400000
}
```

### Get Booking by ID
```
GET /api/bookings/{id}
Authorization: Bearer {token}

Response: 200 OK
{...booking...}
```

### Get User Bookings
```
GET /api/bookings/user/{userId}
Authorization: Bearer {token}

Response: 200 OK
[
  {...booking...},
  {...booking...}
]
```

### Cancel Booking
```
PUT /api/bookings/{id}/cancel
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439013",
  "status": "CANCELLED",
  ...
}
```

## Inter-Service Communication

This service communicates with:
- **User Service** (8181): Validates user exists
- **Vehicle Service** (8182): Gets vehicle details and pricing
- **Notification Service** (8184): Creates booking notifications

## Running

### With Docker
```bash
docker build -t booking-service .
docker run -e MONGODB_URI=mongodb://localhost:27017/booking-db \
           -e USER_SERVICE_URL=http://user-service:8181 \
           -e VEHICLE_SERVICE_URL=http://vehicle-service:8182 \
           -e NOTIFICATION_SERVICE_URL=http://notification-service:8184 \
           -p 8183:8183 booking-service
```

### Locally
```bash
export USER_SERVICE_URL=http://localhost:8181
export VEHICLE_SERVICE_URL=http://localhost:8182
export NOTIFICATION_SERVICE_URL=http://localhost:8184
mvn spring-boot:run
```

## Database
- MongoDB database: `booking-db`
- Collection: `bookings`

## Configuration
- `spring.data.mongodb.uri` - MongoDB connection string
- `user-service.url` - User Service base URL
- `vehicle-service.url` - Vehicle Service base URL
- `notification-service.url` - Notification Service base URL
