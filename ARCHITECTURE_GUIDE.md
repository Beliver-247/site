# ARCHITECTURE_GUIDE.md

## Clean Architecture Implementation

Each microservice follows a layered clean architecture pattern:

```
Service Package Structure
├── controller/
│   └── [Service]Controller.java          // REST endpoints
├── service/
│   └── [Service]Service.java             // Business logic
├── repository/
│   └── [Service]Repository.java          // Data access
├── entity/
│   └── [Entity].java                     // MongoDB documents
├── dto/
│   ├── [Request].java                    // Input DTOs
│   ├── [Response].java                   // Output DTOs
│   └── [Internal].java                   // Internal communication
├── exception/
│   └── Custom[Exception].java            // Domain exceptions
├── config/
│   ├── AppConfig.java                    // Bean configuration
│   └── GlobalExceptionHandler.java       // Error handling
└── [Service]Application.java             // Spring Boot entry
```

### Layer Responsibilities

#### 1. Controller Layer
- **Responsibility**: Handle HTTP requests/responses
- **Validation**: Accept and validate DTOs
- **Routing**: Map endpoints to service methods
- **Response**: Return appropriate HTTP status codes

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }
}
```

#### 2. Service Layer
- **Responsibility**: Business logic and orchestration
- **Processing**: Transform requests to domain models
- **Validation**: Implement business rules
- **Coordination**: Call repositories and other services

```java
@Service
public class UserService {
    public UserResponse register(UserRegisterRequest request) {
        // Business logic: validate, hash password, save
        User user = User.builder()
            .password(passwordEncoder.encode(request.getPassword()))
            .build();
        return mapToResponse(userRepository.save(user));
    }
}
```

#### 3. Repository Layer
- **Responsibility**: Data persistence and retrieval
- **Database Access**: Interact with MongoDB
- **Queries**: Execute MongoDB operations
- **No Business Logic**: Pure data operations

```java
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
```

#### 4. Entity Layer
- **Responsibility**: Domain objects and data models
- **Persistence**: Mapped to MongoDB collections
- **Properties**: Core business attributes
- **No Logic**: Data structure only

```java
@Document(collection = "users")
public class User {
    @Id
    private String id;
    @Indexed(unique = true)
    private String email;
    private String password;
}
```

#### 5. DTO Layer
- **Responsibility**: Data transfer objects
- **Validation**: Input validation rules
- **Mapping**: Separate API contracts from entities
- **Types**:
  - Request DTOs: Client → Service
  - Response DTOs: Service → Client
  - Internal DTOs: Service-to-Service communication

```java
// Input validation
public class UserRegisterRequest {
    @NotBlank
    @Email
    private String email;
}

// Output structure
public class UserResponse {
    private String id;
    private String name;
    private String email;
    // Password never exposed in response
}
```

#### 6. Exception Layer
- **Responsibility**: Domain-specific error handling
- **Custom Exceptions**: Business rule violations
- **Error Details**: Meaningful error messages

```java
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
```

#### 7. Config Layer
- **Responsibility**: Spring configuration
- **Beans**: Create managed instances
- **Security**: JWT, password encoding
- **Error Handling**: Global exception handlers

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFoundException(...) {
        // Handle with appropriate HTTP status
    }
}
```

## Data Flow Example: User Registration

```
HTTP Request: POST /api/users/register
    ↓
UserController.register()
    ├─ Receive UserRegisterRequest DTO
    ├─ Validate (annotations: @NotBlank, @Email, etc.)
    ├─ Call userService.register()
    │   ├─ Business Logic:
    │   │  ├─ Check if email exists
    │   │  ├─ Hash password with BCrypt
    │   │  ├─ Create User entity
    │   │  └─ Call userRepository.save()
    │   │      └─ MongoDB: Insert into users collection
    │   ├─ Return saved User entity
    │   └─ Map to UserResponse DTO
    │
    └─ Return ResponseEntity<UserResponse>
        ├─ HTTP Status: 201 Created
        └─ Body: UserResponse (without password)
                    ↓
            HTTP Response to Client
```

## Inter-Service Communication Flow

```
Booking Service Request: Create Booking
    └─ BookingController.createBooking()
        └─ BookingService.createBooking()
            ├─ Validate booking request
            ├─ Call UserServiceClient.getUserById()
            │   └─ REST Call to User Service
            │       └─ GET http://user-service:8181/api/users/{id}
            │           └─ UserService returns UserDTO
            │
            ├─ Call VehicleServiceClient.getVehicleById()
            │   └─ REST Call to Vehicle Service
            │       └─ GET http://vehicle-service:8182/api/vehicles/{id}
            │           └─ VehicleService returns VehicleDTO
            │
            ├─ Calculate Total Amount = VehicleDTO.pricePerDay * days
            │
            ├─ Create Booking entity
            ├─ Save to Repository
            │   └─ MongoDB: Insert into bookings collection
            │
            ├─ Call NotificationServiceClient.createNotification()
            │   └─ REST Call to Notification Service
            │       └─ POST http://notification-service:8184/api/notifications
            │           └─ NotificationService creates notification
            │
            └─ Map to BookingResponse and return
```

