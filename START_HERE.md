# START_HERE.md

# 🚀 Vehicle Rental System - START HERE

Welcome! This document guides you through the complete Vehicle Rental Microservices System.

## 📋 What You Have

A **production-ready microservice platform** with:
- ✅ 5 independent microservices
- ✅ API Gateway with JWT authentication
- ✅ MongoDB persistence (separate DB per service)
- ✅ Docker containerization
- ✅ Docker Compose orchestration
- ✅ GitHub Actions CI/CD
- ✅ Comprehensive documentation
- ✅ Clean architecture patterns
- ✅ Complete source code

## 🎯 Quick Start (5 Minutes)

### Option 1: Run with Docker Compose (Recommended)

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Verify services are running
docker-compose ps

# 4. Check health
curl http://localhost:8080/actuator/health

# 5. View logs
docker-compose logs -f
```

**All services ready in ~40 seconds!**

### Option 2: Run Locally (Without Docker)

```bash
# 1. Install dependencies
mvn clean install

# 2. Start services in separate terminals

# Terminal 1: User Service
cd user-service && mvn spring-boot:run

# Terminal 2: Vehicle Service
cd vehicle-service && mvn spring-boot:run

# Terminal 3: Booking Service
cd booking-service && mvn spring-boot:run

# Terminal 4: Notification Service
cd notification-service && mvn spring-boot:run

# Terminal 5: API Gateway
cd api-gateway && mvn spring-boot:run
```

## 📚 Documentation Guide

### For Quick Answers
👉 **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** (5 min read)
- API endpoints and examples
- Command reference
- Troubleshooting
- Port reference

### For API Usage
👉 **Individual Service READMEs**
- [user-service/README.md](user-service/README.md) - Authentication
- [vehicle-service/README.md](vehicle-service/README.md) - Vehicle management
- [booking-service/README.md](booking-service/README.md) - Booking operations
- [notification-service/README.md](notification-service/README.md) - Notifications
- [api-gateway/README.md](api-gateway/README.md) - Gateway routing

### For Understanding Architecture
👉 **[ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md)** (15 min read)
- Clean architecture explanation
- Layer responsibilities
- Data flow diagrams
- Security implementation
- Design patterns

### For Deployment
👉 **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** (20 min read)
- Local development setup
- Docker Compose deployment
- Kubernetes preparation
- MongoDB Atlas setup
- CI/CD configuration
- Production hardening

### For Complete Overview
👉 **[README.md](README.md)** (10 min read)
- System architecture
- Technology stack
- Feature overview
- Example workflows
- API documentation

### For Project Summary
👉 **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** (5 min read)
- What was built
- Key features
- Statistics
- Deliverables

### For Delivery Verification
👉 **[DELIVERABLES.md](DELIVERABLES.md)** (5 min read)
- Complete checklist
- What's included
- Code statistics

## 🌐 Access Services

After starting with `docker-compose up -d`:

| Service | URL | Swagger |
|---------|-----|---------|
| API Gateway | http://localhost:8080 | http://localhost:8080/api-docs |
| User Service | http://localhost:8081 | http://localhost:8081/swagger-ui.html |
| Vehicle Service | http://localhost:8082 | http://localhost:8082/swagger-ui.html |
| Booking Service | http://localhost:8083 | http://localhost:8083/swagger-ui.html |
| Notification Service | http://localhost:8084 | http://localhost:8084/swagger-ui.html |

## 🔐 Test Authentication

```bash
# 1. Register a user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# 2. Login and get token
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Copy the token from response and use it in authenticated requests:
TOKEN="eyJhbGciOiJIUzUxMiJ9..."

# 3. Test authenticated endpoint
curl http://localhost:8080/api/bookings/user/{userId} \
  -H "Authorization: Bearer $TOKEN"
