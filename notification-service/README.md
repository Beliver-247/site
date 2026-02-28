# Notification Service

Booking notification management service with pagination support.

## Endpoints

### Create Notification
```
POST /api/notifications
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "bookingId": "507f1f77bcf86cd799439013",
  "type": "BOOKING_CREATED",
  "message": "Your booking for Honda Civic has been created"
}

Response: 201 Created
{
  "id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439011",
  "bookingId": "507f1f77bcf86cd799439013",
  "type": "BOOKING_CREATED",
  "message": "Your booking for Honda Civic has been created",
  "status": "UNREAD",
  "createdAt": 1645086400000
}
```

### Get User Notifications
```
GET /api/notifications/user/{userId}?page=0&size=10
Authorization: Bearer {token}

Response: 200 OK
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "bookingId": "507f1f77bcf86cd799439013",
      "type": "BOOKING_CREATED",
      "message": "Your booking for Honda Civic has been created",
      "status": "UNREAD",
      "createdAt": 1645086400000
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "currentPage": 0,
  "pageSize": 10
}
```

### Get Notification by ID
```
GET /api/notifications/{id}
Authorization: Bearer {token}

Response: 200 OK
{...notification...}
```

### Mark Notification as Read
```
PUT /api/notifications/{id}/read
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439014",
  "status": "READ",
  ...
}
```

## Notification Types

- `BOOKING_CREATED`: Sent when a booking is created
- `BOOKING_CANCELLED`: Sent when a booking is cancelled

## Running

### With Docker
```bash
docker build -t notification-service .
docker run -e MONGODB_URI=mongodb://localhost:27017/notification-db \
           -p 8084:8084 notification-service
```

### Locally
```bash
mvn spring-boot:run
```

## Database
- MongoDB database: `notification-db`
- Collection: `notifications`

## Configuration
- `spring.data.mongodb.uri` - MongoDB connection string

## Pagination

The `GET /api/notifications/user/{userId}` endpoint supports:
- `page`: Page number (0-indexed, default: 0)
- `size`: Items per page (default: 10)

Example:
```
GET /api/notifications/user/507f1f77bcf86cd799439011?page=1&size=20
```
