# QUICK_REFERENCE.md

## Quick Command Reference

### Local Development

```bash
# Build all services
mvn clean package

# Run with Docker Compose
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart user-service

# Build specific service
docker build -t user-service user-service/
```

### Service URLs (Default)

| Service | URL | Swagger |
|---------|-----|---------|
| API Gateway | http://localhost:8080 | http://localhost:8080/api-docs |
| User Service | http://localhost:8081 | http://localhost:8081/swagger-ui.html |
| Vehicle Service | http://localhost:8082 | http://localhost:8082/swagger-ui.html |
| Booking Service | http://localhost:8083 | http://localhost:8083/swagger-ui.html |
| Notification Service | http://localhost:8084 | http://localhost:8084/swagger-ui.html |

### Health Check

```bash
# Check all services
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
```

### Authentication

```bash
# Register user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Extract token and use in requests
TOKEN="eyJhbGciOiJIUzUxMiJ9..."
curl http://localhost:8080/api/bookings/user/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Vehicle Management

```bash
# Create vehicle
curl -X POST http://localhost:8080/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Civic",
    "brand": "Honda",
    "pricePerDay": 50.0
  }'

# Get all vehicles
curl http://localhost:8080/api/vehicles

# Get specific vehicle
curl http://localhost:8080/api/vehicles/{id}

# Update vehicle
curl -X PUT http://localhost:8080/api/vehicles/{id} \
  -H "Content-Type: application/json" \
  -d '{"pricePerDay": 55.0, "available": false}'
```

### Booking Management

```bash
# Create booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "USER_ID",
    "vehicleId": "VEHICLE_ID",
    "startDate": 1645000000000,
    "endDate": 1645086400000
  }'

# Get user bookings
curl http://localhost:8080/api/bookings/user/USER_ID \
  -H "Authorization: Bearer $TOKEN"

# Get specific booking
curl http://localhost:8080/api/bookings/{id} \
  -H "Authorization: Bearer $TOKEN"

# Cancel booking
curl -X PUT http://localhost:8080/api/bookings/{id}/cancel \
  -H "Authorization: Bearer $TOKEN"
```

### Notification Management

```bash
# Get user notifications
curl "http://localhost:8080/api/notifications/user/USER_ID?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"

# Mark notification as read
curl -X PUT http://localhost:8080/api/notifications/{id}/read \
  -H "Authorization: Bearer $TOKEN"
```

### Docker Commands

```bash
# List running containers
docker ps

# View logs
docker logs -f <container-id>

# Execute command in container
docker exec -it <container-id> sh

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# View resource usage
docker stats

# Prune unused resources
docker system prune -a
```

### MongoDB Commands

```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/user-db"

# List databases
show dbs

# Use database
use booking-db

# List collections
show collections

# Query data
db.bookings.find()
db.bookings.find({ userId: "USER_ID" })
db.bookings.findOne({ _id: ObjectId("...") })

# Aggregation
db.bookings.aggregate([
  { $match: { userId: "USER_ID" } },
  { $sort: { createdAt: -1 } },
  { $limit: 10 }
])

# Create index
db.users.createIndex({ email: 1 }, { unique: true })

# Check indexes
db.bookings.getIndexes()

# Count documents
db.users.countDocuments()
db.bookings.countDocuments({ status: "CREATED" })

# Delete
db.notifications.deleteMany({ userId: "USER_ID" })

# Backup
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore
mongorestore --uri "mongodb+srv://..." ./backup
```

### Maven Commands

```bash
# Clean build
mvn clean

# Compile
mvn compile

# Test
mvn test

# Skip tests
mvn clean package -DskipTests

# Install locally
mvn install

# Run Spring Boot
mvn spring-boot:run

# Check dependencies
mvn dependency:tree

# Update dependencies
mvn versions:display-dependency-updates
```

### Git Commands

```bash
# Clone
git clone <url>

# Create branch
git checkout -b feature/booking-enhancement

# Stage changes
git add .

# Commit
git commit -m "Add booking cancellation feature"

# Push
git push origin feature/booking-enhancement

# Create pull request (GitHub CLI)
gh pr create --title "Add booking cancellation" --body "Fixes #123"

# View workflow runs
gh run list

# View logs
gh run view <run-id> --log
```

## Port Reference

| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 8080 | Main entry point |
| User Service | 8081 | User management |
| Vehicle Service | 8082 | Vehicle data |
| Booking Service | 8083 | Booking orchestration |
| Notification Service | 8084 | Notifications |
| MongoDB (local) | 27017-27020 | Database |

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| MONGODB_URI | localhost:27017 | Database connection |
| JWT_SECRET | dev-secret | JWT signing key |
| JWT_EXPIRATION | 86400000 | Token lifetime (ms) |
| USER_SERVICE_URL | http://localhost:8081 | User Service address |
| VEHICLE_SERVICE_URL | http://localhost:8082 | Vehicle Service address |
| BOOKING_SERVICE_URL | http://localhost:8083 | Booking Service address |
| NOTIFICATION_SERVICE_URL | http://localhost:8084 | Notification Service address |

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | POST creates new resource |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing/invalid JWT |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal error |
| 503 | Service Unavailable | Dependency down |

## Common Issues & Solutions

### MongoDB Connection Refused
```bash
# Check if MongoDB is running
docker-compose ps

# Restart MongoDB
docker-compose restart mongodb-user

# Check connection string
echo $MONGODB_URI

# Test connection
mongosh "connection-string"
```

### JWT Token Expired
```bash
# Generate new token via login
TOKEN=$(curl -s http://localhost:8080/api/users/login -d ... | jq -r '.token')

# Use token in requests
curl -H "Authorization: Bearer $TOKEN" ...
```

### Service Not Found
```bash
# Check service health
curl http://localhost:8081/actuator/health

# View logs
docker-compose logs user-service

# Restart service
docker-compose restart user-service
```

### Port Already in Use
```bash
# Kill process on port
lsof -i :8080
kill -9 <PID>

# Or use different port
docker-compose.yml: edit ports section
```

### Build Failure
```bash
# Clean Maven cache
mvn clean

# Update dependencies
mvn dependency:resolve

# Full rebuild
mvn clean package -DskipTests

# Check Java version
java -version
# Should be 21 or higher
```

## Performance Tips

1. **Connection Pooling**: MongoDB driver manages automatically
2. **Indexing**: Create indexes on frequently queried fields
3. **Pagination**: Use page/size parameters for large datasets
4. **Caching**: Response caching at gateway (future enhancement)
5. **Logging**: Adjust log levels in production (INFO instead of DEBUG)

## Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] Passwords hashed with BCrypt
- [ ] No secrets in code/git
- [ ] HTTPS enabled in production
- [ ] MongoDB credentials protected
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured

---

**Need Help?**
- Check service logs: `docker-compose logs -f`
- View Swagger docs: `http://localhost:PORT/swagger-ui.html`
- Check README files in each service directory
- Review ARCHITECTURE_GUIDE.md for design details
