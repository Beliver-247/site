# Vehicle Rental System - Microservices Architecture

A production-ready, cloud-native microservice-based vehicle rental platform built with Spring Boot, featuring clean architecture, independent deployment, and comprehensive DevOps tooling.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Applications                      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    API Gateway       │
                    │   (Port 8080)        │
                    │  JWT Validation      │
                    └──────────┬───────────┘
                               │
        ┌──────────────┬───────┼────────┬──────────────┐
        ▼              ▼       ▼        ▼              ▼
   ┌─────────┐  ┌──────────┐ ┌──────┐ ┌──────────┐ ┌────────────┐
   │  User   │  │ Vehicle  │ │Book. │ │Notif.   │ │ Databases  │
   │Service  │  │ Service  │ │Service│ │ Service │ │  (MongoDB) │
   │(8081)   │  │  (8082)  │ │(8083)│ │ (8084)  │ │            │
   └─────────┘  └──────────┘ └──────┘ └──────────┘ └────────────┘
```

## Technology Stack

- **Framework**: Spring Boot 3.2.3
- **Language**: Java 21
- **Build Tool**: Maven
- **Persistence**: MongoDB (Atlas compatible)
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Containerization**: Docker (multi-stage builds)
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Authentication**: Spring Security + JWT
- **Password Hashing**: BCrypt
- **REST Communication**: Spring RestTemplate

## Services Overview

### 1. API Gateway (Port 8080)
- Routing to all microservices
- JWT validation and authentication
- X-User-Id header forwarding
- Rate limiting ready
- Health checks

### 2. User Service (Port 8081)
- User registration and authentication
- JWT token generation
- Password hashing with BCrypt
- User profile management
- Database: `user-db`

### 3. Vehicle Service (Port 8082)
- Vehicle CRUD operations
- Availability management
- Vehicle listing and filtering
- Database: `vehicle-db`

### 4. Booking Service (Port 8083)
- Booking creation and cancellation
- Inter-service orchestration
  - User Service validation
  - Vehicle details retrieval
  - Notification creation
- Database: `booking-db`

### 5. Notification Service (Port 8084)
- Notification storage and retrieval
- Pagination support
- Mark notifications as read
- Database: `notification-db`

## Database Design

Each service has its own dedicated MongoDB database:

```
MongoDB Databases:
├── user-db
│   └── users (unique: email)
├── vehicle-db
│   └── vehicles
├── booking-db
│   └── bookings
└── notification-db
    └── notifications
```

## Prerequisites

- Java 21 or higher
- Docker & Docker Compose
- Maven 3.9+
- MongoDB Atlas account (or local MongoDB)
- Git

## Quick Start

### Local Development with Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd vehicle-rental-system

# Copy environment template
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

All services will be available on:
- API Gateway: http://localhost:8080
- User Service: http://localhost:8081
- Vehicle Service: http://localhost:8082
- Booking Service: http://localhost:8083
- Notification Service: http://localhost:8084

### Local Development without Docker

```bash
# Install dependencies
mvn clean install

# Start each service in separate terminals

# Terminal 1: User Service
cd user-service
mvn spring-boot:run

# Terminal 2: Vehicle Service
cd vehicle-service
mvn spring-boot:run

# Terminal 3: Booking Service
cd booking-service
mvn spring-boot:run

# Terminal 4: Notification Service
cd notification-service
mvn spring-boot:run

# Terminal 5: API Gateway
cd api-gateway
mvn spring-boot:run
```

## API Documentation

### Swagger UI Access

- User Service: http://localhost:8081/swagger-ui.html
- Vehicle Service: http://localhost:8082/swagger-ui.html
- Booking Service: http://localhost:8083/swagger-ui.html
- Notification Service: http://localhost:8084/swagger-ui.html

## Sample API Workflows

### Workflow 1: User Registration and Login

```bash
# 1. Register User
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Response:
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}

# 2. Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Response:
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "USER"
}
```

### Workflow 2: Create and Manage Vehicles

```bash
# 1. Create Vehicle (No auth required for vehicles endpoint)
curl -X POST http://localhost:8080/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Civic",
    "brand": "Honda",
    "pricePerDay": 50.0
  }'

# Response:
{
  "id": "507f1f77bcf86cd799439012",
  "model": "Civic",
  "brand": "Honda",
  "pricePerDay": 50.0,
  "available": true,
  "createdAt": 1645000000000,
  "updatedAt": 1645000000000
}

# 2. Get All Vehicles
curl http://localhost:8080/api/vehicles

