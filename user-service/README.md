# User Service

User registration, authentication, and JWT management service.

## Endpoints

### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "USER"
}
```

### Get User by ID
```
GET /api/users/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

## Running

### With Docker
```bash
docker build -t user-service .
docker run -e MONGODB_URI=mongodb://localhost:27017/user-db \
           -e JWT_SECRET=your-secret-key \
           -p 8081:8081 user-service
```

### Locally
```bash
mvn spring-boot:run
```

## Database
- MongoDB database: `user-db`
- Collection: `users`

## Configuration
- `spring.data.mongodb.uri` - MongoDB connection string
- `jwt.secret` - JWT signing secret (min 32 chars)
- `jwt.expiration` - Token expiration in ms (default: 86400000 = 24 hours)