```

## 🎓 Learning Path

**New to this system? Follow this order:**

### Day 1: Understand the System
1. Read [README.md](README.md) - 10 minutes
2. Look at [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 5 minutes
3. Try quick start with Docker Compose - 5 minutes
4. Use QUICK_REFERENCE.md for API examples - 10 minutes

### Day 2: Explore Code
1. Read [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) - 15 minutes
2. Examine User Service source code
3. Understand clean layered architecture
4. Review inter-service communication

### Day 3: Deploy and Configure
1. Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Configure .env file
3. Try different deployment option
4. Set up MongoDB Atlas (optional)

### Day 4: Customize
1. Add new fields to entities
2. Create new endpoints
3. Add custom business logic
4. Implement additional features

## 📁 Project Structure Overview

```
vehicle-rental-system/
├── api-gateway/              # REST route dispatcher + JWT validator
├── user-service/             # User auth + JWT generation
├── vehicle-service/          # Vehicle catalog management
├── booking-service/          # Booking orchestration
├── notification-service/     # Notification management
├── docker-compose.yml        # All services + MongoDB
├── .github/workflows/        # CI/CD pipelines
│
├── README.md                 # Main documentation
├── ARCHITECTURE_GUIDE.md     # Architecture deep dive
├── DEPLOYMENT_GUIDE.md       # Deployment guide
├── QUICK_REFERENCE.md        # Command & API reference
├── PROJECT_SUMMARY.md        # Project overview
├── DELIVERABLES.md           # Delivery checklist
└── START_HERE.md             # This file!
```

## 🆘 Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :8080
lsof -i :8081

# Check Docker logs
docker-compose logs -f user-service

# Clean rebuild
docker-compose down -v
docker-compose up -d
```

### MongoDB connection issues
```bash
# Verify MongoDB container is running
docker-compose ps

# Check connection string in .env
echo $MONGODB_URI

# Test connection
mongosh "mongodb://localhost:27017/user-db"
```

### JWT token expired
```bash
# Login again to get new token
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{...}'
```

**More help**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) Troubleshooting section

## 🚀 Next Steps

### For Development
1. Start with local Docker Compose setup
2. Read ARCHITECTURE_GUIDE.md
3. Explore code in each service
4. Try modifying and rebuilding

### For Production
1. Configure .env with production values
2. Read DEPLOYMENT_GUIDE.md
3. Set up MongoDB Atlas
4. Configure CI/CD secrets in GitHub
5. Deploy using chosen platform

### For Learning
1. Review clean architecture pattern
2. Study inter-service communication
3. Understand JWT authentication
4. Explore Spring Boot patterns
5. See Docker best practices

## 📞 Key Files Quick Access

| Need | File |
|------|------|
| Quick start commands | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |
| API examples | Individual service READMEs |
| Architecture explanation | [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) |
| Deployment steps | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) |
| Complete overview | [README.md](README.md) |
| What's included | [DELIVERABLES.md](DELIVERABLES.md) |
| User Service docs | [user-service/README.md](user-service/README.md) |
| Vehicle Service docs | [vehicle-service/README.md](vehicle-service/README.md) |
| Booking Service docs | [booking-service/README.md](booking-service/README.md) |
| Notification Service docs | [notification-service/README.md](notification-service/README.md) |
| Gateway docs | [api-gateway/README.md](api-gateway/README.md) |

## ✨ Key Features at a Glance

✅ **Microservices**: 5 independent, scalable services
✅ **Authentication**: JWT with BCrypt password hashing
✅ **API Gateway**: Centralized routing with JWT validation
✅ **Databases**: MongoDB (separate DB per service)
✅ **Docker**: Multi-stage builds, Docker Compose
✅ **CI/CD**: GitHub Actions automation
✅ **Documentation**: Complete guides + code examples
✅ **Clean Code**: SOLID principles, design patterns
✅ **API Docs**: Swagger/OpenAPI integration
✅ **Monitoring**: Actuator health endpoints

## 🎯 Common Tasks

### Register and Login
→ See [user-service/README.md](user-service/README.md)

### Create and Manage Vehicles
→ See [vehicle-service/README.md](vehicle-service/README.md)

### Create Bookings
→ See [booking-service/README.md](booking-service/README.md)

### Get Notifications
→ See [notification-service/README.md](notification-service/README.md)

### Route Requests
→ See [api-gateway/README.md](api-gateway/README.md)

### Configure Environment
→ Edit `.env` file (copy from `.env.example`)

### Deploy to Production
→ See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🎉 You're Ready!

1. ✅ You have complete source code
2. ✅ You have documentation
3. ✅ You have deployment options
4. ✅ You have examples

**Next step**: Follow the Quick Start above!

---

## 📧 Questions?

- Check the relevant README file
- Review QUICK_REFERENCE.md for command examples
- Check DEPLOYMENT_GUIDE.md for deployment questions
- Read ARCHITECTURE_GUIDE.md for design questions

---

**Happy coding! 🚀**

Last updated: February 22, 2026
Version: 1.0.0
Status: ✅ Production-Ready