# 3. Get Vehicle by ID
curl http://localhost:8080/api/vehicles/507f1f77bcf86cd799439012
```

### Workflow 3: Create and Manage Bookings

```bash
# 1. Create Booking (Requires authentication)
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..." \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "vehicleId": "507f1f77bcf86cd799439012",
    "startDate": 1645000000000,
    "endDate": 1645086400000
  }'

# Response:
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

# 2. Get Bookings by User
curl http://localhost:8080/api/bookings/user/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."

# 3. Cancel Booking
curl -X PUT http://localhost:8080/api/bookings/507f1f77bcf86cd799439013/cancel \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

### Workflow 4: Manage Notifications

```bash
# 1. Get Notifications for User
curl "http://localhost:8080/api/notifications/user/507f1f77bcf86cd799439011?page=0&size=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."

# Response:
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
  "totalPages": 1,
  "totalElements": 1
}

# 2. Mark Notification as Read
curl -X PUT http://localhost:8080/api/notifications/507f1f77bcf86cd799439014/read \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

## Environment Configuration

Edit `.env` file before deployment:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vehicle-db

# JWT
JWT_SECRET=your-very-secure-secret-key-at-least-32-characters
JWT_EXPIRATION=86400000

# Service URLs (for internal communication)
USER_SERVICE_URL=http://user-service:8081
VEHICLE_SERVICE_URL=http://vehicle-service:8082
BOOKING_SERVICE_URL=http://booking-service:8083
NOTIFICATION_SERVICE_URL=http://notification-service:8084

# Docker Registry
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password
```

## Deployment

### Docker Compose (Development/Staging)

```bash
docker-compose -f docker-compose.yml up -d
```

### Kubernetes (Production)

```bash
# Build images
docker build -t your-registry/user-service user-service/
docker build -t your-registry/vehicle-service vehicle-service/
docker build -t your-registry/booking-service booking-service/
docker build -t your-registry/notification-service notification-service/
docker build -t your-registry/api-gateway api-gateway/

# Push to registry
docker push your-registry/user-service
docker push your-registry/vehicle-service
docker push your-registry/booking-service
docker push your-registry/notification-service
docker push your-registry/api-gateway

# Apply Kubernetes manifests (create manifest files)
kubectl apply -f k8s/
```

## Health Checks

All services expose health endpoints:

```bash
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
curl http://localhost:8080/actuator/health
```

## CI/CD Pipeline

GitHub Actions workflows:

- **build.yml**: Builds and tests on push to main/develop
- **docker.yml**: Builds and pushes Docker images on release
- **quality.yml**: Runs SonarQube code quality checks

Configure secrets in GitHub:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `SONAR_TOKEN`

## Security Best Practices

✅ JWT authentication with secure secret key
✅ BCrypt password hashing
✅ Protected endpoints with authorization
✅ CORS properly configured
✅ Input validation on all endpoints
✅ Global exception handling
✅ No hardcoded credentials
✅ Environment-based configuration

## Monitoring and Logging

Each service exposes:
- `/actuator/health` - Health status
- `/actuator/info` - Service info
- Structured logging with proper log levels
- Request/response logging in Gateway

## Testing

```bash
# Run all tests
mvn clean test

# Run specific service tests
cd user-service && mvn test

# Run with coverage
mvn clean test jacoco:report
```

## Troubleshooting

### Services not communicating
- Check MongoDB connectivity
- Verify service URLs in configuration
- Check network connectivity between containers
- Review gateway logs for routing issues

### JWT token expired
- Generate new token via login endpoint
- Check JWT_EXPIRATION setting
- Verify JWT_SECRET matches across services

### MongoDB connection refused
- Ensure MongoDB is running
- Check MONGODB_URI configuration
- Verify network connectivity

## Architecture Decisions

1. **Microservices**: Independent services for scalability and maintenance
2. **MongoDB**: Document-based for flexible schemas
3. **JWT**: Stateless authentication for distributed systems
4. **Service-to-Service**: REST API for simplicity (no complex messaging)
5. **Docker Compose**: Local development ease
6. **Multi-stage Docker**: Optimized image size
7. **Clean Architecture**: Separation of concerns (controller, service, repository)

## Future Enhancements

- [ ] Kafka integration for event streaming
- [ ] Service discovery (Eureka/Consul)
- [ ] API rate limiting
- [ ] Distributed tracing (Jaeger)
- [ ] Metrics collection (Prometheus)
- [ ] Advanced caching (Redis)
- [ ] Kubernetes deployment manifests
- [ ] Email notification integration
- [ ] Payment gateway integration
- [ ] Advanced search and filtering

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass
4. Submit a pull request
5. Follow code review comments

## License

MIT License

## Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Built with ❤️ using Spring Boot and Microservices Architecture**
