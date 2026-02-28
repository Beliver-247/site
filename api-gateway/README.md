# API Gateway

Central entry point for all client requests with JWT authentication and routing.

## Routing

The gateway routes requests to the appropriate microservices:

| Path | Service | Port |
|------|---------|------|
| `/api/users/**` | User Service | 8081 |
| `/api/vehicles/**` | Vehicle Service | 8082 |
| `/api/bookings/**` | Booking Service | 8083 |
| `/api/notifications/**` | Notification Service | 8084 |

## Authentication

### Public Endpoints (No JWT Required)
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/vehicles/**`

### Protected Endpoints (JWT Required)
- All `/api/bookings/**` endpoints
- All `/api/notifications/**` endpoints
- `GET /api/users/{id}`

### JWT Token Format
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## Features

1. **JWT Validation**: Validates JWT tokens on protected routes
2. **User ID Forwarding**: Adds `X-User-Id` header for authenticated requests
3. **Route Mapping**: Routes requests to correct microservice
4. **Health Checks**: Monitors service health
5. **Request Logging**: Logs incoming requests

## Running

### With Docker
```bash
docker build -t api-gateway .
docker run -e JWT_SECRET=your-secret-key \
           -p 8080:8080 api-gateway
```

### Locally
```bash
export JWT_SECRET=your-secret-key
mvn spring-boot:run
```

## Configuration

- `jwt.secret` - Must match the secret used by User Service (min 32 chars)

## Example Request Flow

```
Client Request
     │
     ▼
  Gateway (8080)
  - Validate JWT
  - Extract userId
  - Add X-User-Id header
     │
     ├─► Router
     │   ├─► /api/users/** → User Service (8081)
     │   ├─► /api/vehicles/** → Vehicle Service (8082)
     │   ├─► /api/bookings/** → Booking Service (8083)
     │   └─► /api/notifications/** → Notification Service (8084)
     │
     ▼
  Service Response
     │
     ▼
  Gateway Response
     │
     ▼
  Client
```

## Health Endpoint

```bash
curl http://localhost:8080/actuator/health

Response:
{
  "status": "UP",
  "components": {
    "diskSpace": {...},
    "livenessState": {...},
    "readinessState": {...}
  }
}
```

## Error Handling

### Unauthorized (No Token)
```
401 Unauthorized
{
  "timestamp": "2024-02-22T10:30:00",
  "status": 401,
  "message": "Unauthorized"
}
```

### Invalid Token
```
401 Unauthorized
{
  "timestamp": "2024-02-22T10:30:00",
  "status": 401,
  "message": "Invalid token"
}
```

### Service Not Available
```
503 Service Unavailable
{
  "timestamp": "2024-02-22T10:30:00",
  "status": 503,
  "message": "Service unavailable"
}
```

## Security Headers

The gateway adds/validates:
- `Authorization`: Bearer token
- `X-User-Id`: User ID from token (added by gateway)
- `Content-Type`: Application type

## Rate Limiting (Future)

Currently not implemented but can be added via:
- Spring Cloud Gateway Rate Limiter
- Redis-backed distributed rate limiting
- Per-user request quotas