## Dependency Injection Pattern

Services use constructor injection for:
- Better testability (easy to mock)
- Explicit dependencies
- Immutability (@RequiredArgsConstructor from Lombok)

```java
@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserServiceClient userServiceClient;
    private final VehicleServiceClient vehicleServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    
    // All dependencies injected via constructor
    // Generated by Lombok @RequiredArgsConstructor
}
```

## Error Handling Strategy

### Validation Errors
```
400 Bad Request
{
  "timestamp": "2024-02-22T10:30:00",
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

### Business Logic Errors
```
409 Conflict
{
  "timestamp": "2024-02-22T10:30:00",
  "status": 409,
  "message": "User with email already exists"
}
```

### Not Found Errors
```
404 Not Found
{
  "timestamp": "2024-02-22T10:30:00",
  "status": 404,
  "message": "User not found with id: 123"
}
```

### Service Unavailable
```
503 Service Unavailable
{
  "timestamp": "2024-02-22T10:30:00",
  "status": 503,
  "message": "Failed to communicate with User Service"
}
```

## Security Architecture

### JWT Authentication Flow

```
User Login Request
    └─ UserController.login()
        └─ UserService.login()
            ├─ Find user by email
            ├─ Verify password with BCrypt
            ├─ Generate JWT Token via JwtProvider
            │   ├─ Subject: userId
            │   ├─ Claims: email
            │   ├─ Signed with: HMAC-SHA512
            │   └─ Expires: 24 hours
            └─ Return UserLoginResponse with token
                
API Request with Token
    └─ API Gateway
        ├─ Extract token from Authorization header
        ├─ Validate token with JwtValidator
        │   └─ Verify signature (HMAC-SHA512)
        ├─ Extract userId from token
        ├─ Add X-User-Id header
        └─ Forward to service
            └─ Service receives userId via header
```

### Password Hashing

BCrypt provides:
- Automatic salt generation
- Adaptive hashing (cost factor increases with time)
- One-way hashing (irreversible)

```java
PasswordEncoder encoder = new BCryptPasswordEncoder();

// Hashing
String hashedPassword = encoder.encode("plainPassword");
// Result: $2a$10$3b9Hv6v5b...

// Verification
boolean isMatch = encoder.matches("plainPassword", hashedPassword);
// true
```

## Configuration Management

### Environment Variables
```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster/db

# JWT
JWT_SECRET=your-very-secure-key-min-32-chars
JWT_EXPIRATION=86400000

# Service Discovery
USER_SERVICE_URL=http://user-service:8181
VEHICLE_SERVICE_URL=http://vehicle-service:8182
```

### Property Files
```properties
# application.properties
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/db}
jwt.secret=${JWT_SECRET:fallback-dev-secret}
user-service.url=${USER_SERVICE_URL:http://localhost:8181}
```

## Scalability Considerations

### Horizontal Scaling
- Each service can be scaled independently
- MongoDB Atlas provides auto-scaling
- Gateway distributes load

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling via Spring Data
- Pagination for large datasets

### Caching (Future)
- Redis for session caching
- Response caching on gateway
- Service-level caching

## Monitoring and Observability

### Health Endpoints
```bash
GET /actuator/health
{
  "status": "UP",
  "components": {
    "mongo": {"status": "UP"},
    "diskSpace": {"status": "UP"}
  }
}
```

### Application Metrics
- Available via `/actuator/metrics`
- JVM memory, threads, GC
- HTTP requests, response times

### Structured Logging
```json
{
  "timestamp": "2024-02-22T10:30:00",
  "level": "INFO",
  "logger": "com.fastFleet.userservice",
  "message": "User registered successfully",
  "user_id": "507f1f77bcf86cd799439011",
  "thread": "tomcat-1"
}
```

## Testing Strategy

### Unit Tests
- Test individual service methods
- Mock repositories
- Verify business logic

### Integration Tests
- Test service with real MongoDB
- Test exception handling
- Use Testcontainers

### Controller Tests
- Test endpoint routing
- Verify request/response DTOs
- Test validation errors

### API Tests
- End-to-end API testing
- Test gateway routing
- Verify JWT validation

---

This architecture ensures:
✅ **Separation of Concerns**: Each layer has a specific responsibility
✅ **Testability**: Easy to unit and integration test
✅ **Maintainability**: Changes isolated to relevant layers
✅ **Scalability**: Services scale independently
✅ **Security**: JWT + password hashing at every step
